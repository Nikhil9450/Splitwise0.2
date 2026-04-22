const express = require('express');
const {addActivity,getActivities} = require('../controllers/activity');
const router = express.Router();

router.post('/:groupId/activities', addActivity);
router.get('/:groupId/activities', getActivities);

module.exports = router;