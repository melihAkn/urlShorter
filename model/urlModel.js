const mongoose = require('mongoose')
const schema = mongoose.Schema
const urlSchema = new schema ({
    originalURL : {
        type : String,
        required : true
    },
    urlID : {
        type : String,
        required : true,

    },
    clickCount : {
        type : Number,
        required : true,
        default : 0
    }

},{collection : "shortedURLs",timestamps : true})

const urls = mongoose.model('shortedURLs',urlSchema)
module.exports = urls
/*
   originalURL : req.body.originalURL,
        urlID,
        clickCount : 0 */

