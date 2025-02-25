const express = require('express');
const routes = express.Router();

const adminclt = require('../controller/adminclt')

const Adminmodel = require('../model/adminmodel');
const passport = require('../config/Passport-Local')
const { check } = require('express-validator')


routes.get('/dashboard', passport.checkAuthUser, adminclt.dashboard)

routes.get('/addAdmin', passport.checkAuthUser, adminclt.addAdmin)

routes.post('/insertdata', Adminmodel.uploadImage, [
    check('fname').notEmpty().withMessage('firstname is required').isLength({ min: 2 }).withMessage("minimum 2 characters are required"),
    check('lname').notEmpty().withMessage('lastname is required').isLength({ min: 2 }).withMessage("minimum 2 characters are required"),
    check('email').notEmpty().withMessage('email is required').isEmail().withMessage('Email Strecture  is required').custom(async (value) => {
        let CheckEmail = await Adminmodel.find({ email: value }).countDocuments()
        if (CheckEmail > 0) {
            throw new Error('Email are Allready Exists...')
        }
    }).withMessage('Email are Allready Exists...'),
    check('password').notEmpty().withMessage('password is required').isLength({ min: 8 }).withMessage("minimum 8 characters are required").matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/,
    ).withMessage('Password should be combination of one uppercase , one lower case, one special char, one digit and min 8 , max 20 char long'),
    check('gender').notEmpty().withMessage('Gender should be required'),
    check('hobby').notEmpty().withMessage('Hobby should be required'),
    check('message').notEmpty().withMessage('Message should be required'),
    check('city').notEmpty().withMessage('City should be required')
], adminclt.insertdata)

routes.get('/viewdata', passport.checkAuthUser, adminclt.viewdata)

routes.get('/delData', passport.checkAuthUser, adminclt.delData)

routes.get('/updateData/:id', passport.checkAuthUser, adminclt.updateData)

routes.post('/editdata', Adminmodel.uploadImage, adminclt.editdata)

routes.get('/myprofile', passport.checkAuthUser, adminclt.myprofile)

//login 
routes.get('/login', adminclt.login);
routes.post('/logindata', passport.authenticate('local', { failureRedirect: '/login' }), adminclt.logindata)


//logout 
routes.get('/logout', (req, res) => {
    req.session.destroy(function (err) {
        if (err) {
            return false;
        }
        return res.redirect('/login')
    })
})




// change password

routes.get('/changepass', passport.checkAuthUser, adminclt.changepass)
routes.post('/changepassword', adminclt.changepassword)

// forgot password
routes.get('/forgotpass', passport.checkAuthUser, adminclt.forgotpass)
routes.post('/forgotpassword', adminclt.forgotpassword)

routes.get('/checkotp', passport.checkAuthUser, adminclt.checkotp);
routes.post('/verifyotp', adminclt.verifyotp)

routes.get('/retypepass', passport.checkAuthUser, adminclt.retypepass)
routes.post('/verifypass', adminclt.verifypass)

routes.use('/category', require('../routes/CategoryRoutes'));
routes.use('/Blog', require('../routes/BlogRoute'));

routes.get("/changeStatusTrue", passport.checkAuthUser, adminclt.changeStatustrue);
routes.get("/changeStatus", passport.checkAuthUser, adminclt.changeStatus);
routes.get('/viewComments', adminclt.ViewComments)
routes.use('/', require('../routes/CommentsRoute'))
module.exports = routes