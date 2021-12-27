const express = require('express');
const router = express.Router();
const { transporter } = require('../middleware/email');

router.post('/send-email', (req, res) => {
    transporter.sendMail({
        from: "liomaregatusport@gmail.com",
        to: "liomaregatusport@outlook.com",
        subject: `${req.body.data.subject}`,
        text: `Lo envia: ${req.body.data.email} - dice: ${req.body.data.message}`
    }, (err, info) => {
        if(err){
            return res.status(406).json({message: "Error en la solicitud"})
        }else{
            return res.status(200).json({message: "Success"})
        }
    })
})

module.exports = router;