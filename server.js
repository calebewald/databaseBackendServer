/*What I understand about this so far:
  We can't access our backend directly from our frontend, because from a security standpoint
  it isn't safe (I don't know why though). To create a connection between the two, we need
  a server that can handle requests for information from the frontend, and communicate from
  the backend to fufill them. So in this file you will find: 
    - a connection to the database 
    - "route handlers" and "controller functions" which represent the handling of finding 
        and validating get requests from browser searches
    - Sequelize "models" which represent the type of information that will be recieved from the db
    - probably other stuff too
*/
// express is the server stuff, sequelize is for mysql querying with mysql
const express = require('express');
const { Sequelize, Model, DataTypes } = require('sequelize');

/* Creates a sequelize connection to our database, specifying that mysql is the db type
   tried this version from the documentation, it doesn't work and I don't know why. Just
   used URI.*/
// const sequelize = new Sequelize(
//     'bloxhgidgazefqzdxmct',
//     'ue1c7wc2ajrshq8j',
//     '15J5HQCm2nnXxdyGHo0d',
//     {
//         host: 'localhost'
//         dialect: 'mysql',
//     });

// looks like this works
const sequelize = new Sequelize("mysql://ue1c7wc2ajrshq8j:15J5HQCm2nnXxdyGHo0d@bloxhgidgazefqzdxmct-mysql.services.clever-cloud.com:3306/bloxhgidgazefqzdxmct");
sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(error => {
        console.error('Unable to connect to the database:', error);
    });

/* This represents an item object in our database. We need this
to specify what kind of information the API endpoint will handle.
    had to be really careful with nameing this, started with
    Item and the sync function below didn't work because the
    table with the data in it was named "items" not "Items" */

const item = sequelize.define('item'/*name of the model*/, {
    /*model properties (the stuff in the db) */
    ID: { type: DataTypes.INTEGER },
    Name: { type: DataTypes.STRING },
    Price: { type: DataTypes.FLOAT },
    Category: { type: DataTypes.STRING },
    Aisle_Number: { type: DataTypes.INTEGER }
});

/* Syncronizes the data model with the mysql db. Basically I think it checks for a table
   that has matching data to the one described in our model. */
// also utilizes a promise which I understand enough to use it like this, 
// but could use more work with
item.sync() // promises to synchronize data with db
    .then(() => { // executed if the promise is fufilled
        console.log('Item model synchronized successfully.');
    })
    .catch(error => { // executed if the promise is not fufilled
        console.error('Error synchronizing Item model:', error);
    });


// test route handler
app.get('/', async (req, res) => { res.json("hello world!") });

/*A route handler. This will be run when a GET request (someone searches the '/api/items' link)
is made. It should hopefully return the information in the "items" table in our database.
*/
app.get('/api/items'/*Link the user will search (don't know what the prefix will be)*/,
    async (req, res) => { /*Controller function. Run upon recieving the data */
        try {
            const allItems = await item.findAll({ attributes: { exclude: ['id', 'createdAt', 'updatedAt'] } });
            console.log('Got the items:', allItems);
            res.json(allItems); // Send fetched items back to the client
        } catch (error) {
            console.error("Couldn't fetch items:", error);
            res.status(500).json({ error: "Internal server error" }); // Send error response
        }
    });

/*Actual server. This is not what I thought it would look like. All it does is
  listen for requesets on a specific port. */
var app = express(); // this represents the server
const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});