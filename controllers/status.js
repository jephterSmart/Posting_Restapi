const UserModel = require('../models/user');


exports.postStatus =(req,res,next) => {
    const status = req.body.status;
    UserModel.findById(req.userId)
    .then(user => {
        user.status = status;
        return user.save()
    })
    .then(result => {
        res.status(201).json({
            message:'Status added',
            status: result.status

        })
    })
    .catch(err => {
        if(!err.statusCode) err.statusCode = 500;
        next(err)
    })
}

exports.getStatus = (req,res,next) => {
    UserModel.findById(req.userId)
    .then(user => {
        res.status(200).json({
            status:user.status,
            message: 'status fetched successfully!'
        })
    })
    .catch(err => {
        if(!err.statusCode) err.statusCode = 500;
        next(err);
    })
}