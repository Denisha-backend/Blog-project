const Admin = require('../model/adminmodel')
const CategoryModel = require('../model/CategoryMedel')
const BlogModel = require('../model/BlogModel')
const CommentsModel = require('../model/CommentsModel')
const nodemailer = require('nodemailer')
const { validationResult } = require('express-validator')

const fs = require('fs')
const path = require('path')

module.exports.dashboard = async (req, res) => {
    try {
        let CategoryData = await CategoryModel.find()
        let CommentsData = await CommentsModel.find()
        let Blog = await BlogModel.find()
        let findCategory = []
        let BlogData = []
        let findComments = []
        console.log(findComments);

        CommentsData.map((value) => {
            findComments.push(value.comments.length)
        })

        CategoryData.map((value) => {
            findCategory.push(value.category)
        })
        console.log(findCategory);

        CategoryData.map((value) => {
            BlogData.push(value.BlogIds.length)
        })

        res.render('dashboard', {
            CategoryData,
            Blog,
            findCategory,
            BlogData,
            CommentsData,
            findComments
        })
    }
    catch (err) {
        console.log(err)
        res.redirect('back')
    }
}

module.exports.addAdmin = async (req, res) => {
    try {
        res.render('Addadmin', {
            errorData: [],
            old: []
        })
    }
    catch (err) {
        console.log(err)
        res.redirect('back')
    }
}

module.exports.insertdata = async (req, res) => {
    try {

        const error = validationResult(req)
        console.log(error.mapped());

        if (!error.isEmpty()) {
            return res.render('Addadmin', {
                errorData: error.mapped(),
                old: req.body
            })
        }
        else {
            console.log(req.body);
            console.log(req.file);
            let img = ''
            if (req.file) {
                img = await Admin.imgpath + '/' + req.file.filename;
            }
            req.body.image = img;
            req.body.name = req.body.fname + req.body.lname;

            await Admin.create(req.body);
            req.flash('success', "Added Successfully")
            return res.redirect('back')
        }


    }
    catch (err) {
        console.log(err);
        return res.redirect('back')
    }
}

module.exports.viewdata = async (req, res) => {
    try {

        let search = '';
        if (req.query.search) {
            search = req.query.search;
        }

        let page = 0
        let perpage = 2;


        if (req.query.page) {
            page = req.query.page;
        }

        let singledata = await Admin.find({
            $or: [
                { name: { $regex: search } },
                { email: { $regex: search } },

            ]
        }).skip(page * perpage).limit(perpage).exec()

        let totaldata = await Admin.find({
            $or: [
                { name: { $regex: search } },
                { email: { $regex: search } },

            ]
        }).countDocuments()
        let total = Math.ceil((totaldata / perpage));


        console.log(singledata)
        res.render('viewData', {
            singledata,
            page,
            total,
            search

        })
    }
    catch (err) {
        console.log(err)
        res.redirect('back')
    }
}

module.exports.delData = async (req, res) => {
    try {

        let singleobj = await Admin.findById(req.query.id)
        console.log(singleobj)
        try {

            let deletepath = path.join(__dirname, '..', singleobj.image);
            fs.unlinkSync(deletepath);
        }
        catch (err) {
            console.log('image not found')
        }
        await Admin.findByIdAndDelete(req.query.id);
        req.flash('success', "Deleted Successfully")
        return res.redirect('back')
    }
    catch (err) {
        console.log(err)
        return res.redirect('back')
    }
}

module.exports.updateData = async (req, res) => {
    try {
        let singleAdmin = await Admin.findById(req.params.id)
        console.log(singleAdmin)
        res.render('updateData', {
            singleAdmin
        })
    }
    catch (err) {
        console.log(err)
        return res.redirect('back')
    }
}

module.exports.editdata = async (req, res) => {
    try {
        let id = req.body.id
        let updateData = await Admin.findById(id)
        if (req.file) {
            //  UPDATE WITH IAMGE
            let oldImagePath = updateData.image
            if (oldImagePath) {
                fs.unlinkSync(path.join(__dirname, '..', oldImagePath))
                req.body.image = Admin.imgpath + '/' + req.file.filename
            }
            await Admin.findByIdAndUpdate(id, req.body)
            req.flash('success', "Updated Successfully")
            res.redirect('/viewdata')

        }
        else {
            // update without image
            console.log(updateData);
            req.body.image = updateData.image
            await Admin.findByIdAndUpdate(id, req.body)
            req.flash('success', "Updated Successfully")
            res.redirect('/viewdata')
        }

    }

    catch (err) {
        console.log(err)
        return res.redirect('back')
    }
}

module.exports.login = async (req, res) => {
    try {
        if (req.isAuthenticated()) {
            return res.redirect('/dashboard')
        }
        else {
            res.render('login')
        }
    }
    catch (err) {
        console.log(err)
        return res.redirect('back')
    }
}

module.exports.logindata = async (req, res) => {
    try {
        req.flash('success', "Login Successfully")
        res.redirect('/dashboard')
    }
    catch (err) {
        console.log(err)
        return res.redirect('back')
    }
}

module.exports.changepass = async (req, res) => {
    try {
        res.render('changepass')
    }
    catch (err) {
        console.log(err)
        return res.redirect('back')
    }
}

module.exports.changepassword = async (req, res) => {
    try {

        let olddata = req.user;
        console.log(olddata)
        if (olddata.password == req.body.currentpassword) {
            if (req.body.currentpassword != req.body.newpassword) {
                if (req.body.newpassword == req.body.confirmpassword) {
                    await Admin.findByIdAndUpdate(olddata._id, { password: req.body.newpassword });
                    req.flash('success', "Password Updated Successfully")
                    res.redirect('/logout')
                }
                else {
                    console.log('new and confirm password do not match')
                }
            }
            else {
                console.log('new and old password are same')
                req.flash('success', "Something Wrong")

                return res.redirect('back')
            }
        }
        else {
            console.log('current password do not match with old one')
            return res.redirect('back')
        }

    }
    catch (err) {
        console.log(err);
        return res.redirect('back')
    }
}

module.exports.forgotpass = async (req, res) => {
    try {
        res.render('forgotpass')
    }
    catch (err) {
        console.log(err)
        return res.redirect('back')
    }
}


module.exports.forgotpassword = async (req, res) => {
    try {
        console.log(req.body)
        let checkemail = await Admin.find({ email: req.body.email }).countDocuments()
        console.log(checkemail)
        if (checkemail == 1) {
            let checkemail1 = await Admin.findOne({ email: req.body.email });

            let otp = Math.floor(Math.random() * 10000)
            console.log(otp)




            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for port 465, false for other ports
                auth: {
                    user: "arpitshekhda45@gmail.com",
                    pass: "mnywvzgnolbqabyy",
                },
                tls: {
                    rejectUnauthorized: false
                }
            });

            const info = await transporter.sendMail({
                from: 'arpitshekhda45@gmail.com', // sender address
                to: checkemail1.email, // list of receivers
                subject: otp, // Subject line
                text: "Hello world?", // plain text body
                html: "<b>Hello world?</b>", // html body
            });
            console.log("Message sent: ");

            res.cookie('Otp', otp);
            res.cookie('email', checkemail1.email);
            req.flash('success', "Password Forget Successfully")

            return res.redirect('/checkotp');

        }

    }
    catch (err) {
        console.log(err)
        return res.redirect('back')
    }
}

module.exports.checkotp = async (req, res) => {
    try {
        res.render('checkotp')
    }
    catch (err) {
        console.log(err)
        return res.redirect('back')
    }
}

module.exports.verifyotp = async (req, res) => {
    try {
        console.log(req.body)
        if (req.cookies.otp = req.body.otp) {
            res.clearCookie('Otp')
            res.redirect('/retypepass')
        }
        else {
            console.log('otp doesnt match')
            req.flash('success', "Otp Send Successfully")

            return res.redirect('back')
        }
    }
    catch (err) {
        console.log(err);
        return res.redirect('back')
    }
}

module.exports.retypepass = async (req, res) => {
    try {
        res.render('retypepass')
    }
    catch (err) {
        console.log(err)
        return res.redirect('back')
    }
}


module.exports.verifypass = async (req, res) => {
    try {
        console.log(req.body)
        let checkemail = await Admin.find({ email: req.cookies.email }).countDocuments();
        if (checkemail == 1) {
            let checkemail2 = await Admin.findOne({ email: req.cookies.email });
            if (req.body.newpassword == req.body.confirmpassword) {
                res.clearCookie('email')
                await Admin.findByIdAndUpdate(checkemail2.id, { password: req.body.newpassword })
                res.redirect('/login')
            }
            else {
                console.log('new and confirm password not match')
                req.flash('success', "Password Verify Successfully")

                return res.redirect('back')
            }
        }
        else {
            console.log(' email not found')
            return res.redirect('back')
        }
    }
    catch (err) {
        console.log(err)
        return res.redirect('back')
    }
}

module.exports.myprofile = async (req, res) => {
    try {
        res.render('myprofile')
    }
    catch (err) {
        console.log(err)
        return res.redirect('back')
    }
}

module.exports.ViewComments = async (req, res) => {
    try {
        let CommentsData = await CommentsModel.find()
        console.log(CommentsData)
        res.render('ViewComments', {
            CommentsData
        })
    }
    catch (err) {
        console.log(err)
        return res.redirect('back')
    }
}

module.exports.changeStatus = async (req, res) => {
    try {
        console.log(req.query);
        let commentStatusUpdate = await CommentsModel.findByIdAndUpdate(req.query.postId, { status: false });
        if (commentStatusUpdate) {
            return res.redirect('back');
        }
        else {
            console.log('Failed to update status')
            return res.redirect('back');
        }
    }
    catch (err) {
        console.log(err)
        return res.redirect('back');
    }
}
module.exports.changeStatustrue = async (req, res) => {
    try {
        console.log(req.query);
        let CommentsStatusUpdate = await CommentsModel.findByIdAndUpdate(req.query.postId, { status: true });
        if (CommentsStatusUpdate) {
            return res.redirect('back');
        }
        else {
            console.log('Failed to update status')
            return res.redirect('back');
        }
    }
    catch (err) {
        console.log(err)
        return res.redirect('back');
    }
}

