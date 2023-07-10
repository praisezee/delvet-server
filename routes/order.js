const express = require( 'express' );
const { getOrder, createOrder, updateOrder, getSingleOrder, getUserOrder, deleteOrder } = require( '../controllers/orderController' );
const router = express.Router();


router.route( '/' )
      .get( getOrder )
      .post( createOrder )
      .put( updateOrder )

router.get( '/admin/:id', getSingleOrder )
router.get('/client/:id',getUserOrder)
router.delete('/:id',deleteOrder)


module.exports = router