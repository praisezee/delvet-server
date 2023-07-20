const nodemailer = require( "nodemailer" );

const sendContact = async ( req, res ) =>
{
      const { firstName,surname, phoneNumber, email, message } = req.body;
      if (!email || !message || !phoneNumber) res.status(400).json({message:'Email, phone number or message is empty'})
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
      const html = `
      <p>Name: ${firstName} ${surname} </p>
<p>Email: ${email}</p>
<p>phone Number: ${phoneNumber}</p>
<p>Message: ${message}</p>
      `
const to = ['folorunsopraise12@gmail.com','vivoluwole@gmail.com']
const from= 'Devlevt Pharmacitical Company'
      try {
      await transporter.sendMail( {
            from,
            to,
            subject: 'Someone Tried To Reach You From Your Website',
            html
            } );
            res.sendStatus(200)
      } catch (err) {
            console.log(err)
            res.status(500).json({message: 'internal server error'})
      }
      

};

module.exports ={sendContact}