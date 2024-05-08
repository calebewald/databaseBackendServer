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
try {
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

console.log("2");


/* This represents an item object in our database. We need this
to specify what kind of information the API endpoint will handle */
const Item = sequelize.define('Item'/*name of the model*/, {
    /*model properties (the stuff in the db) */
    ID: { type: Sequelize.INTEGER },
    Name: { type: Sequelize.STRING },
    Price: { type: Sequelize.FLOAT },
    Category: { type: Sequelize.STRING },
    Aisle_Number: { type: Sequelize.INTEGER },
})

// don't know what this does
// Item.sync(); 

console.log("3");


/*A route handler. This will be run when a GET request (someone searches the '/api/items' link)
is made. It should hopefully return the information in the "items" table in our database.
UNTESTED*/
app.get('/api/items'/*Link the user will search (don't know what the prefix will be)*/,
    async (req, res) => { /*Controller function. Run upon recieving the data */
        try {
            // get all item info from items, don't know what findAll() does but sequelize docs told me to use it
            const allItems = Item.findAll();
            console.log('got the items');
        }
        catch {
            console.log("couldn't fetch items...")
        }
    })

console.log("4");


/*If this runs, it will "start" the server. app (which is the server) will listen for any communication
on port 3000. So something probably has to be sent to port 3000.*/
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
server.close();
console.log("5");