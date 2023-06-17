const express = require( 'express' );
const { verifyEmail, verifyCode } = require( '../controllers/verifyController' );
const router = express.Router();

router.post( '/mail', verifyEmail );
router.post( '/code', verifyCode );

module.exports = router