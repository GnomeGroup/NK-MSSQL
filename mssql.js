const mssql		=	require( 'mssql' )
const NKSQL = require( '@encke/nk-sql-builder' )

NKSQL.setType( 'mssql' )

const mssqlDBJSObject = {
	db: null,
	retryTimeout: 100,
	connectionTimeout: 30000,
	insertList: {},
	deleteList: {},
	updateList: {},
	databaseList: {},
	id: name => objectid( name ),
	run: async ( dbName, sql, callback ) => {
		if( mssqlDBJSObject.databaseList[dbName] )  {
			let result = await mssqlDBJSObject.databaseList[dbName].query( sql )
			if( !result.err && result.res.recordsets )	{
				callback( result.res.recordsets[0] )
			} else {
				callback( [] )
			}
		} else {
			callback( [] )
		}
	},
	start: ( dbName, ip, port, user, pass, timeoutInMS, callback ) => {
		mssql.connect( { user: user, password: pass, server: ip, database: dbName, port: port, connectionTimeout: timeoutInMS, enableArithAbort: true } ).then( serverConnection => {
			mssqlDBJSObject.databaseList[dbName] = serverConnection
			if( mssqlDBJSObject.databaseList[dbName] )  {
				callback( false, null )
			}	else	{
				callback( true, 'cannot connect' )
			}
		}).catch( err => {
			callback( true, err )
		})
	},
	insert: ( dbName, table, rowOrRows, callback ) => mssqlDBJSObject.run( dbName, NKSQL.insert( table, rowOrRows ), callback ),
	delete: ( dbName, table, dataToRemove, callback ) => mssqlDBJSObject.run( dbName, NKSQL.delete( table, dataToRemove ), callback ),
	update: ( dbName, table, dataToUpdate, newData, callback ) => mssqlDBJSObject.run( dbName, NKSQL.update( table, newData, dataToUpdate ), callback ),
	singleQuery: ( dbName, table, query, callback ) => mssqlDBJSObject.run( dbName, NKSQL.query( table, 1, {}, query, null ), callback ),
	query: ( dbName, table, query, callback ) => mssqlDBJSObject.run( dbName, NKSQL.query( table, null, {}, query, null ), callback ),
	join: ( dbName, table, tableIDField, joinTo, joinToIDField, joinedToElement, sortBy, query, callback ) => mssqlDBJSObject.run( dbName, NKSQL.query( table, null, sortBy, query, [ { from: joinTo, field: tableIDField, fromField: joinToIDField, name: joinedToElement } ] ), callback ),
	joinsLimit: ( dbName, table, joins, max, sortBy, query, callback ) => mssqlDBJSObject.run( dbName, NKSQL.query( table, max, sortBy, query, joins ), callback ),
	querySort: ( dbName, table, sortBy, query, callback ) => mssqlDBJSObject.run( dbName, NKSQL.query( table, null, sortBy, query, null ), callback ),
	queryLimitSort: ( dbName, table, max, sortBy, query, callback ) => mssqlDBJSObject.run( dbName, NKSQL.query( table, max, sortBy, query, null ), callback )
}

module.exports = mssqlDBJSObject
