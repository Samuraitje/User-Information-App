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

//Part 0 route 1: renders a page that displays all the users.
//The http method get will request the users page with the corresponding render response of 'users' and the parsed data.
//From the core module fs the readFile function is used to read the file, after the file is read, a callback function will be invoked to handle the error and parsing the JSON file.
//The userData will be parsed by JSON.parse(userData) and stored in the Let parsedData.

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


//Part 1 route 2: renders a page that displays a form which is your search bar.
//The http method get will request the search page with the corresponding render response of 'search' and the searchresult array from the http post method. 
app.get('/search', (req, res) => {
	res.render('search', {
		title: 'Search Bar',
		searchResult: []
	});
});

//Part 1 route 2: takes in the post request from a form and displays the matching users on a new page. Matching the firstname and lastname.
//This http post method will gather a submission from the user and search through the allusers json file to receive the desired result.
//It includes a similar callback function as route 1 that handles errors and parsing the userData.
//The JSON file is filterd by using a forEach function and if statement that compares the first name and last name with the search input.
//The search input is requested by using the req.body.search that is enabled by the module body-parser.
//The matched results will be stored in the array searchResult.
//Finally the page search will be rendert will the searchResult object.
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


//Part 2 route 4: renders a page with a form with three inputs on it (firstname, lastname and email) that allows you to add new users to the allusers.json file.
//The http method get renders route to the adduser page. That has a form with the 3 input bars.
app.get('/adduser', (req, res) => {
	res.render('adduser', {
		title: 'Add User'
	});
});

//Part 2 route 5: takes in the post request from the 'create user' form, then adds the user to the allusers.josn file. And redirects the user to the route that displays all the users.
//The http method post will gather all the user inputs from the adduser form to the let userFile.
//First the JSON file is read by the function readFile and afterwards new inputs for creating a new user will be pushed to the let userFile.
//Subsequently, the writeFile function is used to write that file to the allusers json file and also needs changed back to a json string by JSON.stringify.
//Finally, the user will be redirected to the users page.
app.post('/adduser', (req, res) => {
	fs.readFile("allusers.json", (err, userData) => {
		if (err) {
			console.log('File not found!')
		}
		let userFile = JSON.parse(userData);
  	userFile.push({ firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email }); 
  	fs.writeFile("allusers.json", JSON.stringify(userFile), function(err){
    	if (err) throw err;
    	console.log('The "data to append" was appended to file!');
    	res.redirect('/users');
	   	});
	});
});

//Initiated a local server on port 3000
app.listen(1000, () => {
    console.log('listening');
});
