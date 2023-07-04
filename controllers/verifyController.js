const pool = require( '../config/dbConn' );
const nodemailer = require( 'nodemailer' );
const cryptoRandomString = require( 'crypto-random-string' );

const verifyEmail = async ( req, res ) =>
{
      const { email } = req.body;
      if(!email) return res.status(400).json({message:"email is required"})
      const code = cryptoRandomString( { length: 6, type: 'alphanumeric' } )

      const html = `
      <h4>We noticed that you registered on delvet. your verification code is </h4>
      <h1>${code}</h1>
      `
      const transporter = nodemailer.createTransport( {
                  service: 'gmail',
            auth: {
                  user: process.env.EMAIL,
                  pass: process.env.EMAIL_PASSWORD
            },
            tls: {
                  rejectUnauthorized:false
            }
            } )
            const mailOption = {
                  from:process.env.EMAIL,
                  to: email,
                  subject: 'Verify your Email',
                  html
            }
      pool.getConnection( ( err, connection ) =>
      {
            if (err) throw new Error(err)

            connection.query( `SELECT * FROM users WHERE email = '${ email }'`,  ( err, rows ) =>
            {
                  if ( err ) {
                        res.status(500).json({message: 'Internal server error'})
                  } else if ( !err && rows.length ) {
                        connection.query( `UPDATE users SET verificationCode = '${ code }' WHERE email = '${ email }'`, async (err,rows)=>{
                              if ( !err ) {
                                    await transporter.sendMail( mailOption )
                                    console.log( 'verification code updated' )
                                    res.status(200).json({'message': 'verification code sent to email'})
                              } else {
                                    console.log(err)
                              }
                        } )
                  } else {
                        res.status(401).json({message:'Account does not exist'})
                  }
            })
      })
};


const verifyCode = ( req, res ) =>
{
      const { code, email } = req.body;
      if(!email|| !code) return res.status(400).json({message:"all field is required"})
      pool.getConnection( ( err, connection ) =>
      {
            if (err) throw new Error(err)

            connection.query( `SELECT * FROM users WHERE email = '${ email }'`,  ( err, rows ) =>
            {
                  if ( err ) {
                        res.status(500).json({message: 'Internal server error'})
                  } else if ( !err && rows.length ) {
                        const user = { ...rows[ 0 ] }
                        if ( user.verificationCode === code ) {
                              const verify = true
                              connection.query( `UPDATE users SET verified = ${verify} WHERE email = '${ email }'`, ( err, rows ) =>
                              {
                                    connection.release()
                                    if ( !err ) {
                                          res.status(200).json({...user, verified:true})
                                    } else {
                                          console.error(err)
                                    }
                              
                              } );
                        } else{
                              return res.status( 401 ).json( { message: "invalid verification code" } )
                              }
                  } else {
                        res.status(401).json({message:'Account does not exist'})
                  }
            })
      })
};

module.exports = {verifyCode,verifyEmail}