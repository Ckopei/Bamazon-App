var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "rootroot",
    database: "bamazon_db"
  });
  
  // connect to the mysql server and sql database
  connection.connect(function(err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
  });

//first display all items in the database. id, name, prices, stock. W6D4, line 95-119

//inquirer prompt "what would you like to buy"
//inquirer prompt "how many, etc"

//check if database stock_quantity against customer answer W6D4 Line 120-155

//if yes, update database with new number of stock. Show the customer the price of the order.

//if no, log "Insufficient Quantity!", and call the function to start over.
