const mongoose = require('mongoose')

const UserInfoSchema = new mongoose.Schema({
    time : {
        type: String
    },
    location : {
        type: String
    },
    device : {
        type: String
    }
},
    {
        timestamps: true
    })

const UserInfo = mongoose.model("Userinfo", UserInfoSchema)

module.exports=UserInfo