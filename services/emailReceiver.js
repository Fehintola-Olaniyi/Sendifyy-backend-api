const imaps = require("imap-simple");
const { simpleParser } = require("mailparser");
require("dotenv").config();

const config = {
  imap: {
    user: process.env.GMAIL_EMAIL,
    password: process.env.GMAIL_PASS,
    host: "imap.gmail.com",
    port: 993, //IMAP port for SSL
    tls: true,
    authTimeout: 3000,
    tlsOptions: { rejectUnauthorized: false },
  },
};

async function getEmails() {
  try {
    const connection = await imaps.connect({ imap: config.imap });
    await connection.openBox("INBOX");

    const searchCriteria = ["UNSEEN"];
    const fetchOptions = { bodies: ["HEADER", "TEXT"], markSeen: false };

    const messages = await connection.search(searchCriteria, fetchOptions);

    for (let message of messages) {
      const all = messages.parts.find((part) => part.which === "TEXT");
      const idHeader = "Imap-Id: " + message.attributes.uid + "\r\n";
      const mail = await simpleParser(idHeader + all.body);

      console.log(mail.subject);
      console.log(mail.from.text);
      console.log(mail.text);
    }
    connection.end();
  } catch (error) {
    console.error("Error retreiving emails: ", error);
  }
}

getEmails();
