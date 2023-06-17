const mySql = require( 'mysql' )


const pool = mySql.createPool( {
      connectionLimit: 10,
      host: 'sql306.infinityfree.com',
      port: 3306,
      user: 'epiz_30088273',
      password:process.env.DB_PASSWORD,
      database: 'epiz_30088273_delvet'
} );

module.exports = pool;
