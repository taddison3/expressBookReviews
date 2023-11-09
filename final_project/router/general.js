const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    let username = req.body.username;
    let password = req.body.password;
    console.log(req.body);
  
    if (username && password) {
      if (isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    let promise = new Promise((resolve, reject) => {
        resolve(JSON.stringify(books,null,4));
    });
    promise.then((booklist) => {res.send(booklist) 
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  let promise = new Promise((resolve, reject) => {
    let book = books[Number(isbn)];
    if (book){
        resolve(book);
    }
    else{
        resolve("Unable to find ISBN")
    }
    });
    promise.then((msg) => {res.send(msg) 
    });

 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    let auth = author.replaceAll('_',' ').toLowerCase();
    let promise = new Promise((resolve, reject) => {
        let keys = Object.keys(books);
        let match = "";
        keys.forEach(function(key){
            if (books[key]['author'] === auth){
                match = key;
            }
        })
        if (match){
            resolve(books[match]);
        }
        else{
            resolve("Unable to find Author")
        }
    });
    promise.then((msg) => {res.send(msg) 
    });

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title.replaceAll('_',' ').toLowerCase();
    let promise = new Promise((resolve, reject) => {
        let keys = Object.keys(books);
        let match = "";
        keys.forEach(function(key){
            if (books[key]['title'].toLowerCase() === title){
                match = key;
            }
        })
        if (match){
            resolve(books[match]);
        }
        else{
            resolve("Unable to find Title")
        }
    });
    promise.then((msg) => {res.send(msg) 
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    let book = books[Number(isbn)];
    if (book){
        res.send(book['reviews']);
    }
    else{
        res.send("Unable to find ISBN")
    }
});

module.exports.general = public_users;
