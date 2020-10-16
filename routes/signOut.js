const router = require('express').Router();
const { signOut } = require('../controllers/signOut');

router.post('/', signOut);

module.exports = router;
