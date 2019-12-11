//We need these to access the feather within node and able to use it in our server.js
var express = require("express");
var path = require("path");
var fs = require("fs");

//Following heroku guide format using port 3000 since we are going to deploy it to heroku
var app = express();
var PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing, using static feature part of express to show files within public directory
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Need line 14 for the server to read static files within public directory
app.use(express.static(__dirname + '/public'));


//need to follow this format for post
// // Required routes, same format as in class star war activity 14
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "public/notes.html"));
});
// Trying to access the directory like the previous two but doesn't work due to express.static feature, so trying something else
app.get("/api/notes", function (req, res) {
    return res.sendFile(path.join(__dirname, '/db/', 'db.json'));
});

// app.post("/api/characters", function(req, res) {
//     // req.body hosts is equal to the JSON post sent from the user
//     // This works because of our body parsing middleware
//     var newCharacter = req.body;
  
//     // Using a RegEx Pattern to remove spaces from newCharacter
//     // You can read more about RegEx Patterns later https://www.regexbuddy.com/regex.html
//     newCharacter.routeName = newCharacter.name.replace(/\s+/g, "").toLowerCase();
  
//     console.log(newCharacter);
  
//     characters.push(newCharacter);
  
//     res.json(newCharacter);
//   });
  
//   // Starts the server to begin listening
//   // =============================================================
//   app.listen(PORT, function() {
//     console.log("App listening on PORT " + PORT);
//   });
app.post("/api/notes", function (req, res) {
    //user input will be saved to db.json through index.js so we need to read it so we can edited it later on
    var userNote = JSON.parse(fs.readFileSync(path.resolve(__dirname, "db/db.json"), "utf8"));
    var newUserNote = req.body;
    // consist of user notes saved in db.json
    
    // this line removes spaces from newUserNote.id and turn all user input into lovercase
    newUserNote.id = newUserNote.title.replace(/\s+/g, "").toLowerCase();
    // consists of new note user just added, in db.json format
    console.log(newUserNote);
    // if user doesnt type anything, then add that to the empty array showing nothing else add whatever they type to userNote
    userNote.push(newUserNote); 
    
    
    let file = path.join(__dirname, 'db', "/db.json");
   
    // if user type something and assume they click save button, then index.js is programmed to save it to our db.json as JSON, so we need to stringify that since writeFileSync funtion only take in string, then we can re-save those new note to our db.json
    var addNewNotes = JSON.stringify(userNote)

     // we write notes to file, which is db.json
    fs.writeFileSync(file, addNewNotes);
    //have to re-send file so we have it in db.json
    res.sendFile(path.join(__dirname, '/db/', 'db.json'));
});

//follow this format for delete part of the application
// Routes
// =============================================================

// Basic route that sends the user first to the AJAX Page
// app.get("/", function(req, res) {
//   // res.send("Welcome to the Star Wars Page!")
//   //after sendFile, "view.html" is getting latched onto __dirname
//   //Why absolute path? because when we post our file, we know where it is within our local directory, but when we post it online, the absolute __dirname is what allows the online server to know where to find "view.html"
//   //sendFile will ALWAYSS send HTML file
//   res.sendFile(path.join(__dirname, "view.html"));
// });

// // Displays all characters
// app.get("/api/characters", function(req, res) {
//   return res.json(characters);
// });

// // Displays a single character, or returns false
// //Difference between sendFile and json is that sendFile will only send html to the client (something that user wil see). Whereas json gets the data and do some stuff and send back users usually data (so most of these stuff users will not see)
// app.get("/api/characters/:character", function(req, res) {
//   var chosen = req.params.character;

//   console.log(chosen);

//   for (var i = 0; i < characters.length; i++) {
//     if (chosen === characters[i].routeName) {
//       return res.json(characters[i]);
//     }
//   }

//   return res.json(false);
// });
app.delete("/api/notes/:id", function(req, res){
    //since we are deteling notes based on id, we need to get that id
    var id = req.params.id;
    //JSON parse the db.json as an object since we migh need to use it later on.
    var deletingUserNotes = JSON.parse(fs.readFileSync(path.resolve(__dirname, "db/db.json"), "utf8"));
    //using filter method, which takes in callback function and returns deleting notes of the same id
    var note = deletingUserNotes.filter(note =>{
        return deletingUserNotes.id == id;
        
    })[0];

    //trying out indexOf methods which takes the index of variable deletingUserNotes and save it to the index variable
    const index = deletingUserNotes.indexOf(note)
    // then we splice it, by access the index value of index variable and then delete one at a time. SO technichally we are deleteing one note at a time everytime use hit delete button icon.
    deletingUserNotes.splice(index, 1)
    
    // using the same method as before to save deleted notes
    let file = path.join(__dirname, 'db', "/db.json");
    var saveDeletedNotes = JSON.stringify(deletingUserNotes)
    fs.writeFileSync(file, saveDeletedNotes)

    res.sendFile(path.join(__dirname, '/db/', 'db.json'));
}) 


app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});