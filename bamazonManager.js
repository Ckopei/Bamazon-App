var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "rootroot",
    database: "bamazon_db"
});
// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
});

function start() {
    inquirer
        .prompt({
            name: "managerPortal",
            type: "list",
            message: "What department would you like?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
        })
        .then(function (answer) {
            switch (answer.managerPortal) {
                case "View Products for Sale":
                    viewAll();
                    break;
                case "View Low Inventory":
                    viewLow();
                    break;
                case "Add to Inventory":
                    addInv();
                    break;
                case "Add New Product":
                    addNew();
                    break;
                default:
                    break;
            }
        });
}

function viewAll() {
    //   * If a manager selects `View Products for Sale`, the app should list every available item: the item IDs, names, prices, and quantities.
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.table(res);
        start();
    });
};

function viewLow() {
    //   * If a manager selects `View Low Inventory`, then it should list all items with an inventory count lower than five.
    connection.query("SELECT * FROM products WHERE stock_quantity<=5", function (err, res) {
        if (err) throw err;
        console.table(res);
        start();
    });
}

function addInv() {
    //   * If a manager selects `Add to Inventory`, your app should display a prompt that will let the manager "add more" of any item currently in the store.
}

function addNew() {
    //   * If a manager selects `Add New Product`, it should allow the manager to add a completely new product to the store.
}







