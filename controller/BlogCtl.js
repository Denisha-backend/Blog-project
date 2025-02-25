const Blog = require('../model/BlogModel')
const Category = require('../model/CategoryMedel')
const fs = require('fs')
module.exports.addBlog = async (req, res) => {
    try {
        let categoryList = await Category.find()
        return res.render('AddBlog', {
            categoryList
        });
    }
    catch (err) {
        return res.redirect('back');
    }
}
module.exports.insertBlog = async (req, res) => {
    try {
        console.log(req.body);
        let img = ''
        if (req.file) {
            img = await Blog.ImagePath + '/' + req.file.filename;
        }
        req.body.image = img;

        let AddBlog = await Blog.create(req.body);
        let findCategory = ''

        if (AddBlog) {
            console.log('Blog added successfully')
            findCategory = await Category.findById(req.body.categoryId)
            findCategory.BlogIds.push(AddBlog._id)
            await Category.findByIdAndUpdate(req.body.categoryId, findCategory)
            return res.redirect('back');
        }
        else {
            console.log('Failed to add Blog')
            return res.redirect('back');
        }
    }
    catch (err) {
        console.log(err)
        return res.redirect('back');
    }
}

module.exports.viewBlog = async (req, res) => {
    try {
        let ViewBlog = await Blog.find().populate('categoryId').exec();
        console.log(ViewBlog);
        return res.render('ViewBlog', {
            ViewBlog
        });
    }
    catch (err) {
        return res.redirect('back');
    }
}
module.exports.deleteBlogData = async (req, res) => {
    try {
        console.log(req.params.id);
        let singleobj = await Blog.findById(req.params.id)
        console.log(singleobj)
        try {

            let deletepath = path.join(__dirname, '..', singleobj.image);
            fs.unlinkSync(deletepath);
        }
        catch (err) {
            console.log('image not found')
        }
        await Blog.findByIdAndDelete(req.params.id);
        return res.redirect('back')
    }
    catch (err) {
        console.log(err)
        return res.redirect('back')
    }
}
module.exports.UpdateBlog = async (req, res) => {
    try {
        console.log(req.params.id);
        let UpdateBlogRecord = await Blog.findById(req.params.id);
        if (UpdateBlogRecord) {
            res.render('UpdateBlog', {
                UpdateBlogRecord
            });
        }
    }
    catch (err) {
        console.log(err)
        return res.redirect('back')
    }
}
module.exports.editBlogData = async (req, res) => {
    try {
        let BlogData = await Blog.findById(req.body.id)
        if (BlogData) {
            if (req.file) {
                //  UPDATE WITH IAMGE
                let oldImagePath = updateData.image
                if (oldImagePath) {
                    fs.unlinkSync(path.join(__dirname, '..', oldImagePath))
                    req.body.image = Blog.imgpath + '/' + req.file.filename
                }
                await Blog.findByIdAndUpdate(id, req.body)
                res.redirect('/Blog/viewblog')

            }
            else {
                // update without image
                console.log(BlogData);
                req.body.image = BlogData.image
                await Blog.findByIdAndUpdate(req.body.id, req.body)
                res.redirect('/Blog/viewblog')
            }

        } else {
            console.log('Blog not found')
            return res.redirect('back')
        }
    }
    catch (err) {
        console.log(err)
        return res.redirect('back')
    }
}