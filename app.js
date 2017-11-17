const express = require("express");
const app = express();
const fs = require('fs');
const bodyParser = require("body-parser");
app.use(express.static('public'));
app.use(bodyParser.urlencoded());
app.set('view engine', 'pug');

//Home page route
app.get('/', (req, res) => {
	res.render('index', {
		title: 'Home'
	}); 
});

app.get('/users', (req, res) => {
		fs.readFile("allusers.json", (err, userData) => {
			if (err) {
				console.log('File not found!')
			}
			let parsedData = JSON.parse(userData);
			data = parsedData;
		res.render('users', {
			title: 'Users',
			data: data
		});
	});
});		

app.get('/search', (req, res) => {
	res.render('search', {
		title: 'Search Bar',
		searchResult: []
	});
});

app.post('/search', (req, res) => {
	fs.readFile("allusers.json", (err, userData) => {
		if (err) {
			console.log('File not found!')
		}
		let parsedData = JSON.parse(userData);
		let searchResult = []
		parsedData.forEach(function(user){
			if (user.firstname.toLowerCase() === req.body.search.toLowerCase() || user.lastname.toLowerCase() === req.body.search.toLowerCase()) {
				searchResult.push(user);
			}
		});
		res.render('search', {
		title: 'results',
		searchResult: searchResult
	});
	});
});

app.get('/adduser', (req, res) => {
	res.render('adduser', {
		title: 'Add User'
	});
});

app.post('/adduser', (req, res) => {
	fs.readFile("allusers.json", (err, userData) => {
		if (err) {
			console.log('File not found!')
		}
		var userFile = JSON.parse(userData);
  	userFile.push({ firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email }); 
  	fs.writeFile("allusers.json", JSON.stringify(userFile), function(err){
    	if (err) throw err;
    	console.log('The "data to append" was appended to file!');
    	res.redirect('/users');
	   	});
	});
});

//Initiated a local server on port 3000
app.listen(5000, () => {
    console.log('listening');
});
