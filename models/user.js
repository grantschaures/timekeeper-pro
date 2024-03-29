const db = require("../db");

// User model from the schema
const User = db.model("User", {
  email:    { type: String, required: true },
  password: { type: String, required: false },
  // Adding temporary secure token and its expiration
  token: { type: String, required: false },
  tokenExpire: { type: Date, required: false },
  emailVerified: { type: Boolean, required: true}
}, 'Users');

module.exports = User;

 /**
  * FIND A WAY TO GENERATE A SECURE SECURITY TOKEN TO ATTACH TO THE END OF THE URL SENT TO THE USER TO SET THEIR PASSWORD
  * SO THAT THEY CAN BE SECURELY LINKED TO A URL WHERE THEY SET THEIR PASSWORD AND A NEW DATABASE USER ENTRY IS MADE FOR THEM.
  * 
  * NEXT WHEN THEY ENTER THEIR LOGIN INFORMATION AFTER BEING ROUTED TO THE LOGIN PAGE, CHECK THE USER ENTRY AGAINST ALL OTHER
  * ENTRIES IN THE MONGODB USERS COLLECTION WITHIN THE HYPERCHILLDATABASE AND IF THEY HAVE AN ENTRY IN THE DATABASE, LOG THEM
  * IN.
  */
  