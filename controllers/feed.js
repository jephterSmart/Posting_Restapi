const fs = require('fs')
const path = require('path')

const {validationResult} = require('express-validator/check');

const PostModel = require('../models/post');
const UserModel = require('../models/user');
const socket = require('../socket');


exports.getFeeds = (req,res,next) => {
    let totalItems = 0;
    const perPage = 2;
    const currentPage = req.query.page || 1;
    PostModel.find().countDocuments()
    .then(count => {
        totalItems = count;
        return PostModel.find()
        .sort({createdAt: -1})
        .skip((currentPage - 1) * perPage)
        .limit(perPage)
    })
    .then(posts =>{
      const opts =[{path:'creator', select:'name _id'}]
     PostModel.populate(posts,opts)
       .then(updPost => {
        res.status(200).json({
          posts:updPost,
          message:'Post was successful!!',
          totalItems:totalItems
      })
       })
       .catch(console.log)
        
       
     
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err)
    })
   
}
exports.getPost =  (req,res,next) => {
    const postId = req.params.postId;
    PostModel.findById(postId)
    .then(post =>{
        if(!post){
            const error = new Error('No post found')
            error.statusCode = 404;
            throw error;
        }
     return  post.populate('creator','name _id').execPopulate() 
      })
      .then(updatePost => {

        res.status(200).json({
            message: 'Valid post',
            post:updatePost
        })
        
    })
    .catch(err => {
      if(!err.statusCode) err.statusCode =500;
      next(err)
    })
}
exports.createPost = (req,res,next) =>{
    const title = req.body.title
    const content = req.body.content;
    const image = req.file;
    let updatedPost;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('There is a validation error');
        error.statusCode = 422;
        error.errors = errors.array()[0];
        throw error;
        
    }
    if(!image){
        const error = new Error('Picture is required for the post');
        error.statusCode = 422;
        throw error;
    }
    
    const post = new PostModel({
        title,content,
        imageUrl: image.path.replace('\\','/'),
        creator: req.userId
    })
    post.save()
    .then(result =>{
      return  result.populate('creator','name _id').execPopulate() 
      })
      .then(updatePost => {
        updatedPost = updatePost;
        return UserModel.findById(req.userId);
    })
    .then(user => {
      user.posts.push(post);
     return user.save()
    })
    .then(result => {
       socket.getIO().emit('posts',{action:'create', post:updatedPost})
     
        res.status(201).json({
            message:'post created',
            post:updatedPost,
            creator: {_id:result._id,name: result.name}
        })
    
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;

        }
        next(err);
    });
    
}

exports.updatePost = (req, res, next) => {
    const postId = req.params.postId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect.');
      error.statusCode = 422;
      throw error;
    }
    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.body.image;
    if (req.file) {
      imageUrl = req.file.path.replace('\\','/');
    }
    if (!imageUrl) {
      const error = new Error('No file picked.');
      error.statusCode = 422;
      throw error;
    }
    PostModel.findById(postId)
      .then(post => {
        if (!post) {
          const error = new Error('Could not find post.');
          error.statusCode = 404;
          throw error;
        }
        
        if(post.creator.toString() !== req.userId){
          const error = new Error('Not Authorized');
          error.statusCode = 403;
          throw error;
        }
        if (imageUrl !== post.imageUrl) {
          clearImage(post.imageUrl);
        }
        post.title = title;
        post.imageUrl = imageUrl;
        post.content = content;
        return post.save();
      })
      .then(result => {
        return  result.populate('creator','name _id').execPopulate() 
      })
      .then(updatePost => {
         socket.getIO().emit('posts',{action:'update', post:updatePost})
      
        res.status(200).json({ message: 'Post updated!', post: updatePost });
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  };
  
  const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => console.log(err));
  };


  exports.deletePost = (req,res,next) => {

    const postId = req.params.postId;
    PostModel.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error('Could not find post.');
        error.statusCode = 404;
        throw error;
      }
      if(post.creator.toString() !== req.userId){
        const error = new Error('Not Authorized');
        error.statusCode = 403;
        throw error;
      }
      clearImage(post.imageUrl);
      
     PostModel.findByIdAndDelete(postId)
     
     .then(result => {
        post =result
      return  UserModel.findById(req.userId)
       
     })
     .then(user => {
       user.posts.pull(postId);
       return user.save()
     })
     .then(result =>{
        socket.getIO().emit('posts',{action:'delete',post:postId})
       res.status(200).json({
        message: 'post deleted',
        post: post
    })
     })
     .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
  })
}