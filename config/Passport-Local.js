const passport = require('passport')
const LocalStrategy = require('passport-local')
const AdminModel = require('../model/adminmodel')
const user = require('../model/UserModel')

passport.use('local', new LocalStrategy({
    usernameField: 'email'
}, async function (email, password, done) {
    console.log("Middleware");
    console.log(email, password);
    let AdminData = await AdminModel.findOne({ email: email })
    if (AdminData) {
        if (AdminData.password == password) {
            return done(null, AdminData);
        } else {
            return done(null, false);
        }
    }
    else {
        return done(null, false);
    }

}))

passport.use('userAuth', new LocalStrategy({
    usernameField: 'email'
}, async function (email, password, done) {
    console.log("Middleware");
    console.log(email, password);
    let UserData = await user.findOne({ email: email })
    if (UserData) {
        if (UserData.password == password) {
            return done(null, UserData);
        } else {
            return done(null, false);
        }
    }
    else {
        return done(null, false);
    }

}))

passport.serializeUser(function (user, done) {
    return done(null, user.id)
})
passport.deserializeUser(async function (id, done) {
    let AdminRecord = await AdminModel.findById(id);
    if (AdminRecord) {
        return done(null, AdminRecord);
    }
    else {
        let UserRecord = await user.findById(id);
        if (UserRecord) {
            return done(null, UserRecord);
        }
        else{
            return done(null, false);
        }
    }
})

passport.setAuthUser = function (req, res, next) {
    if (req.isAuthenticated()) {
        res.locals.user = req.user
    }
    next();
}
passport.checkAuthUser = function (req, res, next) {
    if (req.isAuthenticated()) {
        next()
    }
    else {
        return res.redirect('/');
    }
}



module.exports = passport