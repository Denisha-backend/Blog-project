const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/Adminpanelback')
mongoose.connect('mongodb+srv://deakathirinishakathiriyadenish:0Kdl6Zrn343uCG5f@cluster0.qx1ga.mongodb.net/Adminpanelback')

const db = mongoose.connection;

db.once('open',(err)=>{
    if(err){
        console.log(err)
        return false;
    }
    console.log('db connected');
})

module.exports = db;