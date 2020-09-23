const router = require('express').Router();
const { createUser } = require('../controllers/register');

router.post('/', createUser);

module.exports = router;
