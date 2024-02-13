import express from 'express';

import { getPostsBySearch, getPost, getPosts, createPosts, updatePosts , deletePost, likePost, commentPost} from '../controllers/posts.js';
import auth from '../middleware/auth.js'; // it is for the middleware

const router = express.Router();

router.get('/search',getPostsBySearch);   // getting all this stuff from the controllers/posts.js
router.get('/',getPosts);   // getting all this stuff from the controllers/posts.js
router.get('/:id',getPost);   // getting all this stuff from the controllers/posts.js
router.post('/',auth,createPosts);
router.patch('/:id',auth,updatePosts);
router.delete('/:id',auth,deletePost);
router.patch('/:id/likepost',auth,likePost);
router.post('/:id/commentpost',auth,commentPost);
// example
// router.-----(endPoint, middleware, controller Name);

export default router;