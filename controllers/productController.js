const pool = require( '../config/dbConn' )
const {v4 : uuid } = require('uuid')

const getProducts = ( req, res ) =>
{
      pool.getConnection( ( err, connection ) =>
      {
            if(err) throw new Error(err)

            connection.query( 'SELECT * FROM products', ( err, rows ) =>
            {
                  connection.release();
                  if ( err ) {
                        console.error(err)
                  } else if ( !err && rows.length ) {
                        res.status(200).json(rows) // will display products
                  } else {
                        res.status(202).json({message:"No product at the moment"})
                  }
            })
      })
}

const createProduct = ( req, res ) =>
{ 
      const { src, name, category, quantity, description, price } = req.body;
      const id = uuid()
      pool.getConnection( ( err, connection ) =>
      {
            if(err) throw new Error(err)

            connection.query( 'INSERT INTO products SET ?', { product_id:id , name, category, quantity, description,price,src }, ( err, rows ) =>
            {
                  connection.release();
                  if ( !err ) {
                        res.status( 201 ).json( { id, name, category, quantity, description, price, src } )
                        console.log('product saved')
                  } else {
                        console.error(err)
                  }
            })
      })
}

const updateProduct = ( req, res ) =>
{
      const { src, name, category, quantity, description, price, id } = req.body;

      pool.getConnection( ( err, connection ) =>
      {
            if ( err ) throw new Error( err ) // to catch the error and prevent the app from crashing on error
            
            connection.query( `SELECT * from products WHERE product_id = '${ id }'`, ( err, rows ) =>
            {
                  console.log( rows )
                  connection.release();
                  
                  if ( err ) {
                        res.status(500).json(err)
                  } else if ( !err && rows.length ) {
                        const product ={...rows[0]}
                        const source = !src ? product.src : src//if src is an empty string,use the src image in the db else replace with new image
                        const productName = !name ? product.name : name//if src is an empty string,use the src image in the db else replace with new image
                        const productQuantity = !quantity ? product.quantity : quantity//if src is an empty string,use the src image in the db else replace with new image
                        const productDescription = !description ? product.description : description//if src is an empty string,use the src image in the db else replace with new image
                        const productCategory = !category ? product.category : category//if src is an empty string,use the src image in the db else replace with new image
                        const productPrice = !price ? product.price : price//if src is an empty string,use the src image in the db else replace with new image
                        connection.query( `UPDATE products SET name = '${ productName }' , category = '${ productCategory }', quantity = ${ productQuantity }, description = '${ productDescription }', price = '${ productPrice }', src = '${source}' WHERE product_id = '${ id }'  `, ( err, rows ) =>
                        {
                              connection.release()
                              if ( !err ) {
                                    const product = { name, category, quantity, description, id, price,source }//if no error, send to front end
                                    console.log(product)
                                    res.status(200).json(product)
                              } else {
                                    console.error(err)
                              }
                        })
                  } else {
                        res.status(202).json({message: `Product with id ${id} was not found`})
                  }
            })
      })
}

const deleteProduct = ( req, res ) =>
{
      const { id } = req.params;
      pool.getConnection( ( err, connection ) =>
      {
            if ( err ) throw new Error( err )

            connection.query( `SELECT * from products WHERE product_id = '${ id}'`,  ( err, row ) =>
            {
                  if ( err ) {
                        res.status(500).json(err) // internal server error
                  } else if (!err && row.length ) {
                        connection.query( `DELETE FROM products WHERE id = '${ id }'`, ( err, rows ) =>
                        {
                              connection.release()
                              if ( !err ) return res.status( 202 ).json( { message: `product with id ${ id } was deleted successfully` } )
                              
                              res.status(500).json(err)
                        })
                  } else {
                        res.status(400).json({message: `Product with id ${id} was not found`})
                  }
            })
            
      })
}

const getSingleProduct = ( req, res ) =>
{
      const { id } = req.params;
      pool.getConnection( ( err, connection ) =>
      {
            if ( err ) throw new Error( err )

            connection.query( `SELECT * from products WHERE product_id = '${ id }'`, ( err, row ) =>
            {
                  if ( err ) {
                        res.status(500).json({message:"internal server error"})
                  } else if ( !err && row.length ) {
                        const product ={...row[0]}
                        res.status(200).json(product) 
                  } else {
                        res.status(400).json({message:"product does not exist"})
                  }
            })
      })
}



module.exports ={getProducts,createProduct, updateProduct, deleteProduct,getSingleProduct}