# explaining my decisions:

## the stack:
my first inportastnt decision was choosing the correct stack for this kind of project. my first go was to use actual SQL db wrapped with docker container with docker-comppose (so evaluators can test the project themselves). this seemed like a bit of an overkill for this size of a project. I consolted Gemini who recommended SQLite. I read a bit about it and once I made sure I would be able to use transactions using SQLite - I decided to go for it.

## the architecture
A programmer should always ask himself - *what happens if the server crashes right here?* 
Especially when handling money stuff :)
that of caurse means using transactions, but I had other ideas too.
for example - when a client requests a deposit, what would happen if the server crashes *after* handling the request but *before* telling the client the request went through? my idea was to create 2 different operetions in the server.
*The first one* gets tthe requst and creates a new db entity with that request details. this operation doesnt return a "OK" message to the user, but the ID of the request.
*The second one* gets the request details and operates them. one complete it updats that request in the db to be "completed = true".
once the client got the id, it statrs polling the server about that id X times per second. the server returns to the client the value of "completed" of that request in the db. 
that way the client can be sure that it knows exactly what is the situation with it's request.
I didnt make that change to the architecture because I felt it was a bit too much, but I did implement other safety ideas I had - like the locking mechanizm.  



## Swagger
since this project is only backend, I wanted reviewers to have a friendly way to check the server. I remembered I once used a tool called Swagger on one of my projects. I read about it a bit to see I remember how to use it and asked Geemini if there's a similar tool that would be a better fit to my project that I never heard of. when I saw Swagger is my best choice, I added it to my project. its designed to be added in a simple manner that doesnt effect the architecture so adding it was a simple choice of UX, not an actual architectual decision.


## locking mechanism
when dealing with money transactions and account management, it is very important to handle db access correctly.
we dont want that exactly when a bank admin decides to block a user, this user finishes a withdraw action that overrides the blocking change and resets the "activeFlag" to be true again.
to deal with that we need some sort of a locking mechanism, so operations that change the data can only happen 1 at a time.
in this project I decided to implement an optimistic locking mechanism by adding a "version" field to the schema. an operation that tries to change data will first read the version, and once calculating is finished will update the db only if the version is still the same. updating the data will increment the cersion by 1. this ensures that if some other proccess changed the data while the current proccess was calculating, the current proccess will no longer have the correct "version" value and will throw an error to the user saying they should try again.

## Money representation
I wanted to be sure Im taking the safe approach representing the money in the DB. after some reading and research, turnes out representing the money as *float* numbers is a very bad idea, since JS looses percision when calculating numbers represented as *float*. so I decided I had to use *integers* to represent the money. in that case, in order to support fractions (cents for example), a number in the DB must represent the smallest coin possible in the country (cents in USA, or agora in Israel). that way, we keep money representation safe while still being able to handle small money ("change"). 
the final decision was that money will be represented in the DB as *integer*, while the coin represented is "cents" and not "dollars".
