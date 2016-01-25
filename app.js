// Define functions
// Ship constructor
function Ship(size) {
    this.size = size;
    this.hits = 0;
    this.onGrid = new Array();
    this.isSunk = function () {
        return (this.hits >= this.size) ? true : false;
    }
}
// fleet creator
// Can still be trimmed down, but successfully converted to forEach
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
// Holy crap what a mess, this needs cleaning for proper parsing and sanitization
// Scrap in favor of regex for validation and proper parsing? ^([a-jA-J])(\d+)$
function parseInput(coords) {
    var myCoords = coords.split("");
    var newCoords = {};
    newCoords.row = myCoords[0].toUpperCase();
    // this is junky and doesn't really work
    if (typeof newCoords.col != "number") newCoords.col = 0;
    // this is mostly irrelevant since 10 is parsed as 1
    newCoords.col = Math.max(0, Math.min(myCoords[1] - 1, 9));
    return newCoords;
}
// Check hit on grid
// Next on the chopping block to be compressed
function checkHit(row, col) {
    var cell = grid[row][col];
    var success = false;
    if (cell.firedAt) {
        alert('Invalid Location: Already fired at ' + row + col);
        return;
    } else {
        cell.firedAt = true;
        ships.forEach(function (ship) {
            ship.onGrid.forEach(function (coord) {
                if (coord.row === rows.indexOf(row) && coord.col === col) {
                    ship.hits++;
                    if (ship.isSunk()) {
                        alert("You sank my battleship :(");
                    } else success = true;
                }
            });
            cell.text = "hits";
        });
    }
    (success) ? alert("Hit!") : alert("Miss!");
}
// Check victory condition
function checkVictory() {
    var shipsSunk = 0;
    for (var i = 0; i < ships.length; i++) {
        if (ships[i].isSunk()) shipsSunk++;
    }
    return (shipsSunk >= ships.length) ? true : false;
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
    var validateMe = shipCoords.sort(function (a, b) { return b - a })
    console.log(shipCoords);
    // check for duplicates
    validateMe.reduce(function (all, item, index) {
        var nextIndex = index + 1;
        if (item === validateMe[nextIndex]) err = true;
        return all;
    }, 0);
    // constrain to grid
    for (var i in validateMe) {
        if (validateMe[i] > '' + (grid.A.length - 1) + (grid.A.length - 1)) err = true;
    }
    return err;
}
// Hide ships on grid
function hideShips(grid, shipList) {
    // find limits
    var gridSize = grid.A.length;
    // iterate over ships
    shipList.forEach(function (currentShip) {
        var myRow = Math.floor(Math.random() * gridSize);
        var myCol = Math.floor(Math.random() * gridSize);
        // REWRITE with enums for readibility, and probably just reduce to SOUTH and EAST
        var orientation = Math.floor(Math.random() * gridSize) % 2;
        var direction = Math.floor(Math.random() * gridSize) % 2;
        // place initial ship part randomly
        currentShip.onGrid[0] = { row: myRow, col: myCol };
        // place other ship parts until ship is complete
        // THIS NEEDS CLEANUP
        for (var j = 1; j < currentShip.size; j++) {
            if (orientation === 1 && direction === 1) {
                currentShip.onGrid[j] = { row: Math.max(0, Math.min(currentShip.onGrid[0].row - j, gridSize - 1)), col: currentShip.onGrid[0].col };
            } else if (orientation === 1 && direction === 0) {
                currentShip.onGrid[j] = { row: Math.max(0, Math.min(currentShip.onGrid[0].row + j, gridSize - 1)), col: currentShip.onGrid[0].col };
            } else if (orientation === 0 && direction === 1) {
                currentShip.onGrid[j] = { row: currentShip.onGrid[0].row, col: Math.max(0, Math.min(currentShip.onGrid[0].col + j, gridSize - 1)) };
            } else if (orientation === 0 && direction === 0) {
                currentShip.onGrid[j] = { row: currentShip.onGrid[0].row, col: Math.max(0, Math.min(currentShip.onGrid[0].col - j, gridSize - 1)) };
            }
        }
    });
    // Validate
    return validate(shipList);
}
// Draw grid
function drawGrid(id, grid, ships) {
    var flag = false;
    for (var row in grid) {
        $("#" + id).find('tbody').append($('<tr>'));
        grid[row].forEach(function (col) {
            var myCoords = col.name.split("");
            var myRow = rows.indexOf(myCoords[0]);
            var myCol = col.name.match(/(\d+)$/g);;
            ships.forEach(function (ship) {
                ship.onGrid.forEach(function (coord) {
                    if ('' + coord.row + coord.col === '' + myRow + myCol) { flag = true; }
                });
            });
            // Please note that this is simply placeholder to make it functional, will eventually use classes instead of styles
            (flag) ? $("#" + id).find('tbody').append($('<td>').append($('<p>').text(myRow+" "+myCol).attr('style', 'background-color: green;'))) : $("#" + id).find('tbody').append($('<td>').append($('<p>').text(myRow+" "+myCol).attr('style', 'background-color: blue;')));
            flag = false;
        });

    }
}
// Testing var for later
var shipyard = [
    { name: "carrier", size: 5, onGrid: [], hits: 0 },
    { name: "battleship", size: 4, onGrid: [], hits: 0 },
    { name: "destroyer", size: 3, onGrid: [], hits: 0 },
    { name: "submarine", size: 3, onGrid: [], hits: 0 },
    { name: "patrol", size: 2, onGrid: [], hits: 0 }
];
// Program vars
var ships = shipyard;//createShips(20, 5);
// 10x10
var rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
// 26x26
// var rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
var grid = createGrid(rows);
var test = hideShips(grid, ships);
// Game logic
// Attempt to hide ships x times before giving up
var attemptLimit = 100;
var attempts = 0;
do {
    test = hideShips(grid, ships);
    attempts++;
    console.log(test);
} while (attempts < attemptLimit && test);
(test) ? console.log("Unable to successfully hide ships after " + attempts + " attempts.") : console.log("Ships hidden successfully!");
drawGrid("my-grid", grid, ships);