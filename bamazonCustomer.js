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
connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    selectDepartment();
});

//first display all items in the database. id, name, prices, stock. W6D4, line 95-119
function selectDepartment() {
    inquirer
        .prompt({
            name: "department",
            type: "list",
            message: "What department would you like?",
            choices: ["Acoustics", "Strings", "Parts"]
        })
        .then(function (answer) {
            switch (answer.department) {
                case "Acoustics":
                    acoustics();
                    break;
                case "Strings":
                    strings();
                    break;
                case "Parts":
                    parts();
                    break;
                default:
                    break;
            }
        });
}
//inquirer prompt "what would you like to buy"
//inquirer prompt "how many, etc"
function acoustics() {
    var query = "SELECT * FROM products WHERE ?";
    connection.query(query, { department_name: "Acoustics" }, function (err, results) {
        if (err) throw err;
        console.table(results)
        inquirer
            .prompt([
                {
                    name: "id",
                    type: "input",
                    message: "What is the item_id of the product you would like to purchase?"
                },
                {
                    name: "number",
                    type: "input",
                    message: "How many would you like to buy?"
                }
            ]).then(function (answer) {
                var chosenItem;
                for (var i = 0; i < results.length; i++) {
                    if (results[i].item_id === parseInt(answer.id)) {
                        chosenItem = results[i];
                    }
                }
                //Check if the number they input is greater than the stock available.
                if (chosenItem.stock_quantity < parseInt(answer.number)) {
                    console.log("Insufficient quantity to fulfil order. Please try again!");
                    acoustics();
                }
                //If stock is available, do math and set new quantity in the DB. Show customer how much they spent.
                else {
                    var newStock = chosenItem.stock_quantity-parseInt(answer.number);
                    var spent = chosenItem.price * parseInt(answer.number)
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
                            console.log("Products bought successfully! You spent: $" + spent)
                            selectDepartment();
                        }
                    )
                }
            })
    });
}

//check if database stock_quantity against customer answer W6D4 Line 120-155

//if yes, update database with new number of stock. Show the customer the price of the order.

//if no, log "Insufficient Quantity!", and call the function to start over.
