const mongoose = require('mongoose');
const CategorySchema  = mongoose.Schema({
    category : {
        type:String,
        required: true
    },
    status : {
        type: Boolean,
        default: true
    },
    BlogIds : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog',
        required: true
    }]
},{
    timestamps : true
})

const Category = mongoose.model('Category',CategorySchema)

module.exports = Category