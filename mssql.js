const mssql		=	require( 'mssql' )
const NKSQL = require( 'nk-mssql-builder' )

const mssqlDBJSObject = {
	db: null,
	retryTimeout: 100,
	connectionTimeout: 30000,
	insertList: {},
	deleteList: {},
	updateList: {},
	databaseList: {},
	id: name => objectid( name ),
	run: ( dbName, sql, callback ) => {
		if( mssqlDBJSObject.databaseList[dbName] )  {
			mssqlDBJSObject.databaseList[dbName].query( sql )
				.then( result => {
					if( !result.err && result.res.recordsets )	{
						callback( result.res.recordsets[0], null )
					} else {
						callback( [], null )
					}
				})
				.catch( err => {
					callback( [], err )
				})
		} else {
			callback( [], null )
		}
	},
	start: ( dbName, ip, port, user, pass, timeoutInMS, encryptConnection, callback ) => {
		mssql.connect( { user: user, password: pass, server: ip, database: dbName, port: port, connectionTimeout: timeoutInMS, requestTimeout: timeoutInMS, options: { enableArithAbort: true, encrypt: encryptConnection } } ).then( serverConnection => {
			mssqlDBJSObject.databaseList[dbName] = serverConnection
			if( mssqlDBJSObject.databaseList[dbName] )  {
				callback( false, null )
			}	else	{
				callback( true, 'cannot connect' )
			}
		}).catch( err => {
			callback( true, ( ( err && err.originalError && err.originalError.message )? err.originalError.message: err ) )
		})
	},
	insert: ( dbName, table, rowOrRows, callback ) => mssqlDBJSObject.run( dbName, NKSQL.insert( table, rowOrRows ), callback ),
	delete: ( dbName, table, dataToRemove, callback ) => mssqlDBJSObject.run( dbName, NKSQL.delete( table, dataToRemove ), callback ),
	update: ( dbName, table, dataToUpdate, newData, callback ) => mssqlDBJSObject.run( dbName, NKSQL.update( table, newData, dataToUpdate ), callback ),
	singleQuery: ( dbName, table, query, callback ) => mssqlDBJSObject.run( dbName, NKSQL.query( table, 1, {}, query, null ), ( rows, error ) => callback( ( ( rows && ( rows.length > 0 ) )? rows[0]: null ), error ) ),
	query: ( dbName, table, query, callback ) => mssqlDBJSObject.run( dbName, NKSQL.query( table, null, {}, query, null ), callback ),
	join: ( dbName, table, tableIDField, joinTo, joinToIDField, joinedToElement, sortBy, query, callback ) => mssqlDBJSObject.run( dbName, NKSQL.query( table, null, sortBy, query, [ { from: joinTo, field: tableIDField, fromField: joinToIDField, name: joinedToElement } ] ), callback ),
	joinsLimit: ( dbName, table, joins, max, sortBy, query, callback ) => mssqlDBJSObject.run( dbName, NKSQL.query( table, max, sortBy, query, joins ), callback ),
	querySort: ( dbName, table, sortBy, query, callback ) => mssqlDBJSObject.run( dbName, NKSQL.query( table, null, sortBy, query, null ), callback ),
	queryLimitSort: ( dbName, table, max, sortBy, query, callback ) => mssqlDBJSObject.run( dbName, NKSQL.query( table, max, sortBy, query, null ), callback )
}

module.exports = mssqlDBJSObject
