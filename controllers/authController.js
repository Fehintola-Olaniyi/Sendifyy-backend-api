const User = require('../models/userModel');
const  bcrypt = require('bcryptjs');
const jwt =  require('jsonwebtoken');

// register new User
exports.register = async (req, res) => {
    const { name, email, password, domain } = req.body;

    try {
        //check if user already exists
        let user = await User.findOne({ email });
        if(user) {
            return res.status(400).json({ message: 'User already exists'});
        }

        // create new user
        user = new User ({
            name,
            email,
            password: bcrypt.hashSync(password, 10), //or hash instead of hashSync
            domain,
        });

        await user.save();

        const payload = { userId: user._id } //, name: user.name, email: user.email };


        //generate JWT token
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn:  '1h',
        });

        res.status(201).json({ token });

    } catch(error) {
        console.log('Register Error:', error.message);
        res.status(500).json({ message: 'Server Error'});
    }
};

exports.login = async  (req, res) => {
    const { email, password } = req.body;

    try {

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials'});
        }

        //check if the password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials'});
        }

        const payload = { userId: user._id};
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        res.status(200).json({ token });
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');

    }
}

