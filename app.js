// Define functions
// Ship constructor
function Ship(size) {
    this.size = size;
    this.hits = 0;
    this.onGrid = new Array();
    this.isSunk = function () {
        if (this.hits >= this.size) return true; else return false;
    }
}
// fleet creator | Can still be trimmed down, but successfully converted to forEach
function createShips(totalShips, shipSize) {
    var ships = new Array(totalShips).fill();
    ships.forEach(function (s) {
        ships.push(new Ship(shipSize));
        ships.shift();
    });
    return ships;
}
// grid creator
function createGrid(rows) {
    var grid = rows.reduce(function (all, row, index) {
        all[row] = rows.reduce(function (all, col, index) {
            all.push({ name: row + index, firedAt: false });
            return all;
        }, []);
        return all;
    }, {});
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
// Next on the chopping block to be compressed
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
// validate ship placement
function validate(ships) {
    var err = false;
    // Consolidate ship coordinates to single arr
    var shipCoords = ships.reduce(function (all, item, index) {
        all.push.apply(all, item.onGrid.reduce(function (all, item, index) {
            all.push('' + item.row + item.col);
            return all;
        }, []));
        return all;
    }, []);
    // Prep arr for validation
    var validate = shipCoords.sort(function (a, b) { return b - a })
    // check for duplicates
    validate.reduce(function (all, item, index) {
        var nextIndex = index + 1;
        if (item === validate[nextIndex]) err = true;
        return all;
    }, 0);
    // constrain to grid
    if (validate[validate.length - 1] < 0) err = true;
    for (var i in validate) {
        if (validate[i].length > 2) err = true;
    }
    return err;
}
// Hide ships on grid
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
        // Run validatoin
        err = validate(shipList);
    }
    // return
    if (err) return false; else return true;
}
// Testing var for later
// var shipyard = [
//     { name: "carrier", size: 5, onGrid: [], hits: 0 },
//     { name: "battleship", size: 4, onGrid: [], hits: 0 },
//     { name: "destroyer", size: 3, onGrid: [], hits: 0 },
//     { name: "submarine", size: 3, onGrid: [], hits: 0 },
//     { name: "patrol", size: 2, onGrid: [], hits: 0 }
// ];
// Program vars
var ships = createShips(5, 3);
var rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
var grid = createGrid(rows);
var test = hideShips(grid, ships);
// Game logic
// Attempt to hide ships x times before giving up
var x = 10;
for (var n = 0; n < x; n++) {
    test = hideShips(grid, ships);
    if (test) break;
}
if (test === false) console.log("Unable to successfully hide ships."); else console.log("Ships hidden successfully!");