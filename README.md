# Anagramma

Anagramma is a web api created to perform operations related to anagrams.  From storing anagrams to figuring out words with a certain number of them, this api covers it all.

## Motivation

A developing firm from Denver tasked me with building this api for them.  The focus was on four particular operations: insert anagrams into the corpum, return all anagrams for the word passed in the url (with or without a limit on the number of words), delete a single word from the corpus, and delete the entire corpus.  Some optional operations were suggested as well.

## Approach

Since this is a web application and the requirements specified JSON responses, I was sure I was going to use **JavaScript** for the get go.  I chose **Node** and **Express** to write the application, but wasn't sure about the data store.  


My original idea was to save everything in memory since we're only dealing with text.  The problem with that approach is that any of the suggested features requires a fair amount of logic in the code, if I used a database I could delegate all that logic to querying it properly, so I decided to use a database instead.  In choosing a database, I knew wanted to use a document-oriented one, since we're only dealing with JSON data.  **MongoDB** was the database of choice for me.  I factored in the document model, the support, the scalability, and flexibility with the queries.  Having a database for something so simple feels a bit of an overkil.  At the same time, the tools available, and the powerful querying capabilities were worth it.  I must also disclose that MongoDB is my favorite database.  There's a bit of tech bias here -and that's ok!  My provider here is **MongoDB Atlas** (cloud hosted MongoDB instances).
  
## Trade-offs

Writing the application in Node is comfortable.  The Express framework allowed me to focus on the logic and not so much on verbose syntax.  At the same time, I was given tests in Ruby.  Ruby is a synchronous language and the tests run synchronously.  JavaScript (and subsequently Node) is an asynchronous language, so some additional set up and adjustments were necessary to make the tests run properly.  It was challenging to master promises and asynchronous programming for this as well, but I feel my Node skills are sharper than ever after this.

Another point of trade-off is the data store itself.  Consuming words, digesting a hash, and inserting them into the database is extremely slow in comparisson to using the memory.  In a production environment where all the words would already be in the store, inserting fast wouldn't be as important.  The database also adds another layer of complexity.  That is a good and a bad thing.  This layer of complexity offers flexibility and a lot of room to expand the project, the data store limits the project in that sense -although it's much simpler to deal with.  The database also requires a provider, and another network point that needs to be considered. 

## Architecture

This Node application uses the Express framework to set up routes that are used as endpoints.  Requests made to the endpoints get processed by the Node application.  The Node application queries an instance of MongoDB and returns the results as JSON responses.

## Project Structure

There are two main folders in the project: *server* and *routes*.  
-server contains the Node application itself and a set of tools used throughout the project.
-routes/api contains the methods used by the routes.
--*anagrams contains all methods associated with routes under /anagrams/
--*words contains all methods associated with routes under /words/
--*stats contains all methods associated with routes under /stats/

An endpoint request calls the Node app in /server -> that calls an export module in /routes/api/ -> that calls a function that queries the db (in the same file)

Endpoints are structured that way to make the code as modulas as possible.  One function queries, another function sends the HTTP response.

## Project Tools

-VSCode
-MongoDB Compass
-GitHub 
-Trello

## Project Management

Although I wrote this by myself, I had to be organized in order to get everything done.  Once I figured out what technology I wanted to use, I immediately broke down the project in accomplishable chunks.  I made a little scrum board for myself on Trello and worked on those "user stories".  I gave myself a week to complete this, but I couldn't work on it all the time.  It was crucial having the board to guide me through the development process.  Commits related to the stories can be found in the comments of those stories.

The version control model I chose is Trunk based since I was the only person working on the project. 

## Challenges

I knew how to use promises in JavaScript before.  Using promises with multi query operations was challenging.  I think I achieved some sort of mastery after doing this.  Now I'm very comfortable with the asynchronous model.

Another challenge was writing the queries for the additional features.  I hadn't used the aggregation framework so intensely before, but it was part of my design to delegate the logic to the queries.  MongoDB Compass was an amazing tool that helped me write most of those queries.

I also spent a lot of time dealing with Heroku's hosting issues.  I wanted to use environment variables for my credentials, but Heroku doesn't have a plugin for MongoDB Atlas -they do have one for mLab.  I figured that out and now everything works smoothly.  

I still wanted to provide a way to run the app locally, so in the end I had to expose my credentials.  I created one just for the project and it's safe to share.  Another option would be to containerize the application and I would do it if I had time.

## 