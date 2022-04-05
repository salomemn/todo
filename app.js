//DECLARATION VARIABLES
const TodoTask = require("./models/TodoTask");
const express = require("express");
const app = express();
var passport = require("passport"),
	bodyParser = require("body-parser"),
	LocalStrategy = require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose"),
	User = require("./models/user");

//CONNEXION AVEC MONGOOSE
const mongoose = require("mongoose");
const mongoString = "mongodb+srv://salome:Poussy2001@cluster0.jzruj.mongodb.net/todo?retryWrites=true&w=majority";
mongoose.connect(mongoString,{ useNewUrlParser: true })
mongoose.connection.on("error", function(error){
    console.log(error)
})
mongoose.connection.on("open", function(){
    console.log("Connected to MongoDB database.")

}) 


app.use("/static",express.static("public"));		//requête enoyée au serveur
app.set("view engine","ejs");						//attribue le nom du paramètre à la valeur
app.use(express.urlencoded({ extended: true }));	//analyse les requests entrantes avec des charges utiles codées urlen et est basé sur un analyseur de corps




//TODOAPP
// GET METHOD
app.get("/todo", (req, res) => {
    TodoTask.find({}, (err, tasks) => {
    res.render("todo.ejs", { todoTask: tasks });
    });
    });

  //POST METHOD
  app.post('/todo',async (req, res) => {
    const todoTask = new TodoTask({
    content: req.body.content
    });
    try {
    await todoTask.save();
    res.redirect("/todo");
    } catch (err) {
    res.redirect("/todo");
    }
    });


// UPDATE
app
.route("/edit/:id")
.get((req, res) => {
const id = req.params.id;
TodoTask.find({}, (err, tasks) => {
res.render("todoEdit.ejs", { todoTask: tasks, idTask: id });
});
})
.post((req, res) => {
const id = req.params.id;
TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
if (err) return res.send(500, err);
res.redirect("/todo");
});
});
    

//DELETE
app.route("/remove/:id").get((req, res) => {
const id = req.params.id;
 TodoTask.findByIdAndRemove(id, err => {
if (err) return res.send(500, err);
res.redirect("/todo");
 });
});



//CONNEXION UTILISATEUR
app.use(require("express-session")({
	secret: "Rusty is a dog",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//PAGE ACCUEIL
app.get("/", function (req, res) {
	res.render("home.ejs");
});


//PADE D'AFFICHAGE DES TACHES
app.get("/afficher", (req, res) => {
    TodoTask.find({}, (err, tasks) => {
    res.render("afficher.ejs", { todoTask: tasks });
    });
    });


//PAGE D'ERREUR SI L'EMAIL ENTRE EST DEJA DANS LA BASE DE DONNEES
app.get("/registerfail", function (req, res) {
	res.render("registerfail.ejs");
});


//PAGE D'ERREUR SI LEMOT DE PASSE EST FAUX
app.get("/loginfail", function (req, res) {
	res.render("loginfail.ejs");
});
app.post("/loginfail", passport.authenticate("local", {
	successRedirect: "/todo",
	failureRedirect: "/loginfail"
}), function (req, res) {
});


//PADE D'INSCRIPTION
app.get("/register", function (req, res) {
	res.render("register.ejs");
});
app.post("/register", function (req, res) {
	var username = req.body.username
	var password = req.body.password
	User.register(new User({ username: username }),
			password, function (err, user) {
		if (err) {
			console.log(err);
			return res.render("registerfail.ejs");
		
		}

		passport.authenticate("local")(
            req, res, function () {
			TodoTask.find({}, (err, tasks) => {
            res.render("todo", {todoTask: tasks});});
        });
	});
});



//PAGE DE CONNEXION
app.get("/login", function (req, res) {
	res.render("login.ejs");
});
app.post("/login", passport.authenticate("local", {
	successRedirect: "/todo",
	failureRedirect: "/loginfail"
}), function (req, res) {
});


//DECONNEXION
app.get("/logout", function (req, res) {
	req.logout();
	res.redirect("/");
});


//FONCTION POUR VERIFIER SI L'UTILISATEUR EST CONNECTE
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) return next();
	res.redirect("/login");
}


//LIE ET ECOUTE LES CONNEXIONS SUR L'HOTE ET LE PORT SPECIFIES
app.listen(3000,() => {console.log("Server Up and running")})


//TODO LISTE EN LIGNE DE COMMANDE
