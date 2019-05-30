# Anagramma

Anagramma is a web api created to perform operations related to anagrams.  From storing anagrams to figuring out words with a certain number of anagrams, this api covers it all.  This **Node** app uses **Express** to set-up routes, and **MongoDB** as the data store.  All responses are in JSON form.

root endpoint: ```https://anagramma.herokuapp.com/```

An alternative version with 170,000+ words exists here: ```https://anagramma2.herokuapp.com/``` *the DELETE all words route is disabled on this version, but it's a lot better for visualizing /stats/, check it out!  They both accept the same routes.

## Table of Contents
- [How to use it](#How-to-use-it)
- [Architecture](#Architecture)
- [Tech Stack](#Tech-Stack)
- [Project Structure](#Project-Structure)
- [Requirements](#Requirements)
- [Approach](#Approach)
- [Trade-offs](#Trade-offs)
- [Testing](#Testing)
- [Project-Tools](#Project-tools)
- [Project Management](#Project-Management)
- [Challenges](#Challenges)
- [What I would do differently in a professional environment](#What-I-would-do-differently-in-a-professional-environment)
- [Future-Features](#Future-Features)

## How to use it

Access the following endpoints with the following HTTP Requests: 


**Basic Features**
- `POST https://anagramma.herokuapp.com/words.json`: takes in a JSON array to be added to the database.  Array limit is about 8150 (8162 is the maximum I was able to insert at once)
- `DELETE https://anagramma.herokuapp.com/words.json`: this will delete all words from the database.
- `DELETE https://anagramma.herokuapp.com/words/:word.json`: this will delete a particular word from the database.
- `GET https://anagramma.herokuapp.com/anagrams/:word.json`: this will get anagrams for a particular word in the database.  Additional params: "limit" for limiting the amount of results, and "proper" for excluding proper nouns.

**Optional Features**
- `GET https://anagramma.herokuapp.com/`: points the user to this page. 
- `GET https://anagramma.herokuapp.com/anagrams/mostanagrams.json`: this will retrieve the words with most anagrams. 
- `GET https://anagramma.herokuapp.com/anagrams/minimumnumber.json?atleast=5'`: this will get words with at least the number specified in the argument. 
- `POST https://anagramma.herokuapp.com/anagrams/words.json`: takes in a JSON array of words and checks if they are all anagrams of each other. 
- `DELETE https://anagramma.herokuapp.com/anagrams/:word.json`: deletes a word and all its anagrams from the database. 
- `GET https://anagramma.herokuapp.com/stats/total.json`: returns the total amount of words in the database. 
- `GET https://anagramma.herokuapp.com/stats/average.json`: returns the average length of all words in the database. 
- `GET https://anagramma.herokuapp.com/stats/min.json`: returns the smallest word in the database. 
- `GET https://anagramma.herokuapp.com/stats/max.json`: returns the biggest word in the database. 

To run the app locally:
```
1. *git clone* the repo.
2. navigate to the root directory and *npm install*.
3. Fill in the uri string in /config/keys.js with the credentials I've given you, or your own MongoDB credentials
4. *npm run dev* or *npm start*
```

To run tests locally:
```
1. Navigate to /tests
2. Download the Gems in the imports
3. ruby anagram_test.rb
```

## Architecture

This Node application uses the Express framework to set up routes that are used as endpoints.  Requests made to the endpoints get processed by the Node application that queries an instance of MongoDB and returns the results as JSON responses.

A word is nothing but a combination of scrambled characters.  Anagrams are words that have the same characters scrambled differently.  Grouping the anagrams is simple, I just needed to group words that contain the same letters.  I use a function that splits the string, converts all characters to lowercase, unscramble the characters, and joint the characters in a string again.  That is my first value (under the 'combination' key).  My second key is 'anagrams', followed by the words that are made from the letters in "combine".
```
combination: aadrr,
anagrams: ['radar']
```

*For the longest time I was using a function to create a unique hash for every word, but in the end I realized that having the letters that compose the word unscrambled was unique enough.


## Tech Stack

* Node.js
  * Express framework
  * MongoDB Core Driver
* MongoDB
* Ruby (for testing)
* GitHub (for source control)

## Project Structure

There are two main folders in the project: *server* and *routes*.  
* server contains the Node application itself and a set of tools used throughout the project.
* routes/api contains the methods used by the routes.
  * anagrams contains all methods associated with routes under /anagrams/
  * words contains all methods associated with routes under /words/
  * stats contains all methods associated with routes under /stats/
* platform_dev has the assets I was given to start with.

An endpoint request calls the Node app in /server -> that calls an export module in /routes/api/ -> that calls a function that queries the db (in the same file)

Endpoints are structured that way to make the code as modulas as possible.  One function queries, another function sends the HTTP response.


## Requirements

The focus was on four particular operations: 
- `POST /words.json`: Takes a JSON array of English-language words and adds them to the corpus (data store).
- `GET /anagrams/:word.json`:
  - Returns a JSON array of English-language words that are anagrams of the word passed in the URL.
  - This endpoint should support an optional query param that indicates the maximum number of results to return.
- `DELETE /words/:word.json`: Deletes a single word from the data store.
- `DELETE /words.json`: Deletes all contents of the data store.

There were also optional operations:
- Endpoint that returns a count of words in the corpus and min/max/median/average word length
- Respect a query param for whether or not to include proper nouns in the list of anagrams
- Endpoint that identifies words with the most anagrams
- Endpoint that takes a set of words and returns whether or not they are all anagrams of each other
- Endpoint to return all anagram groups of size >= *x*
- Endpoint to delete a word *and all of its anagrams*


## Approach

Since this is a web application and the requirements specified JSON responses, I was sure I was going to use **JavaScript** for the get go.  I chose **Node** and **Express** to write the application, but wasn't sure about the data store.  


My original idea was to save everything in memory since we're only dealing with text.  The problem with that approach is that any of the optional features requires a fair amount of logic in the code. If I used a database I could delegate all that logic to querying it properly, so I decided to use a database instead.  In choosing a database, I knew wanted to use a document-oriented one, since we're only dealing with JSON data.  **MongoDB** was the database of choice for me.  I factored in the document model, the support, the scalability, and flexibility with the queries.  Having a database for something so simple feels a bit of an overkil.  At the same time, the tools available, and the powerful querying capabilities were worth it.  I must also disclose that MongoDB is my favorite database.  There's a bit of tech bias here.  My provider here is **MongoDB Atlas** (cloud hosted MongoDB instances).

  
## Trade-offs

Writing the application in Node is fit for the web.  The way JavaSript deals with JSON data made it really convenient.  At the same time, I was given tests in Ruby.  Ruby is a synchronous language and the tests run synchronously.  JavaScript (and subsequently Node) is an asynchronous language, so some additional set up and adjustments were necessary to make the tests run properly.  It was challenging to master promises and asynchronous programming for this as well, but I feel my Node skills are sharper than ever after this.

Another point of trade-off is the data store itself.  Consuming words, converting them to a sequence of characters, and inserting them into the database is extremely slow in comparisson to using the memory.  In a production environment where all the words would already be in the store, inserting fast wouldn't be as important.  I went with the database approach because the requirements did mention that the speed in which the words are consumed isn't important.  The database also adds another layer of complexity.  That is a good and a bad thing.  This layer of complexity offers flexibility and a lot of room to expand the project; the data store limits the project in that sense -although it's much simpler to deal with.  The database also requires a provider, and another network point that needs to be considered. 

## Testing

```
A testing framework (anagram_client.rb) and a test suite(anagram_test.rb) were provided.  I've spoken about it before, but because Ruby runs synchronously and Node runs asynchronously, the tests are very inconsistent.  Running the test multiple times with no changes to the test nor the application yields different results a lot of the time -I included a screenshot of that scenario under /img/tests.  What I did to mitigate that issue was making the Ruby test to wait a few seconds after a request in an attempt to let it complete properly.  That added a bit of consistency, but not enough to do away with all problems.  
```

That's what I thought was going on initially, until I started writing tests with Mocha/Chai.  I started writing tests that respect the asynchronous nature of the application of the application.  What I missed is that Ruby's synchronous nature should work in my favor here.  I got mixed up between sync and async and thought the errors were due to that.  I still think it's a good idea to use Mocha/Chai to test the applications though.  (Having it all being Javascript based would be great for a team).

The Mocha/Chai tests were great because they revealed something.  The disparity in testing the application is not coming from the testing framework, it's coming from the way the application was written.  The tests with inconsistent results with both Mocha/Chai and Ruby confirmed that the insertion operation isn't atomic when multiple words are inserted at once.  I can think of two solutions for this: use a session during the insertion to make the "three-word insertion" atomic; or rewrite the function that inserts the documents to return the updated document when the last word is inserted.

PS: I found what I consider to be an error in the tests, and here, I felt free to modify it.  At work, I'd connect with the person who wrote the test first and check with them before suggesting the correction.


## Project Tools

* VSCode
* MongoDB Compass
* GitHub 
* Trello

## Project Management

Although I wrote this by myself, I had to be organized in order to get everything done.  Once I figured out what technology I wanted to use, I immediately broke down the project in accomplishable chunks.  I made a little scrum board for myself on Trello and worked on those "user stories".  I gave myself a week to complete this, but I couldn't work on it all the time.  It was helpful having the board to guide me through the development process.  Commits related to the stories can be found in the comments of those stories.

The version control model I chose is Trunk based since I was the only person working on the project. 

The little scrum board (more similar to a kanban board) can be found [here](https://trello.com/b/Vc4MRw1S/anagramma).

## Challenges

I knew how to use promises in JavaScript before.  However, using promises with multi query operations was challenging.  I think I achieved some sort of mastery after doing this.  Now I'm very comfortable with the asynchronous model.

Another challenge was writing the queries for the additional features.  I hadn't used MongoDB's aggregation framework so intensely before, but it was part of my design to delegate the logic to the queries.  MongoDB Compass was an amazing tool that helped me write most of those queries.

I also spent a lot of time dealing with Heroku's hosting issues.  I wanted to use environment variables for my credentials, but Heroku doesn't have a plugin for MongoDB Atlas -they do have one for mLab.  I figured that out and now everything works smoothly.  

Testing with the tests provided in Ruby was tricky.  Tests will often fail because of the asynchronous nature of the application.  It's common for the test to attempt to delete a word that hasn't been inserted yet, or expect a reponse about a query that hasn't been posted yet.

Using benchmark-bigo.  There was suggestion to test the application's performance, but that turned out to take more time than I had, so I ended up not testing the performance.  I really wish I could have used it.

## What I would do differently in a professional environment


* One of the tests expects the wrong output.  It works sometimes and sometimes it doesn't.  The reason why: Ruby is synchronous, and if the server/db stalls a little bit, there's a chance one of the assertion will be made before the last word is inserted.  Here I can modify the test myself.  Professionally, I would reach out to whoever wrote the test to make sure I didn't miss anything in the assertion.

* I might not have chosen the tech stack I chose.  Here, in isolation, I chose the tech stack by myself.  At a professional setting I would never do that.  I would leverage the knowledge of the team, and their ideas.  We would reach a decision together.

* I would work in sprints.  I worked through an entire week and did this.  Sure, I had a little scrum board to organize myself.  The process is different though.

* I would reach out for help in writing some of the promises.  I'm happy with the final model that I consistently used across all functions.  At the same time, it took me quite some time to achieve it.  Some of the asynchronous calls really bent my head when trying to debug it -especially when then involved multiple CRUD operations.  I would have asked for help from someone who knows more about it.

* I would write more tests.  And more importantly, I would write them in JavaScript so I can take into account asynchronous quirks.  More tests will allow me to debug the application better, and optmize and figure out interesting corner cases.

* Write benchmark tests.  If someone knows how to use it properly, I'd love to talk to them!

## Future Features


* This is a great scalable tool.  I actually want to make this project into "an official" one.  What the application is lacking is a convenient way to deal with the application.  For that I had two ideas: a React front-end and an Alexa app.  As soon as I have time, I would like to work on these.

* I did invest a bit of time into the additional features because I am hopeful I'll get to build more on top of this.  A great way to show that would be using [D3.js](https://d3js.org/).

* Not all features should be available to all users.  All the deletes should only be available for users with credentials.  A credential system (passport framework for example) needs to be put in place to address that.

* The way the collection is set up in MongoDB makes it really easy to add other languages.  The API is ready, all it needs to do is a new collection with a new language.

* More tests.  Not really a feature, but it's too important not to be included.  This project needs appropriate testing written to respect the asynchronous nature of the application.

* A lot of the queries can be optmized.  I don't personally think the increase in performance would be noticiable, but there's room for improvement.

* In a production environment the data isn't likely to change often, it would be far more convenient to spin a local MongoDB server and have the application hosted in the same space as that server.  I haven't looked much into it, but I think AWS provides that capability.  An alternative is to Dockerize the application as well, that way we can deplay a packaged application that is sure to contain all these features independent of platform (I wish I had thought of this approach before).
