const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let userswithsamename = users.filter((user)=>{
        return user.username === username
      });
      if(userswithsamename.length > 0){
        return false;
      } else {
        return true;
      }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
      });
      if(validusers.length > 0){
        return true;
      } else {
        return false;
      }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    console.log(users);
  
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
  
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
  
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// regd_users.use("/auth", function auth(req,res,next){
//     console.log('in authentication');
//     if(req.session.authorization) {
//         token = req.session.authorization['accessToken'];
//         jwt.verify(token, "access",(err,user)=>{
//             if(!err){
//                 req.user = user;
//                 next();
//             }
//             else{
//                 return res.status(403).json({message: "User not authenticated"})
//             }
//          });
//      } else {
//          return res.status(403).json({message: "User not logged in"})
//      }
//  });

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const rvw = req.body.review;
    const user = req.user.iat;
    const isbn = req.params.isbn;
    let book = books[Number(isbn)];
    if (book){
        book['reviews'][user] = rvw;
        res.send("Successfully posted review");
        console.log(book['reviews']);
    }
    else{
        res.send("Unable to find ISBN")
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const user = req.user.iat;
    const isbn = req.params.isbn;
    let book = books[Number(isbn)];
    if (book){
        delete book['reviews'][user];
        res.send("Successfully deleted review");
        console.log(book['reviews']);
    }
    else{
        res.send("Unable to find ISBN")
    }
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
