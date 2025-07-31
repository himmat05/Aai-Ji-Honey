// hash.js
const bcrypt = require("bcryptjs");

const password = "0477400169"; // Replace with your desired password

bcrypt.hash(password, 10, (err, hash) => {
  if (err) throw err;
  console.log("Hashed password:", hash);
});
