const express = require('express');
const Router = express.Router();
const CommentsCtl = require('../controller/CommentsCtl')
const CommentsModel = require('../model/CommentsModel')
const Passport = require('passport')

Router.get('/',CommentsCtl.Home)
Router.get('/singlePage/:id',CommentsCtl.SinglePage)
Router.post('/addComments',CommentsModel.uploadImage,CommentsCtl.AddComments)

Router.get('/userlogin',CommentsCtl.UserLogin)
Router.post('/insertLogin',Passport.authenticate('userAuth',{ failureRedirect: '/userlogin' }),CommentsCtl.insertLogin)
Router.get('/UserSignup',CommentsCtl.UserSignup)
Router.post('/ragister',CommentsCtl.ragister)



Router.get('/userLogout',Passport.checkAuthUser,async (req,res)=>{
    req.session.destroy(function (err) {
        if (err) {
            return false;
        }
        return res.redirect('/userlogin')
    })
})

Router.get('/setLikeUser/:CommentId',CommentsCtl.setLikeUser)
Router.get('/setdisLikeUser/:CommentId',CommentsCtl.setDisLikeUser)

module.exports = Router;
