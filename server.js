const express = require('express');
const { animals } = require('./data/animals');

const PORT = process.env.PORT || 3001; 
const app = express(); 

// This function will take in req.query as an argument and filter through the animals accordingly, returning the new filtered array. Go ahead and call the filterByQuery() in the app.get() callback now. 
function filterByQuery(query, animalsArray) {
  let personalityTraitsArray = [];
  // Note that we save the animalsArray as filteredResults here:
  let filteredResults = animalsArray;
  if (query.personalityTraits) {
    // Save personalityTraits as a dedicated array.
    // If personalityTraits is a string, place it into a new array and save.
    if (typeof query.personalityTraits === 'string') {
      personalityTraitsArray = [query.personalityTraits];
    } else {
      personalityTraitsArray = query.personalityTraits;
    }
    // Loop through each trait in the personalityTraits array:
    personalityTraitsArray.forEach(trait => {
      // Check the trait against each animal in the filteredResults array.
      // Remember, it is initially a copy of the animalsArray,
      // but here we're updating it for each trait in the .forEach() loop.
      // For each trait being targeted by the filter, the filteredResults
      // array will then contain only the entries that contain the trait,
      // so at the end we'll have an array of animals that have every one 
      // of the traits when the .forEach() loop is finished.
      filteredResults = filteredResults.filter(
        animal => animal.personalityTraits.indexOf(trait) !== -1
      );
    });
  }
  if (query.diet) {
    filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
  }
  if (query.species) {
    filteredResults = filteredResults.filter(animal => animal.species === query.species);
  }
  if (query.name) {
    filteredResults = filteredResults.filter(animal => animal.name === query.name);
  }
  // return the filtered results:
  return filteredResults;
}
//Takes in the id and array of animals and returns a single animal object
function findById(id, animalsArray) {
  const result = animalsArray.filter(animal => animal.id === id)[0];
  return result;
}

//First argument is a string that describes the route the client will have to fetch from. The second is a callback function that will execute every time that route is accessed with a GET request. Note that we are using the send() method from the res parameter(short for response) to send the string Hello! to our client. 
app.get('/api/animals', (req, res) => {
  let results = animals; 
  if (req.query){
    results = filterByQuery(req.query, results);
  }
  //send method is great for short messages, but if we want to sends lots of JSON we change send to json 
  res.json(results);
})

// the req object gives us access to another property for finding a specific animal rather than an array of the animals that match a query. the method is req.params. Unlike the query object, the param object needs to be defined in the route path, with <route>/:parameterName>. 
app.get('/api/animals/:id', (req, res) => {
  const result = findById(req.params.id, animals);
  if (result) {
    res.json(result);
  } else {
    res.send(404);
  }
});

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});

//It works but what if we just need specific animals from the JSON file? This is where you use parameters. 
//Navigate to http://localhost:3001/api/animals?name=Erica  in your browser and you will get  Erica. 

// Querying properties that are strings works as above but filtering animals based upon personality traits is different because they are stored within an array and makes things more complex. 