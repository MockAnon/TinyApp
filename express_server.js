var express = require("express");
var app = express();
var PORT = 8080; // default port 8080

const bcrypt = require('bcrypt');
//________________Enc__________________

var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = '12345';

function encrypt(text){
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}

function decrypt(text){
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}
//______________New Cookie API______________________
var cookieSession = require('cookie-session')
var express = require('express')

var app = express()

app.set('trust proxy', 1) // trust first proxy

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))

app.use(function (req, res, next) {
  req.sessionOptions.maxAge = req.session.maxAge || req.sessionOptions.maxAge
  next()
})
//______________________________________________

app.set("view engine", "ejs");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const users = {   //adding in user database
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "batman@example.com",
    password: "batman"
  },
 "user3RandomID": {
    id: "12345",
    email: "12345@example.com",
    password: "12345"
  }
};

app.post("/register", (req, res) => {
  if(!req.body.email || !req.body.password){
    res.status(400);
    res.send('Error 400: please enter both your e-mail and password');
  }
  for(user in users){
    if(users[user].email === req.body.email){
      res.status(400);
      res.send('Email already taken, please choose another');
    }
    if(req.body.email && req.body.password){
      let userid = generateRandomString();
      users[userid] = {id: userid, email: req.body.email, password: bcrypt.hashSync(req.body.password, 10)};
      req.session.userid = userid;
      res.redirect("/urls");
    }
  }
});

app.get("/register", (req, res) => {
  let shortendURL = generateRandomString();
  urlDatabase[shortendURL] = req.body.longURL;
  let templateVars = { shortURL: req.params.id, longURL:urlDatabase, urls: urlDatabase,
  userid: req.session.userid,
  };
  res.render("urls_register", templateVars);
});

function generateRandomString() {
  var generate = Math.random().toString(36).substr(2,6);
  return generate;
}

var urlDatabase = {
  "user2RandomID": {
      "b2xVn2": "http://www.lighthouselabs.ca",
      "9sm5xK": "http://www.google.com"
  },
  "user3RandomID": {
      "b7777b": "http://www.facebook.com",
      "9ssssK": "http://www.youtube.com"
  }
}

function urlsForUser(userId) {
  let urlArray = [];
  let urlIds = Object.keys(urlDatabase[userId]);
  urlIds.forEach((urlId) => {
    urlArray.push(urlDatabase[userId][urlId]);
  })
  return urlArray;
}

//____________________________________________LOGIN__________________

app.post("/login", (req, res) => {
let commit = false;
for(user in users){
  if(users[user].email === req.body.email && bcrypt.compareSync(req.body.password, users[user].password) === true){
    req.session.userid = user;
    res.redirect("/");
    commit = true;
  }
}
  if(commit === false){
      res.status(403);
    res.send('403 either e-mail does not exist or password is incorrect. Please try again.');
  }
});

app.get("/login", (req, res) => {
  let templateVars = {
   userid: req.session.userid
  };
  res.render("urls_login", templateVars);
});
//______________________________________________________________________


app.post("/urls/:id/change", (req, res) => {
  if(!req.session.userid){
    console.log("Wrong Id");
  }else{
    urlDatabase[req.session.userid][req.params.id] = req.body.changeURL;
  }
  res.redirect("/urls");
});

app.post("/urls/:id/delete", (req, res) => {
  if(![req.session.userid]){
    console.log("Wrong Id")
  } else{
    delete urlDatabase[req.session.userid][req.params.id];
  }
  res.redirect("/urls");
  // location.href = "/urls"; // <---example
});

//__________________________________________________

app.get("/logout", (req, res) => {
  req.session = null;
  res.redirect("/");
});

app.get("/", (req, res) => {
  console.log(req.session)
  let templateVars = {
  userid: req.session["userid"]
  };
  if(!req.session.userid){
    res.redirect("/login")
  }
  res.render("urls_new", templateVars);
});

/////////////______________________________________urls page
app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlDatabase[req.session.userid],
    userid: req.session.userid
  };
  console.log(">>>>>>", urlDatabase[req.session.userid])
    if(!req.session["userid"]){
    res.redirect("/login")
  }
  res.render("urls_index", templateVars);
});

app.get("/urls/:id", (req, res) => {
    if(!req.session.userid){
    res.send("You are not logged in. Please log in and try again. If you do not have an account, please register. Thank you.");
    res.redirect("/login");
  }
  let templateVars = { shortURL: req.params.id, longURL: urlDatabase[req.session.userid]["shortendURL"], urls: urlDatabase,
  userid: req.session.userid
  };
  res.render("urls_show", templateVars);
});

app.get("/urls/new", (req, res) => {
  let templateVars = {
  userid: req.session.userid
  };
  res.render("urls_new", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  let shortendURL = req.params.shortURL;
  let longURL = urlDatabase[req.session.userid][shortendURL];
  res.redirect(longURL);
});

app.post("/urls", (req, res) => {
  console.log(req.body);
  let shortendURL = generateRandomString();
  if(!urlDatabase[req.session.userid]){
    urlDatabase[req.session.userid] = {}
    urlDatabase[req.session.userid][shortendURL] = req.body.longURL;
  } else {
    urlDatabase[req.session.userid][shortendURL] = req.body.longURL;
  }
  res.redirect(`http://localhost:8080/urls`);
});

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get('/', function(req, res) {
    var urls = [
        { name: 'Bloody Mary', drunkness: 3 },
        { name: 'Martini', drunkness: 5 },
        { name: 'Scotch', drunkness: 10 }
    ];

});

