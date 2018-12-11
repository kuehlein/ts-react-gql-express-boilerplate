boilerplate for typescript react gql express project

// install dependencies
\$ npm i

--------- postinstall??? --------- (figure out how to prompt user for <your-db-name>)

// create db
\$ createdb <your-db-name>

// create session table
\$ psql <your-db-name> < node_modules/connect-pg-simple/table.sql
