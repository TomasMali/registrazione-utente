

const User = require('../module/userModel')
const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const router = express.Router()
//
const CheckAuth = require("../middleware/check-auth")
// Nodemailer
const nodemailer = require('nodemailer')
//const sendGridTransport = require('nodemailer-sendgrid-transport')

const QRCode = require('qrcode')




/**
 * Aggiorna il campo autorizzato e manda la mail all'utente
 */
router.put("/puti", CheckAuth, (req, res, next) => {

    const user_ = req.body

    // se sto facendo autorizzazione
    if (user_.autorizzato !== null) {

        QRCode.toDataURL("http://192.168.1.119:4200/admin/" + user_._id, function (err, url) {
        User.updateOne({ _id: user_._id }, { $set: { "autorizzato": user_.autorizzato, "qrCode": url } })
            .then(result => {

                const code = '<img src="' + user_.qrCode + '" alt="" style="width: 125px; height: 125px;">'

                if (user_.autorizzato) {
                    transporter.sendMail({
                        to: user_.email,
                        from: "megatoys92@gmail.com",
                        subject: "La tua richiesta di registrazione è stata approvata. ",
                        html: '<h1>  La tua richiesta di registrazione è stata approvata. \n Adesso troverai il tuo codice QR anche nella tua area personale' + '</h1> <br>' +
                            code
                    })
                }

                res.status(200).json({ message: 'Update successful' })

            })

            })
    }
    else {
        // se sto facendo arrivato
        User.updateOne({ _id: user_._id }, { $set: { "arrivato": user_.arrivato } })
            .then(result => {
                res.status(200).json({ message: 'Update successful' })
            })
    }



})




/**
 * Aggiorna il campo arrivato 
 */
router.get("/setArrived/:id",CheckAuth, (req, res, next) => {

    const user_id = req.params.id

        User.updateOne({ _id: user_id, autorizzato: true}, { $set: { "arrivato": true } })
            .then(result => {
                res.status(200).json({ message: 'Utente aggiiornato correttamente!' })
            })
            .catch(err => {
                return res.status(500).json({
                    message: err
                })
            })
    
})












/**
 * Cancella un utente
 */
router.delete('/:id', CheckAuth, (req, res, next) => {
    User.deleteOne({ _id: req.params.id }).then(result => {
        res.status(200).json({ message: 'Post deleted' })
    })

})




const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: "megatoys92@gmail.com",
        pass: "..Tomas92"
    },
    tls: {
        rejectUnauthorized: false
    }
});







/**
 * Get all the users
 */
router.get('',  (req, res, next) => {
    User.find()
        .sort('autorizzato')
        .then(documents => {

            res.status(200).json({
                message: 'Posts fetch succesfully',
                posts: documents
            })
        })
})



/**
 * Get only one user based on the email
 */
router.get('/findme/:email', CheckAuth, (req, res, next) => {

    User.findOne({ email: req.params.email })
        .then(user => {

            if (!user) {
                return res.status(401).json({
                    message: "Auth failed_user_doent_exsists"
                })
            }
            res.status(200).json({
                message: 'User fetch succesfully',
                user: user
            })
        })
        .catch(err => {
            return res.status(500).json({
                message: err
            })
        })
})



router.post("/signup", (req, res, next) => {

    const user_ = req.body

    bcrypt.hash(user_.password, 10)
        .then(hash => {

        

                const user = new User({
                    // _id: new mongoose.Types.ObjectId(),
                    nome: user_.nome,
                    cognome: user_.cognome,
                    cf: user_.cf,
                    eta: user_.eta,
                    telefono: user_.telefono,
                    email: user_.email,
                    password: hash,
                    qrCode: null,
                    admin: user_.admin,
                    autorizzato: user_.autorizzato,
                    arrivato: false
                })

                user.save()
                    .then(result => {
                        res.status(201).json({
                            message: "User created",
                            result: result
                        })
                        // Sending email
                        transporter.sendMail({
                            to: "megatoys92@gmail.com",
                            from: user_.email,
                            subject: 'Richiesta autorizzazione utente: ' + user_.nome + " " + user_.cognome + " Email: " + user_.email,
                            html: '<h1>  Richiesta autorizzazione utente: \n <br>' + user_.nome + " " + user_.cognome + "\n Email: " + user_.email + '</h1>'
                        })
                    })
                    .catch(err => {
                        res.status(500).json({
                            error: err
                        })
                    })
         

        })


})





router.post("/login", (req, res, next) => {
    let fetcheduser
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    message: "Auth failed_user_doent_exsists"
                })
            }

            // va direttamente al then sotto 
            fetcheduser = user
            return bcrypt.compare(req.body.password, user.password)
        })
        .then(result => {
            if (!result) {
                return res.status(401).json({
                    message: "Auth failed_user_exists_but_password_is_wrong"
                })
            }
            // web token 

            const token = jwt.sign({ email: fetcheduser.email, userId: fetcheduser._id },
                'secret_this_should_be_longer',
                {
                    expiresIn: "1h"
                }
            );
            res.status(200).json({
                token: token,
                expiresIn: 3600
            })

        })
        .catch(err => {
            return res.status(401).json({
                message: "Auth failed_Catch"
            })
        })
})










router.delete('/delete_all', (req, res, next) => {
    User.deleteMany({})
        .exec()
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
});







module.exports = router;