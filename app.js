// Define functions
// Ship constructor
function Ship(size) {
    this.size = size;
    this.hits = 0;
    this.onGrid = new Array();
    this.isSunk = function () {
        if (this.hits >= this.size) {
            return true;
        } else {
            return false;
        }
    }
}
// fleet creator
function createShips(totalShips, shipSize) {
    var fleet = new Array();
    for (var i = 0; i < totalShips; i++) {
        var myShip = new Ship(shipSize);
        fleet.push(myShip);
    }
    return fleet;
}
var ships = createShips(5, 3);
// grid creator
function createGrid(rows) {
    var grid = {};
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i]
        grid[row] = [];
        for (var col = 0; col < rows.length; col++) {
            grid[row][col] = { name: row + col };
        }
    }
    return grid;
}
var rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
var grid = createGrid(rows);
// Player turn
function fireMissile() {
    var coords = document.getElementById("user-guess").value;
    var guess = parseInput(coords);
    checkHit(guess.row, guess.col);
}
// Parse user input
function parseInput(coords) {
    var myCoords = coords.split("");
    var newCoords = {};
    newCoords.row = myCoords[0].toUpperCase();
    newCoords.col = myCoords[1] - 1;
    return newCoords;
}
// Check hit on grid
function checkHit(row, col) {
    var cell = grid[row][col];
    if (cell.firedAt) {
        alert('Invalid Location: Already fired at ' + row + col);
        return;
    } else {
        cell.firedAt = true;
        cell.ship.hits++;
        cell.text = "hits";
        if (cell.ship.isSunk()) {
            alert("You sank my battleship :(");
        }
    }
}
// Check victory condition
function checkVictory() {
    var shipsSunk = 0;
    for (var i = 0; i < ships.length; i++) {
        if (ships[i].isSunk()) shipsSunk++;
    }
    return (shipsSunk >= ships.length);
}

// TEST HERE
// var shipyard = [
//     { name: "carrier", size: 5, onGrid: [], hits: 0 },
//     { name: "battleship", size: 4, onGrid: [], hits: 0 },
//     { name: "destroyer", size: 3, onGrid: [], hits: 0 },
//     { name: "submarine", size: 3, onGrid: [], hits: 0 },
//     { name: "patrol", size: 2, onGrid: [], hits: 0 }
// ];

// Function to be tested
function hideShips(grid, shipList) {
    // init err flag
    var err;
    // find limits
    var gridSize = grid.A.length;
    var totalShips = shipList.length;
    // iterate over ships
    for (var i = 0; i < totalShips; i++) {
        // define current ship
        var currentShip = shipList[i];
        var myRow = Math.floor(Math.random() * gridSize);
        var myCol = Math.floor(Math.random() * gridSize);
        var orientation = myRow % 2;
        var direction = myCol % 2;
        // place initial part randomly
        currentShip.onGrid[0] = { row: myRow, col: myCol };
        // Check if position is already taken
        // loop through each ship's onGrid looking for the row and col
        
        // place other parts until done with ship
        // CURRENTLY DOES NOT CHECK VALID PLACEMENT
        for (var j = 1; j < currentShip.size; j++) {
            if (orientation===1 && direction===1) {
                currentShip.onGrid[j] = {row: currentShip.onGrid[0].row-j, col: currentShip.onGrid[0].col};
            } else if (orientation===1 && direction===0) {
                currentShip.onGrid[j] = {row: currentShip.onGrid[0].row+j, col: currentShip.onGrid[0].col};
            } else if (orientation===0 && direction===1) {
                currentShip.onGrid[j] = {row: currentShip.onGrid[0].row, col: currentShip.onGrid[0].col+j};
            } else if (orientation===0 && direction===0) {
                currentShip.onGrid[j] = {row: currentShip.onGrid[0].row, col: currentShip.onGrid[0].col-j};
            }
        }
    }
    // return
    if (err) return false; else return true;
}

hideShips(grid, ships);