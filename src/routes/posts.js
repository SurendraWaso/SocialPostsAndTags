const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

const express = require('express');
const router  = express.Router();

const authMiddleware  = require('../middleware/auth');
const postController  = require('../controllers/postController');
const tagsController  = require('../controllers/tagController');

// Add new tag
router.post('/addnewtag', authMiddleware, tagsController.addNewTag);

// Add new post
router.post('/addnewpost', authMiddleware,upload.single('image'), postController.addNewPost);

// Get posts
router.get('/getposts', authMiddleware, postController.getPosts);
router.get('/getpostdetails/:postId', authMiddleware, postController.getPostDetails);


module.exports = router;
