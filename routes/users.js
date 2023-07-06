const router = require('express').Router();

const {
  createUser, getUsers, getUser, updateUser, updateAvatar,
} = require('../controllers/users');

router.post('/', createUser);
router.get('/', getUsers);
router.get('/:userId', getUser);
router.patch('me', updateUser);
router.patch('avatar', updateAvatar);

module.exports = router;