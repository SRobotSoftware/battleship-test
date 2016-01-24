// Vars
var users = [
    {
        name: "john",
        email: "john@gmail.com",
        password: "supersecret"
    },
    {
        name: "sam",
        email: "sam@gmail.com",
        password: "supersecret"
    }
]

// Super cool map function
var myMap = users.map(function (u) {
    return {
        name: u.name,
        email: u.email
    }
});

// Rewrite without using .map
var myFor = [];
users.forEach(function (u) {
    myFor.push({
        name: u.name,
        email: u.email
    })
});