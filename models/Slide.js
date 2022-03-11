const { Schema, model } = require('mongoose')

const slideSchema = Schema({
    photo1: {
        data: Buffer,
        contentType: String
    },
    label:{
        type:String
    },
    title:{
        type:String
    }
    
},{timestamps:true})


module.exports.Slide=model('Slide',slideSchema);
