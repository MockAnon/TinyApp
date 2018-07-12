var express = require("express");
var app = express();
var PORT = 8080; // default port 8080
var cookieParser = require('cookie-parser')
app.use(cookieParser())

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
    email: "user2@example.com",
    password: "dishwasher-funk"
  },
 "user3RandomID": {
    id: "12345",
    email: "12345@example.com",
    password: "12345"
  }
};

app.post("/register", (req, res) => {
    let templateVars = { shortURL: req.params.id, longURL:urlDatabase[req.params.id], urls: urlDatabase,

  userid: req.cookies["userid"] };

  if(!req.body.email || !req.body.password){
    res.status(400);
    res.send('Error 400: please enter both your e-mail and password');
  }
for(user in users){
  if(users[user].email === req.body.email){
    res.status(400);
    res.send('Email already taken, please choose another');
  }
}

  let userid = generateRandomString();
  users[userid] = {id: userid, email: req.body.email, password: req.body.password};
  res.cookie('userid', user);
  res.redirect("/urls");

});

app.get("/register", (req, res) => {

  // let shortendURL = generateRandomString();
  // urlDatabase[shortendURL] = req.body.longURL;
  let templateVars = { shortURL: req.params.id, longURL:urlDatabase[req.params.id], urls: urlDatabase,

  userid: req.cookies["userid"],
  };

  res.render("urls_register", templateVars);
});





function generateRandomString() {
  var generate = Math.random().toString(36).substr(2,6);
  return generate;
}

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//____________________________________________LOGIN__________________

app.post("/login", (req, res) => {



  console.log(req.body.email);
  console.log(req.body.password);


let commit = false;
for(user in users){
  if(users[user].email === req.body.email && users[user].password === req.body.password){

    res.cookie('userid', user);
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

  userid: req.cookies["userid"]

  };
  res.render("urls_login", templateVars);
});
//______________________________________________________________________


app.post("/urls/:id/change", (req, res) => {  //part 3 change url
  console.log(urlDatabase[req.params.id]);
  urlDatabase[req.params.id] = req.body.changeURL;
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
  console.log(req.cookies["userid"]);
  res.clearCookie("userid");
  res.redirect("/");

});

app.get("/", (req, res) => {
  console.log(req.cookies)
  let templateVars = {
  userid: req.cookies["userid"]
  };
  res.render("urls_new", templateVars);
});

app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    userid: req.cookies["userid"]
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id, longURL:urlDatabase[req.params.id], urls: urlDatabase,
  userid: req.cookies["userid"]
  };
  res.render("urls_show", templateVars);
});

app.get("/urls/new", (req, res) => {
  let templateVars = {
  userid: req.cookies["userid"]
  };
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

