const Blog = require('../model/BlogModel')
const Category = require('../model/CategoryMedel')
const CommentsModel = require('../model/CommentsModel')
const UserModel = require('../model/UserModel')

module.exports.Home = async (req, res) => {
    try {
        let BlogData
        let page = 0;
        let perPage = 3;
        if (req.query.page) {
            page = req.query.page
        }
        let search = ''
        if (req.query.search) {
            search = req.query.search
        }

        let sortData = '';
        if (req.query.sorting) {
            sortData = req.query.sorting
        }

        let cateId = '';
        if (req.query.CatId) {
            cateId = req.query.CatId
        }
        if (req.query.sorting == 'asc') {
            BlogData = await Blog.find({
                'status': true,
                $or: [
                    { 'blogtitle': { $regex: search } }
                ]
            }).skip(page * perPage).limit(perPage).sort({ _id: 1 })
        }
        else {
            BlogData = await Blog.find({
                'status': true,
                'categoryId': req.query.CatId,
                $or: [
                    { 'blogtitle': { $regex: search } }
                ]
            }).skip(page * perPage).limit(perPage).sort({ _id: -1 })
        }

        if (req.query.CatId) {

            if (req.query.sorting == 'asc') {
                BlogData = await Blog.find({
                    'status': true,
                    'categoryId': req.query.CatId,
                    $or: [
                        { 'blogtitle': { $regex: search } }
                    ]
                }).skip(page * perPage).limit(perPage).sort({ _id: 1 })
            }
            else {
                BlogData = await Blog.find({
                    'status': true,
                    'categoryId': req.query.CatId,
                    $or: [
                        { 'blogtitle': { $regex: search } }
                    ]
                }).skip(page * perPage).limit(perPage).sort({ _id: -1 })
            }

        } else {

            if (req.query.sorting == 'asc') {
                BlogData = await Blog.find({
                    'status': true,
                    $or: [
                        { 'blogtitle': { $regex: search } }
                    ]
                }).skip(page * perPage).limit(perPage).sort({ _id: 1 })
            }
            else {
                BlogData = await Blog.find({
                    'status': true,
                    $or: [
                        { 'blogtitle': { $regex: search } }
                    ]
                }).skip(page * perPage).limit(perPage).sort({ _id: -1 })
            }

        }

        let CategoryData = await Category.find()
        let Totel = await Blog.find({ status: true }).countDocuments()
        let TotelBlog = Math.ceil(Totel / perPage)
        res.render('Home', {
            CategoryData, BlogData, TotelBlog, page, search, sortData, cateId
        });
    }
    catch (err) {
        console.log(err)
        return res.redirect('back')
    }
}

module.exports.SinglePage = async (req, res) => {
    try {
        let SinglePageData = await Blog.findById(req.params.id)
        let postId = req.params.id
        let ViewCommentsData = await CommentsModel.find({ status: true, postId })
        // console.log(ViewCommentsData);

        let LatestData = await Blog.find().limit(5)
        res.render('SinglePage', {
            SinglePageData,
            LatestData,
            postId,
            ViewCommentsData
        })
    }
    catch (err) {
        console.log(err)
        return res.redirect('back')
    }
}
module.exports.AddComments = async (req, res) => {
    try {
        console.log(req.body)
        console.log(req.file)

        let image = ''

        if (req.file) {
            image = await CommentsModel.ImagePath + '/' + req.file.filename
        }
        req.body.image = image
        let AddComments = await CommentsModel.create(req.body)
        if (AddComments) {
            let findBlog = await Blog.findById(req.body.postId)
            findBlog.CommentIds.push(AddComments._id)
            await Blog.findByIdAndUpdate(req.body.postId, findBlog)
            return res.redirect('back')
        }
        else {
            console.log('Failed to add Comments')
            return res.redirect('back');
        }

    }
    catch (err) {
        console.log(err)
        return res.redirect('back')
    }
}

module.exports.UserLogin = async (req, res) => {
    try {
        res.render('UserLogin')
    }
    catch (err) {
        console.log(err)
        return res.redirect('back')
    }
}
module.exports.insertLogin = async (req, res) => {
    try {
        res.redirect('/')
    }
    catch (err) {
        console.log(err)
        return res.redirect('back')
    }
}
module.exports.UserSignup = async (req, res) => {
    try {
        res.render('UserSignup')
    }
    catch (err) {
        console.log(err)
        return res.redirect('back')
    }
}
module.exports.ragister = async (req, res) => {
    try {
        console.log(req.body)
        if (req.body.password == req.body.conformPassword) {
            let user = await UserModel.create(req.body)
            if (user) {
                console.log('User created successfully')
                return res.redirect('back')
            }
            else {
                console.log('Failed to create user')
                return res.redirect('back');
            }
        }
        else {
            console.log('Password not match')
            return res.redirect('back');
        }
    }
    catch (err) {
        console.log(err)
        return res.redirect('back')
    }
}

module.exports.setLikeUser = async (req, res) => {
    try {
        console.log(req.params.CommentId)
        let SingalCommentsData = await CommentsModel.findById(req.params.CommentId)
        if (SingalCommentsData) {

            let LikeUserAllReadyExits = SingalCommentsData.likes.includes(req.user._id);
            if (LikeUserAllReadyExits) {
                //Remove like user
                let NewData = SingalCommentsData.dislikes.filter((v, i) => {
                    if (!v.equals(req.user._id)) {
                        return v;
                    }
                })
                SingalCommentsData.likes = NewData
            }
            else {
                //ADD Likes USer
                SingalCommentsData.likes.push(req.user._id);
            }

            let DisLikeUserAllReadyExits = SingalCommentsData.dislikes.includes(req.user._id);
            if (DisLikeUserAllReadyExits) {
                //Remove like user
                let NewData = SingalCommentsData.dislikes.filter((v, i) => {
                    if (!v.equals(req.user._id)) {
                        return v;
                    }
                })
                SingalCommentsData.dislikes = NewData
            }

            await CommentsModel.findByIdAndUpdate(req.params.CommentId, SingalCommentsData)
            return res.redirect('back')

        }
        else {
            console.log("Data not found");
            return res.redirect('back')
        }
    }
    catch (err) {
        console.log(err)
        return res.redirect('back')
    }
}

module.exports.setDisLikeUser = async (req, res) => {
    try {
        console.log(req.params.CommentId)
        let SingalCommentsData = await CommentsModel.findById(req.params.CommentId)
        if (SingalCommentsData) {

            let DisLikeUserAllReadyExits = SingalCommentsData.dislikes.includes(req.user._id);
            if (DisLikeUserAllReadyExits) {
                //Remove like user
                let NewData = SingalCommentsData.dislikes.filter((v, i) => {
                    if (!v.equals(req.user._id)) {
                        return v;
                    }
                })
                SingalCommentsData.dislikes = NewData
            }
            else {
                //ADD Likes USer
                SingalCommentsData.dislikes.push(req.user._id);
            }

            let LikeUserAllReadyExits = SingalCommentsData.likes.includes(req.user._id);
            if (LikeUserAllReadyExits) {
                //Remove like user
                let NewData = SingalCommentsData.dislikes.filter((v, i) => {
                    if (!v.equals(req.user._id)) {
                        return v;
                    }
                })
                SingalCommentsData.likes = NewData
            }

            await CommentsModel.findByIdAndUpdate(req.params.CommentId, SingalCommentsData)
            return res.redirect('back')

        }
        else {
            console.log("Data not found");
            return res.redirect('back')
        }
    }
    catch (err) {
        console.log(err)
        return res.redirect('back')
    }
}


