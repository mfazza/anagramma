# Anagramma

Anagramma is a web api created to perform operations related to anagrams.  From storing anagrams to figuring out words with a certain number of anagrams, this api covers it all.

## Requirements

A developing firm from Denver tasked me with building this api for them.  The focus was on four particular operations: 
- `POST /words.json`: Takes a JSON array of English-language words and adds them to the corpus (data store).
- `GET /anagrams/:word.json`:
  - Returns a JSON array of English-language words that are anagrams of the word passed in the URL.
  - This endpoint should support an optional query param that indicates the maximum number of results to return.
- `DELETE /words/:word.json`: Deletes a single word from the data store.
- `DELETE /words.json`: Deletes all contents of the data store.

There were also optional requirements:
**Optional**
- Endpoint that returns a count of words in the corpus and min/max/median/average word length
- Respect a query param for whether or not to include proper nouns in the list of anagrams
- Endpoint that identifies words with the most anagrams
- Endpoint that takes a set of words and returns whether or not they are all anagrams of each other
- Endpoint to return all anagram groups of size >= *x*
- Endpoint to delete a word *and all of its anagrams*


## Approach

Since this is a web application and the requirements specified JSON responses, I was sure I was going to use **JavaScript** for the get go.  I chose **Node** and **Express** to write the application, but wasn't sure about the data store.  


My original idea was to save everything in memory since we're only dealing with text.  The problem with that approach is that any of the optional features requires a fair amount of logic in the code. If I used a database I could delegate all that logic to querying it properly, so I decided to use a database instead.  In choosing a database, I knew wanted to use a document-oriented one, since we're only dealing with JSON data.  **MongoDB** was the database of choice for me.  I factored in the document model, the support, the scalability, and flexibility with the queries.  Having a database for something so simple feels a bit of an overkil.  At the same time, the tools available, and the powerful querying capabilities were worth it.  I must also disclose that MongoDB is my favorite database.  There's a bit of tech bias here -and that's ok!  My provider here is **MongoDB Atlas** (cloud hosted MongoDB instances).
  
## Trade-offs

Writing the application in Node is comfortable.  The Express framework allowed me to focus on the logic and not so much on verbose syntax.  At the same time, I was given tests in Ruby.  Ruby is a synchronous language and the tests run synchronously.  JavaScript (and subsequently Node) is an asynchronous language, so some additional set up and adjustments were necessary to make the tests run properly.  It was challenging to master promises and asynchronous programming for this as well, but I feel my Node skills are sharper than ever after this.

Another point of trade-off is the data store itself.  Consuming words, digesting a hash, and inserting them into the database is extremely slow in comparisson to using the memory.  In a production environment where all the words would already be in the store, inserting fast wouldn't be as important.  The database also adds another layer of complexity.  That is a good and a bad thing.  This layer of complexity offers flexibility and a lot of room to expand the project, the data store limits the project in that sense -although it's much simpler to deal with.  The database also requires a provider, and another network point that needs to be considered. 

## Architecture & Design


This Node application uses the Express framework to set up routes that are used as endpoints.  Requests made to the endpoints get processed by the Node application.  The Node application queries an instance of MongoDB and returns the results as JSON responses.

A word is nothing but a combination of scrambled characters.  Anagrams are words that have the same characters scrambled differently.  Grouping the anagrams is simple, I just needed to group words that contain the same letters.  I wrote a function that splits the string, converts all characters to lowercase, unscramble the characters, and joint the characters in a string again.  That is my first value (under the 'combination' key).  My second key is 'anagrams', followed by the words that are made from the letters in "combine".

``` combination: aadrr,
anagrams: ['radar']
```

*For the longest time I was using a function to create a unique hash for every word, but in the end I realized that having the letters that compose the word unscrambled was unique enough.

## Project Structure

There are two main folders in the project: *server* and *routes*.  
* server contains the Node application itself and a set of tools used throughout the project.
  * routes/api contains the methods used by the routes.
  * anagrams contains all methods associated with routes under /anagrams/
  * words contains all methods associated with routes under /words/
  * stats contains all methods associated with routes under /stats/

An endpoint request calls the Node app in /server -> that calls an export module in /routes/api/ -> that calls a function that queries the db (in the same file)

Endpoints are structured that way to make the code as modulas as possible.  One function queries, another function sends the HTTP response.

## Project Tools

* VSCode
* MongoDB Compass
* GitHub 
* Trello

## Project Management

Although I wrote this by myself, I had to be organized in order to get everything done.  Once I figured out what technology I wanted to use, I immediately broke down the project in accomplishable chunks.  I made a little scrum board for myself on Trello and worked on those "user stories".  I gave myself a week to complete this, but I couldn't work on it all the time.  It was crucial having the board to guide me through the development process.  Commits related to the stories can be found in the comments of those stories.

The version control model I chose is Trunk based since I was the only person working on the project. 

## Challenges

I knew how to use promises in JavaScript before.  However, using promises with multi query operations was challenging.  I think I achieved some sort of mastery after doing this.  Now I'm very comfortable with the asynchronous model.

Another challenge was writing the queries for the additional features.  I hadn't used MongoDB's aggregation framework so intensely before, but it was part of my design to delegate the logic to the queries.  MongoDB Compass was an amazing tool that helped me write most of those queries.

I also spent a lot of time dealing with Heroku's hosting issues.  I wanted to use environment variables for my credentials, but Heroku doesn't have a plugin for MongoDB Atlas -they do have one for mLab.  I figured that out and now everything works smoothly.  

I still wanted to provide a way to run the app locally, so in the end I had to expose my credentials -which I understand is the worst practice, but I would never do in a production environment.  I created one just for the project and it's safe to share.  Another option would be to containerize the application and I might still do it in the future.

## What would I do different in a production environment

* First of all, credentials.  This project does demonstrate the solution of using environment variables from the server (end users are oblivious to the credentials).  Again, I just wanted to make sure others could run it locally too.

* One of the tests expects the wrong output.  Here I modified it myself.  Professionally, I would reach out to whoever wrote the test to make sure I didn't miss anything in the assertion.

* I might not have chosen the tech stack I chose.  Here, in isolation, I chose the tech stack by myself.  At a professional setting I would never do that.  I would leverage the knowledge of the team, and their ideas.  We would reach a decision together.

* I would work in sprints.  I worked through an entire week and did this.  Sure, I had a little scrum board to organize myself.  At the same time

* I would reach out for help in writing some of the promises.  Some of the asynchronous calls really bent my head when trying to debug it.  I would have asked for help from someone who knows more about it.

* I would write more tests.

## Looking forward
