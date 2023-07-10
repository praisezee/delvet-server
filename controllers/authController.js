const pool = require('../config/dbConn')
const bcrypt = require( 'bcrypt' );
const jwt = require( 'jsonwebtoken' );
const {v4 : uuid } = require('uuid')

const createUser = async ( req, res ) =>
{
      const { name, email, phoneNumber, password } = req.body;
      console.log(req.body)
      const id = uuid()
      if ( !name || !email || !phoneNumber || !password ) return res.status( 400 ).json( { message: "All field must be entered" } );// The server sends a status code os 400 meaning bad request. this is to tell the user that all field must be field
      pool.getConnection( ( err, connection ) =>
      {
            if ( err ) throw err;
            console.log( `connected as id ${ connection.threadId }` );

            //querry(sting, fallback)
            
            connection.query( `SELECT * FROM users WHERE email = '${ email }'`, async ( err, rows ) =>
            {
                  if ( !err ) {
                        if ( rows.length === 0 ) {
                              
                              const hashedPassword = await bcrypt.hash( password, 10 )
                              connection.query( 'INSERT INTO users SET ?', { user_id:id,name, email, phoneNumber, password: hashedPassword }, ( err, rows ) =>
                              {
                              connection.release(); // return the connection to pool
                              if ( !err ) {
                                    res.status( 201 ).json( { message: `New user ${ name } account was created` } );
                              } else {
                                    console.log( err );
                              }
                        } )
                        } else {
                              return res.status( 409 ).json( { message: "Email already in use" } );
                        }
                  } else {
                        res.status(500).json( { message: `New user ${ name } account was not created` } );
                  }
            }
      
            );
      }
      )
      
};

const loginUser = async ( req, res ) =>
{
      const { email, password } = req.body;
      if ( !email || !password ) return res.status( 400 ).json( { message: "All field must be entered" } );// The server sends a status code os 400 meaning bad request. this is to tell the user that all feild must be feild
      pool.getConnection( ( err, connection ) =>
      {
            if ( err ) throw err;
            console.log( `connected as id ${ connection.threadId }` );

            connection.query( `SELECT * FROM users WHERE email = '${ email }'`, async ( err, rows ) =>
            {
                  if ( err ) {
                        res.status(500).json( { message: `user with ${ email } account was not logged in` } );
                  } else if ( !err && rows.length ) {
                        const users = {...rows[0]}
                        //console.log(rows)
                        const match = await bcrypt.compare(password, users.password ); // to compare the password the user entered against that saved in the database
                        if ( match ) {// for authorization
                              const accessToken = jwt.sign(
                                    { "email": email },
                                    process.env.ACCESS_TOKEN,
                                    { expiresIn: '60s' }
                              );
                              const refreshToken = jwt.sign(
                                    { "email": email  },
                                    process.env.REFRESH_TOKEN,
                                    { expiresIn: '1d' }
                              );
                              connection.query( `UPDATE users SET refreshToken = '${refreshToken}' WHERE email = '${email}'`, ( err, rows ) =>
                              {
                                    connection.release(); // return the connection to pool
                                    if ( !err ) {
                                          console.log('refreshtoken updated')
                                    } else {
                                          console.log(err)
                                    }
                              } )
                              res.cookie( 'jwt', refreshToken, {
                                    httpOnly: true,
                                    maxAge: 24 * 60 * 60 * 1000,
                                    sameSite: 'None',
                                    secure: true
                              } );
                              const user = {
                                    id : users.user_id,
                                    name : users.name,
                                    email: users.email,
                                    accessToken,
                                    phoneNumber : users.phoneNumber
                              }
                              res.status(200).json(user)
                        } else {
                              res.status(401).json({message:"invalid password"})
                        }
                  } else {
                        res.status(401).json({message:'Account does not exist'})
                  }
            }
      
            );
      })
      
}

const updateUser = ( req, res ) =>
{
      const { name, email, phoneNumber, id } = req.body;
      if ( !name || !email || !phoneNumber || !id ) return res.status( 400 ).json( { message: "All feild must be entered" } );// The server sends a status code os 400 meaning bad request. this is to tell the user that all feild must be feild
      pool.getConnection( ( err, connection ) =>
      {
            if ( err ) throw err
            console.log( `connected as id ${ connection.threadId }` )
            connection.query( `SELECT * FROM users WHERE user_id = '${ id }'`, ( err, rows ) =>
            {
                  if ( err ) {
                        res.status(500).json( { message: `user update failed` } );
                  } else if ( !err && rows.length ) {
                        connection.query( `UPDATE users SET name = '${ name }', email= '${ email }', phoneNumber = '${ phoneNumber }' WHERE user_id = ${ id }`, ( err, rows ) =>
            {
                  connection.release(); // return the connection to pool
                              if ( !err ) {
                                    const accessToken = jwt.sign(
                                    { "email": email },
                                    process.env.ACCESS_TOKEN,
                                    { expiresIn: '60s' }
                              );
                                    const user = {
                                          name,email,phoneNumber,id,accessToken
                                    }
                                    res.status(200).json(user)
                  } else {
                        console.log(err)
                  }
            })
                        
                  } else {
                        res.status(401).json({message:'Account does not exist'})
                  }
            })
      })
}

const deleteUser = ( req, res ) =>
{
      const { id } = req.params
      pool.getConnection( ( err, connection ) =>
      {
            if ( err ) throw err
            console.log(`connected as id ${connection.threadId}`)

            connection.query( `SELECT * FROM users WHERE user_id = ${ id }`, ( err, rows ) =>
            {
                  if ( err ) {
                        res.status(500).json( { message: `user delete failed` } );
                  } else if ( !err && rows.length ) {
                        connection.query( `DELETE from users WHERE user_id = ${ id }`, ( err, rows ) =>
            {
                  connection.release(); // return the connection to pool
                              if ( !err ) {
                              res.status(200).json({message:"Account deleted"})
                  } else {
                        console.log(err)
                  }
            })
                        
                  } else {
                        res.status(401).json({message:'Account does not exist'})
                  }
            })
      })
}

module.exports = { createUser, loginUser, updateUser, deleteUser };