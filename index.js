const NK = require( "nk-node" );
const mssql = require( 'mssql' )

const mySQLTransport = {
  obj: null,
  connect: ( configuration ) => {
    mySQLTransport.obj = mysql.createConnection( configuration )
    mySQLTransport.obj.connect()
  },
  query: ( sql, callback ) => {
    if( mySQLTransport.obj )  {
        mySQLTransport.obj.query( sql, ( error, results, fields ) => callback( error? []: results ) )
    } else {
      callback( [] )
    }
  },
  close: () => mySQLTransport.obj.end()
}

const msSQLTransport = {
  obj: null,
  connect: async ( configuration ) => {
    msSQLTransport.obj = await mssql.connect( 'mssql://' + escape( configuration.user ) + ':' + escape( configuration.password ) + '@' + escape( configuration.host ) + '/' + escape( configuration.database ) )
  },
  query: async ( sql, callback ) => {
    if( msSQLTransport.obj )  {
      let result = await mssql.query( sql )
      if( !result.err && result.res.recordsets )	{
  			callback( result.res.recordsets[0] )
      } else {
        callback( [] )
      }
    } else {
      callback( [] )
    }
  },
  close: () => {}
}