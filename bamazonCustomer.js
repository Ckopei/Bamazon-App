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
    selectDepartment();
});

function selectDepartment() {
    console.log(figlet.textSync('Bamazon!', {
        font: 'Ghost',
        horizontalLayout: 'default',
        verticalLayout: 'default'
    }));
    inquirer
        .prompt({
            name: "department",
            type: "list",
            message: "What department would you like?",
            choices: ["Acoustics", "Strings", "Parts"]
        })
        .then(function (answer) {
            //use the answer as an argument to fill the SQL query parameters below
            shop(answer.department)
        });
}

function continueShopping() {
    inquirer
        .prompt({
            name: "continue",
            type: "list",
            message: "Would you like to continue shopping?",
            choices: ["Yes", "No"]
        })
        .then(function (answer) {
            switch (answer.continue) {
                case "Yes":
                    console.log("Please shop all you would like.")
                    selectDepartment();
                    break;
                case "No":
                    console.log("Please come look again soon. Our inventory and sales change often!")
                    connection.end();
                default:
                    break;
            }
        });
}

function shop(inquirerDept) {
    //select all only from the department the user chooses
    var query = "SELECT * FROM products WHERE ?";
    connection.query(query, { department_name: inquirerDept }, function (err, results) {
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
                //go through the entire query results to see if any item_id's match the answer and set it to its own variable
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
                            continueShopping();
                        }
                    )
                }
            })
    });
}