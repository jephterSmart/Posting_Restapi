const express = require('express');
const {body}  = require('express-validator/check');

const feedController = require('../controllers/feed');
const statusController = require('../controllers/status');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

//=> GET /feed/posts
router.get('/posts',isAuth,feedController.getFeeds);

router.post('/status',isAuth,statusController.postStatus)


router.get('/status',isAuth,statusController.getStatus)

router.post('/post',isAuth, [
    body('title').trim().isLength({min:5}),
    body('content').trim().isLength({min:5})
],feedController.createPost);

router.get('/post/:postId',isAuth, feedController.getPost)

router.put('/post/:postId',isAuth, [
    body('title').trim().isLength({min:5}),
    body('content').trim().isLength({min:5})
],feedController.updatePost)

router.delete('/post/:postId',isAuth,feedController.deletePost);

module.exports = router;