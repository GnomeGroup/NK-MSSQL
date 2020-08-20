# NK-MSSQL
MSSQL Connection Class for the NK Node Package

## Installation

Install using NPM

```bash
npm i nk-mssql --save
```
---
## How to use

MSSQL is the Industry leader of Relational Database with Error Protection

---

## Connecting

### To connect to a server use NKMSSQL.start():

```
NKMSSQL.start( 
  <Database Name>, //String
  <IP>, //String
  <Port>, //Number
  <User>, //String
  <Password>, //String
  <Timeout in milliseconds>, //Number
  <Use Encrypted Connection>, //Bool
  <Callback> //Function
);
```

The **database connection** object is saved in the **NKMSSQL Object**. Indexed by the database **name**, so there is a caveat to not use the same database name across distinct servers.

Example:
```node
const NKMSSQL = require( 'nk-mssql' )
NKMSSQL.start( 'MyDatabase', '127.0.0.1', 1433, null, null, null, null, true, ( isError, errorMessage ) => {
  //Super duper awesome code here!
  console.log( isError, errorMessage )
})
```

### To Start and connect to **Multiple Servers**

WHAT?! Yes, you can connect to multiple servers in the same core, using them as objects for real-time compliances, for example:
```node
const NKMSSQL = require( 'nk-mssql' )
NKMSSQL.start( 'MyDatabase', '127.0.0.1', 1433, null, null, null, ( isError1, errorMessage1 ) => NKMSSQL.start( 'RemoteDB1', 'remote.mydomain.com', 1433, null, null, null, ( isError2, errorMessage2 ) => NKMSSQL.start( 'RemoteDB2', 'remote2.mydomain.com', 1433, null, null, null, ( isError3, errorMessage3 ) => {
  console.log( isError1, errorMessage1, isError2, errorMessage2, isError3, errorMessage3 )
})))
```
---

## Common Utility Functions

### To INSERT a new row or a set of rows, use NKMSSQL.insert():
```
NKMSSQL.insert( 
  <Database Name>, //String 
  <Table Name>, //String
  <ROW OR ROWS>, //A single Object to insert one, or an Array of Objects to insert many
  <Callback> //Function
) 
```

Example:
```node
NKMSSQL.insert( 'MyDatabase', 'users', 
  { 
    username: 'jose', 
    pass: '123', 
    active: false, 
    added: ( new Date() ).getTime() 
  }, 
  () => console.log( 'all done' ) )
```

### To DELETE rows from the Table, use NKMSSQL.delete():
```
NKMSSQL.delete(
  <Database Name>, //String 
  <Table Name>, //String
  <DATA TO REMOVE>, //Object
  <Callback> //Function
)
```
Example:
```node
NKMSSQL.delete( 'MyDatabase', 'users', 
  { 
    myuser: NKMSSQL.id( user._id ) 
  }, 
  () => console.log( 'all done' ) )
```

### To UPDATE rows in the Table use NKMSSQL.update: 
```
NKMSSQL.update(
  <Database Name>, //String 
  <Table Name>, //String
  <DATA TO UPDATE>, //Object
  <NEW DATA>, //Object
  <Callback> //Function
)
```
Example:
```node
NKMSSQL.update( 'MyDatabase', 'users', 
  { 
    active: false 
  }, 
  { 
    active: true
  }, 
  () => console.log( 'all done' ) 
)
```

### To QUERY the Table use NKMSSQL.query():
```
NKMSSQL.query(
  <Database Name>, //String 
  <Table Name>, //String
  <QUERY>, //Object
  <Callback> //Function, Recieves rows from query
)
```
Example:
```node
NKMSSQL.query( 'MyDatabase', 'users', 
  { 
    active: true 
  }, 
  rowsFromQuery => console.log( rowsFromQuery ) 
)
```

### To QUERY with a SORT use NKMSSQL.querySort:
```
NKMSSQL.querySort(
  <Database Name>, //String 
  <Table Name>, //String
  <SORT BY>, //Object
  <QUERY>, //Object
  <Callback> //Function, Recieves rows from query
)
```
Example:
```node
NKMSSQL.querySort( 'MyDatabase', 'users', 
  { added: 1 }, 
  { active: true }, 
rowsFromQuery => console.log( rowsFromQuery ) )
```


### To QUERY with a SORT and LIMIT, use NKMSSQL.queryLimitSort:
```
NKMSSQL.queryLimitSort(
  <Database Name>, //String 
  <Table Name>, //String
  <LIMIT>, //Number
  <SORT BY>, //Object
  <QUERY>, //Object
  <Callback> //Function, Recieves rows from query
)
```
Example
```node
NKMSSQL.queryLimitSort( 'MyDatabase', 'users', 
  100, 
  { added: 1 }, 
  { active: true }, 
  rowsFromQuery => console.log( rowsFromQuery ) 
)
```

### For a SINGLE QUERY the Table use NKMSSQL.singleQuery():
Note: singleQuery should only ever query **ONE ROW**.
```
NKMSSQL.singleQuery(
  <Database Name>, //String 
  <Table Name>, //String
  <QUERY>, //Object
  <Calback> //Function, Recieves a single row from query.
);
```
Example:
```node
NKMSSQL.singleQuery( 'MyDatabase', 'users', 
  { 
    myuser: NKMSSQL.id( user._id ) 
  }, 
  rowFromQuery => console.log( rowFromQuery ) 
)
```
This **singleQuery** is very useful in the authentication methods, e.g.
```node
NKMSSQL.singleQuery( 'MyDatabase', 'users', 
  { loginSessionKey: req.sessionKey }, 
  rowFromQuery => res.json( rowFromQuery? true: false ) 
)
```

### To JOIN a SINGLE Table to another, use NKMSSQL.join()
```
NKMSSQL.singleQuery(
  <Database Name>, //String 
  <Table Name>, //String
  <Table ID Field>, //String
  <Name of Table to join to>, //String
  <ID Field of Table to join to>, //String
  <Join to Element>, //String
  <Sort By>, //Object
  <Query>, // Object
  <Calback> //Function, Recieves rows from query
);
```
Example:
```node
NKMSSQL.join( 'MyDatabase', 'users', 
  '_id', 
  'photos',
  'user_id', 
  'photos', 
  { added: 1 }, 
  { myuser: NKMSSQL.id( user._id ) }, 
  rowsFromQuery => console.log( rowsFromQuery ) 
)
```

### To QUERY, and perform a LIST of JOINS defined in the query, use NKMSSQL.joinsLimit():
```
NKMSSQL.joinsLimit(
  <Database Name>, //String 
  <Table Name>, //String
  <JOINS>, //Array of Objects
  <LIMIT>, //Number
  <SORT BY>, //Object
  <QUERY>, //Object
  <Calback> //Function, Recieves rows from query
);
```
Example
```node
const joins = [
  { from: 'photos', field: '_id', fromField: 'user_id', as: 'photos' },
  { from: 'history', field: '_id', fromField: 'user_id', as: 'transactions' }
];

NKMSSQL.joinsLimit( 'MyDatabase', 'users', 
  joins, 
  100, 
  { added: 1 }, 
  { active: true }, 
  rowsFromQuery => console.log( rowsFromQuery ) 
)
```
---

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
