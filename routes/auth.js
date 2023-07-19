const express = require( 'express' );
const { createUser, loginUser, updateUser, deleteUser, getUser } = require( '../controllers/authController' );
const router = express.Router();

router.post('/register', createUser)
router.post('/login', loginUser)
router.put('/update', updateUser)
router.delete( '/delete/:id', deleteUser )
router.get('/:id',getUser)

module.exports = router