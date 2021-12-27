const express = require('express');
const router = express.Router();
const { generateAccessToken, validateToken } = require('../middleware/users');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const userSchema = require('../models/users');
require('dotenv').config();

router.post('/login', (req, res) => {
    const {username, password} = req.body.data.user
    userSchema.find({username})
        .then( ([user]) => {
            bcrypt.compare(password, user.password).then( result => {

                if(!result) {return res.status(401).json({message: "Usuario o contraseña Incorrecta"})};
                
                const accessToken = generateAccessToken({username, password})

                res.json({data: { token: accessToken }})
            })
            .catch( err => {
                res.status(403).json({message: "Contraseña Incorrecta"});
            });
        })
        .catch( err => {
            res.json({message: "Error en los datos enviados"});
        });
    
})  

router.get('/check/token', validateToken, (req, res) => {
    res.status(200).json({token: true})
});

module.exports = router;
