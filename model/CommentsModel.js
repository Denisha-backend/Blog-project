const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Imgpath = '/uploads/UserImage'

const CommentSchema  = mongoose.Schema({
    postId : {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Blog'
    },
    name : {
        type:String,
        required: true
    },
    email : {
        type: String,
        required: true
    },
    image : {
        type:String,
        required: true
    },
    comments : {
        type: String,
        required: true
    },
    status:{
        type: Boolean,
        default: true
    },
    likes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    dislikes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
},{
    timestamps : true
})

const StorageImages = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,path.join(__dirname,'..',Imgpath))
    },
    filename:(req,file,cb)=>{
        cb(null,file.fieldname+'-'+Date.now())
    }
})

CommentSchema.statics.uploadImage = multer({storage:StorageImages}).single('image');

CommentSchema.statics.ImagePath = Imgpath

const Comments = mongoose.model('Comments',CommentSchema)

module.exports = Comments