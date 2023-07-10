const {v4: uuid} = require('uuid');
const pool = require( '../config/dbConn' );

const getOrder = ( req, res ) =>
{
      pool.getConnection( ( err, connection ) =>
      {
            if ( err ) throw new Error( err )
            connection.query( 'SELECT * FROM orders', ( err, rows ) =>
            {
                  connection.release();
                  if ( err ) {
                        console.error(err)
                  } else if ( !err && rows.length ) {
                        res.status(200).json(rows) // will display products
                  } else {
                        res.status(202).json({message:"No order at the moment"})
                  }
            })
      })
};

const createOrder = ( req, res ) =>
{
      const order_id = uuid()
      const { user_id, address, products,status } = req.body
      const orderStatus =  !status ? 'pending' : status
console.log( {
                  user_id, address, products,status
            })
      if ( !user_id, !products ) return res.status( 400 ).json( { message: "all field is required" } )
      pool.getConnection( ( err, connection ) =>
      {
            
            const json = JSON.stringify( products )
            //console.log(JSON.parse(json))
            if ( err ) throw new Error( err )
            connection.query( 'INSERT INTO orders SET ?', { order_id, user_id, address, products:json, status:orderStatus }, (err, rows) =>
            {
                  connection.release();
                  if ( !err ) {
                        res.status( 201 ).json({order_id,address,products,status})
                        console.log('order created')
                  } else {
                        console.error(err)
                  }
            })
      })
}

const updateOrder = ( req, res ) =>
{
      const { address, status, id } = req.body
      pool.getConnection( ( err, connection ) =>
      {
            if ( err ) throw new Error( err )
            connection.query( `SELECT * from orders WHERE order_id = '${ id }'`, ( err, rows ) =>
            {
                  if ( err ) {
                        res.status(500).json({message:err})
                  } else if ( !err && rows.length ) {
                        const order = { ...rows[ 0 ] }
                        const orderAddress = !address ? order.address : address
                        const orderStatus = !status ? order.status : status
                        connection.query(`UPDATE orders SET address ='${orderAddress}, status='${orderStatus}' WHERE order_id = ${id}`,( err, rows ) =>
                        {
                              connection.release()
                              if ( !err ) {
                                    res.status(200)
                              } else {
                                    console.error(err)
                              }
                        })
                  }else{
                        res.status(400).json({message: `order with the id ${id} was not found`})
                  }
            })
      })
}

const deleteOrder = ( req, res ) =>
{
      const { id } = req.params;
      pool.getConnection( ( err, connection ) =>
      {
            if ( err ) throw new Error( err )
            connection.query( `SELECT * from orders WHERE order_id = '${ id }'`, ( err, rows ) =>
            {
                  if ( err ) {
                        res.status(500).json({message:err})
                  } else if ( !err && rows.length ) {
                        connection.query( `DELETE from orders where order_id = '${ id }'`, ( err, rows ) =>
            {
                  if ( !err ) return res.status( 202 ).json( { message: `order with id ${ id } was deleted successfully` } )
                  res.status(500).json(err)
            })
                  }else{
                        res.status(400).json({message: `order with the id ${id} was not found`})
                  }
            })
      })
};

const getUserOrder = ( req, res ) =>
{
      const { id } = req.params;
      pool.getConnection( ( err, connection ) =>
      {
            if ( err ) throw new Error( err )
            connection.query( `SELECT * from orders where user_id = '${ id }'`, ( err, rows ) =>
            {
                  if ( !err ) return res.status( 200 ).json(rows)
                  res.status(500).json(err)
            })
      })
}
const getSingleOrder = ( req, res ) =>
{
      const { id } = req.params;
      pool.getConnection( ( err, connection ) =>
      {
            if ( err ) throw new Error( err )
            connection.query( `SELECT * from orders where order_id = '${ id }'`, ( err, rows ) =>
            {
                  if ( !err ) return res.status( 200 ).json({...rows[0]})
                  res.status(500).json(err)
            })
      })
}

module.exports = {createOrder,updateOrder,deleteOrder,getSingleOrder,getOrder,getUserOrder}
