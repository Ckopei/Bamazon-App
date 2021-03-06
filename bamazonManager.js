var mysql = require("mysql");
var inquirer = require("inquirer");
var figlet = require('figlet');

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
    console.log(figlet.textSync('Bamazon!', {
        font: 'Ghost',
        horizontalLayout: 'default',
        verticalLayout: 'default'
    }));
    inquirer
        .prompt({
            name: "managerPortal",
            type: "list",
            message: "What would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
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
                case "Exit":
                    connection.end();
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
    connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;
        // once we have queried the items, prompt what we want to add stock to.
        inquirer
          .prompt([
            {
              name: "id",
              type: "input",
              message: "What is the item_id of the product you would like to order more of?"
            },
            {
              name: "number",
              type: "input",
              message: "How many would you like to add??"
            }
          ]).then(function(answer) {
            var chosenItem;
                //go through the entire query results to see if any item_id's match the answer and set it to its own variable
                for (var i = 0; i < results.length; i++) {
                    if (results[i].item_id === parseInt(answer.id)) {
                        chosenItem = results[i];
                    }
                }
                var newStock = chosenItem.stock_quantity+parseInt(answer.number);
                    connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: newStock
                            },
                            {
                                item_id: chosenItem.item_id
                            }
                        ],
                        function (err) {
                            if (err) throw err;
                            console.log("Successfuly added stock. Below is the updated product table.")
                            console.table(chosenItem)
                            start();
                        }
                    )
          });
});
}

function addNew() {
    //   * If a manager selects `Add New Product`, it should allow the manager to add a completely new product to the store.
    inquirer
    .prompt([
      {
        name: "name",
        type: "input",
        message: "What is the name of the item?"
      },
      {
        name: "department",
        type: "input",
        message: "What department name you would like to place the item in?"
      },
      {
        name: "price",
        type: "input",
        message: "What is the price of the item?",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      },
      {
        name: "quantity",
        type: "input",
        message: "How many of these would you like to add?",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function(answer) {
        //inserts into products table with answers
      connection.query(
        "INSERT INTO products SET ?",
        {
          product_name: answer.name,
          department_name: answer.department,
          price: answer.price,
          stock_quantity: answer.quantity
        },
        function(err, results) {
          if (err) throw err;
          console.log("Item was successfully added.");
          start();
        }
      );
    });
}







