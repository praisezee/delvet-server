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
                        res.status(200).json(rows)
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

            connection.query( 'INSERT INTO products SET ?', { id, name, category, quantity, description,price,src }, ( err, rows ) =>
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
            if ( err ) throw new Error( err )
            
            connection.query( `SELECT * from products WHERE id = '${ id }'`, ( err, rows ) =>
            {console.log(rows)
                  if ( err ) {
                        res.status(500).json(err)
                  } else if ( !err && rows.length ) {
                        connection.query( `UPDATE products SET name = '${ name }' , category = '${ category }', quantity = ${ quantity }, description = '${ description }', price = '${ price }', src = '${src}' WHERE id = '${ id }'  `, ( err, rows ) =>
                        {
                              connection.release()
                              if ( !err ) {
                                    const product = { name, category, quantity, description, id, price }
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

            connection.query( `SELECT * from products WHERE id = '${ id}'`,  ( err, row ) =>
            {
                  if ( err ) {
                        res.status(500).json(err)
                  } else if (!err && row.length ) {
                        connection.query( `DELETE FROM products WHERE id = '${ id }'`, ( err, rows ) =>
                        {
                              connection.release()
                              if ( !err ) return res.status( 202 ).json( { message: `product with id ${ id } was deleted successfully` } )
                              
                              res.status(500).json(err)
                        })
                  } else {
                        res.status(202).json({message: `Product with id ${id} was not found`})
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

            connection.query( `SELECT * from products WHERE id = '${ id }'`, ( err, row ) =>
            {
                  if ( err ) {
                        res.status(500).json({message:"internal server error"})
                  } else if ( !err && row.length ) {
                        res.status(200).json(row[0])
                  } else {
                        res.status(400).json({message:"product does not exist"})
                  }
            })
      })
}



module.exports ={getProducts,createProduct, updateProduct, deleteProduct,getSingleProduct}