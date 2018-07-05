var bcrypt = require('bcrypt-nodejs');

var hash = bcrypt.hashSync("1111", null, null)
console.log("HASH: ", hash)
var valid = bcrypt.compareSync("1111", "$2a$10$l9yz67qp8fqxEZGsaOeD3u2qg9Yh7aUvjUJbFX")
console.log("VALID", valid);
