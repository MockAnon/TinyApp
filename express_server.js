var express = require("express");
var app = express();
var PORT = 8080; // default port 8080
var cookieParser = require('cookie-parser')
app.use(cookieParser())

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));


function generateRandomString() {
  var generate = Math.random().toString(36).substr(2,6);
  return generate;
}

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


app.post("/login", (req, res) => {
  res.cookie('username', req.body.username); //task 5 add cookie username [, domain]


  res.redirect("/urls");



});




app.post("/urls/:id/change", (req, res) => {  //part 3 change url
  console.log(urlDatabase[req.params.id]);
  // urlDatabase[req.params.id] = 'http://www.youtube.com';
  urlDatabase[req.params.id] = req.body.changeURL;
  // req.params.changeURL

  console.log("change this to:", urlDatabase[req.params.id])
  res.redirect("/urls");
});


app.post("/urls/:id/delete", (req, res) => {  //part 3 delete
  console.log(urlDatabase[req.params.id]);
  delete urlDatabase[req.params.id];

  console.log("this worked!!!!!")
  res.redirect("/urls");
});



app.get("/logout", (req, res) => {
  // res.clearCookie(username);

  console.log(req.cookies["username"]);
  res.clearCookie("username");
  res.redirect("/");

});

app.get("/", (req, res) => {
  console.log(req.cookies)
  let templateVars = { username: req.cookies["username"] };
  res.render("urls_new", templateVars);
});

app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    username: req.cookies["username"]
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id, longURL:urlDatabase[req.params.id], urls: urlDatabase,
  username: req.cookies["username"] };
  res.render("urls_show", templateVars);
});

app.get("/urls/new", (req, res) => {
  let templateVars = { username: req.cookies["username"] };
  res.render("urls_new", templateVars);
});




app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL); //part 2 ---this is what redirects people to submitted webpage.
});
// app.get("/urls/new", (req, res) => {
//   res.render("urls_new");
// });



app.post("/urls", (req, res) => {
  console.log(req.body);  // debug statement to see POST parameters
  // res.send("Ok");
  let shortendURL = generateRandomString();
  urlDatabase[shortendURL] = req.body.longURL;
  res.redirect(`http://localhost:8080/urls`);

});



app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

  //index
app.get('/', function(req, res) {
    var urls = [
        { name: 'Bloody Mary', drunkness: 3 },
        { name: 'Martini', drunkness: 5 },
        { name: 'Scotch', drunkness: 10 }
    ];

});

