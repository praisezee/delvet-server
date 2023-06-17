const mySql = require( 'mysql' )


const pool = mySql.createPool( {
      connectionLimit: 10,
      host: 'localhost',
      user: 'root',
      database: 'delvet'
} );

module.exports = pool;
