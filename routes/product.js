const express = require( 'express' );
const { getProducts, createProduct, updateProduct, getSingleProduct, deleteProduct } = require( '../controllers/productController' );
const router = express.Router();


router.route( '/' )
      .get(getProducts)
      .post( createProduct )
      .put(updateProduct)

router.route( '/:id' )
      .get( getSingleProduct )
      .delete(deleteProduct)

module.exports = router