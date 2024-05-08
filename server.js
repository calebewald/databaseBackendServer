/*What I understand about this so far:
  We can't access our backend directly from our frontend, because from a security standpoint
  it isn't safe (I don't know why though). To create a connection between the two, we need
  a server that can handle requests for information from the frontend, and communicate from
  the backend to fufill them. So in this file you will find: 
    - a connection to the database
    - "route handlers" and "controller functions" which represent the handling of finding 
        and validating data from requests from the frontend
    - Sequelize "models" which represent the type of information that will be recieved from the db
    - probably other stuff too
*/
// express is the server stuff, sequelize is for mysql specific stuff??
const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

var app = express(); // this is the server

console.log("1");


/* Creates a sequelize connection to our database, specifying that mysql is the db type*/
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

console.log("2");


/* This represents an item object in our database. We need this
to specify what kind of information the API endpoint will handle */
const item = sequelize.define('item'/*name of the model*/, {
    /*model properties (the stuff in the db) */
    ID: { type: Sequelize.INTEGER },
    Name: { type: Sequelize.STRING },
    Price: { type: Sequelize.FLOAT },
    Category: { type: Sequelize.STRING },
    Aisle_Number: { type: Sequelize.INTEGER }
})

// don't know what this does, when I uncomment it I get a whole bunch of errors
item.sync()
    .then(() => {
        console.log('Item model synchronized successfully.');
    })
    .catch(error => {
        console.error('Error synchronizing Item model:', error);
    });

console.log("3");


/*A route handler. This will be run when a GET request (someone searches the '/api/items' link)
is made. It should hopefully return the information in the "items" table in our database.
UNTESTED*/
app.get('/api/items'/*Link the user will search (don't know what the prefix will be)*/,
    async (req, res) => { /*Controller function. Run upon recieving the data */
        try {
            const allItems = await item.findAll();
            console.log('Got the items:', allItems);
            res.json(allItems); // Send fetched items back to the client
        } catch (error) {
            console.error("Couldn't fetch items:", error);
            res.status(500).json({ error: "Internal server error" }); // Send error response
        }
    });

app.get('', async () => { console.log('hello world!') });

console.log("4");


const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});