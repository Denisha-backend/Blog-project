const mongoose = require('mongoose');
const path = require('path')
const multer = require('multer')
const Imagepath = '/uploads'

const AdminSchema = mongoose.Schema({
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
        },
        gender:{
            type:String,
            required:true
        },
        message:{
            type:String,
            required:true
        },
        hobby:{
            type:Array,
            required:true
        },
        city:{
            type:String,
            required:true
        },
        image:{
            type:String,
            required:true
        },
})

const storagedata = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,path.join(__dirname,'..',Imagepath))
    },
    filename:(req,file,cb)=>{
        cb(null,file.fieldname+'-'+Date.now())
    }
})

AdminSchema.statics.uploadImage = multer({storage:storagedata}).single('image');
AdminSchema.statics.imgpath = Imagepath

const Admin = mongoose.model('Admin',AdminSchema)
module.exports  = Admin;