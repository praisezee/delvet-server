require('dotenv').config()
const express = require( 'express' );
const cors = require( 'cors' );
const cookieParser = require( 'cookie-parser' );
const app = express()
const credentials = require('./middleware/credentials')
const corsOptions = require('./config/corsOptions')

const PORT = process.env.PORT || 3500;

//CORS - Cross Site Origin Resource Sharing. This give the frontent to get access to the backend.
app.use( credentials );
app.options( cors( corsOptions ) )
app.use( cors(corsOptions) );
//




//Built In middleware
// middleware for encoded data like form data
app.use( express.urlencoded( { extended: true, limit: '20mb' } ) )
//middleware for json file
app.use( express.json( { limit: '20mb' } ) )
// middleware for cookies
app.use( cookieParser() )

//mysql

/* app.get( '', ( req, res ) =>
{
      pool.getConnection((err,connection)=> {
            if ( err ) throw err
            console.log(`connected as id ${connection.threadId}`)

            //querry(sting, fallback)
            connection.query( 'SELECT * from users', ( err, rows ) =>
            {
                  connection.release(); // return the connection to pool
                  if ( !err ) {
                        res.send(rows)
                  } else {
                        console.log(err)
                  }
            })
      }
      );
})

//get by id
app.get( '/:id', ( req, res ) =>
{
      const {id} = req.params
      pool.getConnection((err,connection)=> {
            if ( err ) throw err
            console.log(`connected as id ${connection.threadId}`)

            //querry(sting, fallback)
            connection.query( 'SELECT * from users WHERE id = ?', [id], ( err, rows ) =>
            {
                  connection.release(); // return the connection to pool
                  if ( !err ) {
                        res.send(...rows)
                  } else {
                        console.log(err)
                  }
            })
      }
      );
} )

// delete a record
app.delete( '/:id', ( req, res ) =>
{
      const {id} = req.params
      pool.getConnection((err,connection)=> {
            if ( err ) throw err
            console.log(`connected as id ${connection.threadId}`)

            //querry(sting, fallback)
            connection.query( 'DELETE from users WHERE id = ?', [id], ( err, rows ) =>
            {
                  connection.release(); // return the connection to pool
                  if ( !err ) {
                        res.send('user account deleted')
                  } else {
                        console.log(err)
                  }
            })
      }
      );
})

//add record
app.post( '', ( req, res ) =>
{
      const {name,email,phoneNumber,password} = req.body
      pool.getConnection((err,connection)=> {
            if ( err ) throw err
            console.log(`connected as id ${connection.threadId}`)

            //querry(sting, fallback)
            connection.query( 'INSERT INTO users SET ?', {name,email,phoneNumber,password}, ( err, rows ) =>
            {
                  connection.release(); // return the connection to pool
                  if ( !err ) {
                        res.send('user account created')
                  } else {
                        console.log(err)
                  }
            })
      }
      );
})

//pot to record
app.put( '', ( req, res ) =>
{
      const { name, email, phoneNumber, password,id } = req.body
      pool.getConnection((err,connection)=> {
            if ( err ) throw err
            console.log(`connected as id ${connection.threadId}`)

            //querry(sting, fallback)
            connection.query( 'UPDATE users SET name = ?, email = ?, phoneNumber = ?, password = ? WHERE id = ?', [name,email,phoneNumber,password, id], ( err, rows ) =>
            {
                  connection.release(); // return the connection to pool
                  if ( !err ) {
                        res.send('user account created')
                  } else {
                        console.log(err)
                  }
            })
      }
      );
}) */

//Main route for the server
app.get( '/', ( req, res, next ) =>
{
      res.send( 'Hello world' );
      next();
} );
//Route that handles users registration.
app.use( '/auth', require( './routes/auth' ) )
//Route that handles fetching of products
app.use( '/products', require( './routes/product' ) )
//Route that handles email verification
app.use('/verify', require('./routes/verify'))
// Routes that handles the order of a user
app.use('/order', require('./routes/order'))



app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`))
