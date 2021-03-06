const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//load validation
const validadeProfileInput = require('../../validation/profile')
const validadeExperienceInput = require('../../validation/experience')
const validadeEducationInput = require('../../validation/education.js')

//Load profile model
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route GET api/users/test
// @desc  Tests profile route
// @access Public
router.get('/test', (req, res) => res.json({msg: "profile Works"}));

// @route GET api/profile
// @desc  get current user profile
// @access Private
router.get('/', passport.authenticate('jwt', { session: false }), (req,res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
    .populate('user', ['name', 'avatar'])
        .then(profile => {
            if (!profile) {
                errors.noprofile = 'Não existe perfil para esse usuário'
                return res.status(404).json({errors})
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json(err))
})


// @route get api/profile/all
// @desc  get all profiles
// @access Public
router.get('/all', (req,res) => {
    const errors = {};

    Profile.find()
    .populate('user', ['name', 'avatar'])
    .then(profiles => {
        if (!profiles) {
            errors.noprofile = 'Não existe perfis'
            return res.status(404).json(errors)
        }
        res.json(profiles);
    })
    .catch(err => res.status(404).json({ profile: 'Não existe perfis' }))
})
// @route get api/profile/handle/:handle
// @desc  get profile by handle
// @access Public
router.get('/:handle', (req,res) => {
    const errors = {};

    Profile.findOne( { handle: req.params.handle } )
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if (!profile) {
                errors.noprofile = 'Não existe perfil para esse usuário';
                res.status(404).json(errors);
            }
            res.json(profile)
        })
        .catch(err => res.status(404).json(err))
});

// @route get api/profile/user/:user_id
// @desc  get profile by user id
// @access Public
router.get('/user/:user_id', (req,res) => {
    const errors = {};

    Profile.findOne( { user: req.params.user_id } )
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if (!profile) {
                errors.noprofile = 'Não existe perfil para esse usuário';
                res.status(404).json(errors);
            }
            res.json(profile)
        })
        .catch(err => res.status(404).json({ profile: 'Não existe perfil para esse usuário' }))
})

// @route POST api/profile
// @desc  create or edit user profile
// @access Private
router.post('/', passport.authenticate('jwt', { session: false }), (req,res) => {
    const { errors, isValid } = validadeProfileInput(req.body);
    
    //check validation
    if(!isValid) {
        //Return any errors with 400 status
        return res.status(400).json(errors);
    }
    
    //getfields
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;
    // Split skills in array
    if(typeof req.body.skills !== 'undefined'){
        profileFields.skills = req.body.skills.split(',')
    }
    //Social
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    Profile.findOne( { user: req.user.id })
        .then(profile => {
            if (profile) {
                //Update
                Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true})
                    .then(profile => { res.json(profile)})
                    .catch(err => res.json(err))
            }else {
                //create
                Profile.findOne({ handle: profileFields.handle }).then(profile => {
                    if (profile) {
                        errors.handle = 'That handle already exist';
                        res.status(400).json(errors);
                    }
                    
                    new Profile( profileFields ).save().then(profile => res.json(profile))
                })
            }
        })

})

// @route POST api/profile/experience
// @desc  Add experience to profile
// @access Privite 

router.post('/experience', passport.authenticate('jwt', { session: false }), (req,res) => {
    const { errors, isValid } = validadeExperienceInput(req.body);
    //check validation
    if(!isValid) {
        //Return any errors with 400 status
        return res.status(400).json(errors);
    }
   
    Profile.findOne( { user: req.user.id })
        .then(profile => {
            const newExp = {
                title: req.body.title,
                company: req.body.company,
                location: req.body.location,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description
            }
        // ad to exp array

        profile.experience.unshift(newExp);

        profile.save().then(profile => res.json(profile));
        })
})

// @route POST api/profile/education
// @desc  Add education to profile
// @access Privite 

router.post('/education', passport.authenticate('jwt', { session: false }), (req,res) => {
    const { errors, isValid } = validadeEducationInput(req.body);
    //check validation
    if(!isValid) {
        //Return any errors with 400 status
        return res.status(400).json(errors);
    }
   
    Profile.findOne( { user: req.user.id })
        .then(profile => {
            const newEdu = {
                school: req.body.school,
                degree: req.body.degree,
                fieldofstudy: req.body.fieldofstudy,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description
            }
        // ad to exp array

        profile.education.unshift(newEdu);

        profile.save().then(profile => res.json(profile));
        })
});

// @route DELETE api/profile/experience/:expid
// @desc  Delete experience from profile
// @access Privite 

router.delete('/experience/:expid', passport.authenticate('jwt', { session: false }), (req,res) => {

    Profile.findOne( { user: req.user.id })
        .then(profile => {
           const removeIndex = profile.experience
                .map(item => item.id)
                .indexOf(req.params.exp_id);

            //remove from array
            profile.experience.splice(removeIndex, 1);

            profile.save().then(profile => res.json(profile))
        })
        .catch(err => res.status(404).json(err))
})

// @route DELETE api/profile/education/:eduid
// @desc  Delete education from profile
// @access Privite 

router.delete('/education/:eduid', passport.authenticate('jwt', { session: false }), (req,res) => {

    Profile.findOne( { user: req.user.id })
        .then(profile => {
           const removeIndex = profile.education
                .map(item => item.id)
                .indexOf(req.params.exp_id);

            //remove from array
            profile.education.splice(removeIndex, 1);

            profile.save().then(profile => res.json(profile))
        })
        .catch(err => res.status(404).json(err))
})



// @route DELETE api/profile/
// @desc  Delete user and profile
// @access Privite 


router.delete('/', passport.authenticate('jwt', { session: false }), (req,res) => {
    Profile.findOneAndRemove({ user: req.user.id })
        .then(() => {
            User.findOneAndRemove({ _id: req.user.id })
                .then(() => res.json({ sucess: true}))
        })
})

module.exports = router;