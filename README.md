# Anagramma

Anagramma is a web api created to perform operations related to anagrams.  From storing anagrams to figuring out words with a certain number of them, this api covers it all.

## Motivation

A developing firm from Denver tasked me with building this api for them.  The focus was on four particular operations: insert anagrams into the corpum, return all anagrams for the word passed in the url (with or without a limit on the number of words), delete a single word from the corpus, and delete the entire corpus.  Some optional operations were suggested as well.

## Approach

Since this is a web application and the requirements specified JSON responses, I was sure I was going to use **JavaScript** for the get go.  I chose **Node** and **Express** to write the application, but wasn't sure about the data store.  


My original idea was to save everything in memory since we're only dealing with text.  The problem with that approach is that any of the suggested features requires a fair amount of logic in the code, if I used a database I could delegate all that logic to querying it properly, so I decided to use a database instead.  In choosing a database, I knew wanted to use a document-oriented one, since we're only dealing with JSON data.  **MongoDB** was the database of choice for me.  I factored in the document model, the support, the scalability, and flexibility with the queries.  Having a database for something so simple feels a bit of an overkil.  At the same time, the tools available, and the powerful querying capabilities were worth it.  I must also disclose that MongoDB is my favorite database.  There's a bit of tech bias here -and that's ok!  My provider here is **MongoDB Atlas** (cloud hosted MongoDB instances).
  
## Trade-offs

Writing the application in Node is a great experience.  The Express framework allowed me to focus on the logic and not so much on verbose syntax.  At the same time, I was given tests in Ruby.  Ruby is a synchronous language and the tests run synchronously.  JavaScript (and subsequently Node) is an asynchronous language, so some additional set up and adjustments were necessary to make the tests run properly.

Another point of trade-off is the data store itself.  Consuming words, digesting a hash, and inserting them into the database is extremely slow in comparisson to using the memory.  In a production environment where all the words would already be in the store, inserting fast wouldn't be as important.  The database also adds another layer of complexity.  That is a good and a bad thing.  This layer of complexity offers flexibility and a lot of room to expand the project, the data store limits the project in that sense -although it's much simpler to deal with.  The database also requires a provider, and another network point that needs to be considered. 
