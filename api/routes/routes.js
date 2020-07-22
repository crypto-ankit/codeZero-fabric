const express = require('express');

const router = express.Router();

const docs = require('../controller/controller.js');
router.post('/insertDocDetails',docs.post_docdetails);
router.get('/getDocDetails/:name',docs.get_docdetails);
module.exports = router;