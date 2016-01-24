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
// grid creator
function createGrid(rows) {
    var grid = {};
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i]
        grid[row] = [];
        for (var col = 0; col < rows.length; col++) {
            grid[row][col] = { name: row + col, firedAt: false };
        }
    }
    return grid;
}
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
    debugger;
    var cell = grid[row][col];
    if (cell.firedAt) {
        alert('Invalid Location: Already fired at ' + row + col);
        return;
    } else {
        cell.firedAt = true;
        for (var i = 0; i < ships.length; i++) {
            for (var j = 0; j < ships[i].onGrid.length; j++) {
                if (ships[i].onGrid[j][row][col]) {
                    ships[i].hits++;
                    if (ships[i].isSunk()) {
                        alert("You sank my battleship :(");
                    }
                }
            }
        }
        cell.text = "hits";
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


// Function to be tested
function hideShips(grid, shipList) {
    // init err flag
    var err = false;
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
        // place other parts until done with ship
        for (var j = 1; j < currentShip.size; j++) {
            if (orientation === 1 && direction === 1) {
                currentShip.onGrid[j] = { row: currentShip.onGrid[0].row - j, col: currentShip.onGrid[0].col };
            } else if (orientation === 1 && direction === 0) {
                currentShip.onGrid[j] = { row: currentShip.onGrid[0].row + j, col: currentShip.onGrid[0].col };
            } else if (orientation === 0 && direction === 1) {
                currentShip.onGrid[j] = { row: currentShip.onGrid[0].row, col: currentShip.onGrid[0].col + j };
            } else if (orientation === 0 && direction === 0) {
                currentShip.onGrid[j] = { row: currentShip.onGrid[0].row, col: currentShip.onGrid[0].col - j };
            }
        }
        // VALIDATION
        // loop through each ship's onGrid looking for the row and col
        for (var k = 0; k < totalShips; k++) {
            for (var l = 0; l < shipList[k].onGrid.length; l++) {
                for (var m = 0; m < currentShip.onGrid.length; m++) {
                    // Error on this line because it sees itself as a match
                    if (shipList[i] !== shipList[k]) if (currentShip.onGrid[m].row === shipList[k].onGrid[l].row && currentShip.onGrid[m].col === shipList[k].onGrid[l].col) { err = true; console.log(currentShip.onGrid[m].row + " " + currentShip.onGrid[m].col + " matches another ship's coords at " + shipList[k].onGrid[l].row + " " + shipList[k].onGrid[l].col); }
                    if (currentShip.onGrid[m].col > grid.A.length) { err = true; console.log(currentShip.onGrid[m].col + " col exceeds grid length"); }
                    if (currentShip.onGrid[m].row > grid.A.length) { err = true; console.log(currentShip.onGrid[m].row + " row exceeds grid length"); }
                    if (currentShip.onGrid[m].col < 0) { err = true; console.log(currentShip.onGrid[m].col + " col not on grid"); }
                    if (currentShip.onGrid[m].row < 0) { err = true; console.log(currentShip.onGrid[m].row + " row not on grid"); }
                }
            }
        }
    }
    // return
    if (err) return false; else return true;
}
// var shipyard = [
    
//     { name: "carrier", size: 5, onGrid: [], hits: 0 },
//     { name: "battleship", size: 4, onGrid: [], hits: 0 },
//     { name: "destroyer", size: 3, onGrid: [], hits: 0 },
//     { name: "submarine", size: 3, onGrid: [], hits: 0 },
//     { name: "patrol", size: 2, onGrid: [], hits: 0 }
// ];

var ships = createShips(5, 3);
var rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
var grid = createGrid(rows);
var test = hideShips(grid, ships);
for (var n = 0; n < 10; n++) {
    test = hideShips(grid, ships);
    console.log(test);
    if (test) break;
}
if (test === false) console.log("Unable to successfully hide ships."); else console.log("Ships hidden successfully!");
console.log(ships);