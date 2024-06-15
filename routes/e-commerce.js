const express = require('express');
const router = express.Router();
const initializePassport = require('../passportConfig');
const passport = require('passport');
const session = require('express-session');
const validator = require('validator');
const bcrypt = require('bcrypt');
const isUserAuthenticated = require('../isUserAuthenticated');
const PgSimple = require('connect-pg-simple')(session);
const { Users, Products } = require('../models');
const { Op } = require('sequelize');
const adminRoute = require('./admin');
const userRoute = require('./users');

const store = new PgSimple({
    conString: `postgres://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`,
    tableName: 'session'
});

initializePassport(passport);

router.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    store,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        }
}));

router.use(passport.initialize());
router.use(passport.session());


router.post('/authentication/register', async (req, res) => {
    try {
        const { firstName, lastName, username, email, password, password2 } = req.body;
        if (!firstName || !lastName || !username || !email || !password || !password2) {
            return res.status(404).json({success: false, message: 'Missing required fields'});
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({success: false, message: 'Invalid email'});
        }

        const existingUserWithUsername = await Users.findOne({
            where: {
                username,
            }
        });

        if (existingUserWithUsername) {
            return res.status(400).json({success: false, message: 'User already exists with provided username'});
        }

        const existingUserWithEmail = await Users.findOne({
            where: {
                email,
            }
        });

        if (existingUserWithEmail) {
            return res.status(400).json({success: false, message: 'User already exists with provided email'});
        }

        if (!validator.equals(password, password2)) {
            return res.status(400).json({success: false, message: 'Passwords do not match'})
        }
        
        if (password.length < 6) {
            return res.status(400).json({success: false, message: 'Password must be 6 characters long'});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await Users.create({
            firstName,
            lastName,
            username,
            email,
            password: hashedPassword,
        });
        res.status(200).json({success: true, data: newUser});

    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Server error'});
    }
});

router.post('/authentication/login', passport.authenticate('local'), (req, res) => {
    res.status(200).json({success: true, message: 'You are signed in', user: req.user});
})

router.get('/authentication/logout', isUserAuthenticated, (req, res) => {
    req.logout((error) => {
        if (error) {
            console.log(error);
            res.status(500).json({success: false, message: 'Server error'});
        }
        res.status(200).json({success: true, message: 'You are logged out'});
    });
});

router.use('/admin', adminRoute);
router.use('/users', userRoute);

router.get('/search', isUserAuthenticated, async (req, res) => {
    try {
        const { name } = req.query;

        const products = await Products.findAll({
            where: {
                name: {
                    [Op.iLike]: `%${name}%`,
                }
            }
        })
        res.status(200).json({ products, hits: products.length });
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Server error'});
    }
});

module.exports = router;