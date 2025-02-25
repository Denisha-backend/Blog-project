const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Imgpath = '/uploads'

const BlogSchema  = mongoose.Schema({
    blogtitle : {
        type:String,
        required: true
    },
    description : {
        type:String,
        required: true
    },
    categoryId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    status : {
        type:Boolean,
        default: true
    },
    image : {
        type:String,
        required: true
    },
    CommentIds:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comments'
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

BlogSchema.statics.uploadImage = multer({storage:StorageImages}).single('image');

BlogSchema.statics.ImagePath = Imgpath

const Blog = mongoose.model('Blog',BlogSchema)

module.exports = Blog