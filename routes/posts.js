const express = require('express');
const postsController = require('../controllers/posts');

const router = new express.Router();


router.get('/:id',postsController.readPost);


module.exports = router;