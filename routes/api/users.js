const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

//Load input validator
const validadeRegisterInput = require('../../validation/register')
const validadeLoginInput = require('../../validation/login')
//Load user model
const User = require('../../models/User')

// @route GET api/users/test
// @desc  Tests users route
// @access Public
router.get('/test', (req, res) => res.json({msg: "users Works"}));

// @route GET api/users/register
// @desc  Register user
// @access Public
router.post('/register', (req, res) => {
    const { errors, isValid } = validadeRegisterInput(req.body);

    if(!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({ email:req.body.email })
        .then(user => {
            if(user){

                return res.status(400).json({email: 'email alredy exists'})
            }else{
                const avatar = gravatar.url(req.body.email, {
                    s: '200', //status
                    size: 'pg',
                    d: 'mm'//no pick img
                });

                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err,hash) =>{
                        if(err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then( user => res.json(user))
                            .catch( err => console.log(err))
                    })
                })
            }
        })
});

// @route GET api/users/login
// @desc  Login user / returning Token
// @access Public
router.post('/login', (req,res) => {
    const { errors, isValid } = validadeLoginInput(req.body);

    if(!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    //find user by email
    User.findOne({ email })
        .then(user => {
            //check for user
            if(!user) {
                errors.email = 'Usuário não encontrado'
                return res.status(400).json(errors)
            }
            //Check password
            bcrypt.compare(password, user.password).then(isMatch => {
                    if (isMatch) {
                        const payload = {
                            id: user.id,
                            name: user.name,
                            avatar: user.avatar
                        }
                        //Sign Token
                        jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600}, (err, token) => {
                            res.json({
                                success: true,
                                token: 'Bearer ' + token
                            })
                        });
                    } else {
                       errors.password = 'Senha incorreta'
                       return res.status(400).json(errors)
                    }
                })
        })
});


// @route GET api/users/current
// @desc  Retorn current user+token
// @access Private
router.get('/current', passport.authenticate('jwt', { session: false }), (req,res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    });
});

module.exports = router;