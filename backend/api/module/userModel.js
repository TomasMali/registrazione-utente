// this is a module DAO for Users
const mongoose = require('mongoose')

const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({

nome: { type: String, required:true},
cognome: { type: String, required:true},
cf: { type: String, required:true},
eta: { type: Number, required:true},
telefono: { type: String, required:true},
email: { type: String, required:true, unique: true},
password:{ type: String, required:true},
qrCode: { type: String, required:false},
admin: { type: Boolean, required:false},
autorizzato: { type: Boolean, required:false},
arrivato: { type: Boolean, required:false}
});

userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('qrcode', userSchema) 