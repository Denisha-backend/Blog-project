const express = require('express');
const CategoryCtl = require('../controller/CategoryCtl')
const route = express.Router();
const passport = require('../config/Passport-Local')
const { check } = require('express-validator')

route.get('/',passport.checkAuthUser,CategoryCtl.category)
route.post('/insertCategory',[
    check('category').notEmpty().withMessage('category is required')
],CategoryCtl.insertCategory)

route.get('/viewCategory',passport.checkAuthUser,CategoryCtl.viewCategory)
route.get('/deleteData/:id',passport.checkAuthUser,CategoryCtl.deleteData)
route.get('/UpdateCategory/:id',passport.checkAuthUser,CategoryCtl.UpdateCategory)
route.post('/editCategoryData',CategoryCtl.editCategoryData);
route.post("/deleteMultipleCategory", CategoryCtl.deleteMultipleCategory);
route.get("/changeStatus",passport.checkAuthUser, CategoryCtl.changeStatus);

route.get("/changeStatusTrue",passport.checkAuthUser, CategoryCtl.changeStatusTrue);



module.exports = route;