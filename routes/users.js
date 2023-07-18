const router = require('express').Router();

const {
  createUser, getUsers, getUser, updateUser, updateAvatar, getCurrentUser,
} = require('../controllers/users');

router.post('/', createUser);
router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', getUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
