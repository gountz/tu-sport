const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = {

    generateAccessToken: (user) => {
        return jwt.sign(user, process.env.JSON_TOKEN, {expiresIn:'1d'});
    },

    validateToken: (req, res, next) => {
        const accessToken = req.headers['authorization'];
        if(!accessToken){
            res.status(403).json({message:"Se requiere autenticación"})
        }else{
            jwt.verify(accessToken, process.env.JSON_TOKEN, (err, user) => {
                if(err){
                    res.status(403).json({
                        message: "Token invalido, vuelva a iniciar sesión"
                    })
                }else{
                    req.user = user;
                    next();
                }
            });
        }
    }
}
