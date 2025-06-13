# Assessment

## Task 1 – Parsing

Deliverable:
[x] Functional and tested code that can parse and store data read from files.
[x] The parsing should occur on startup of the Web API so it can be consumed later.

Follow-up question:
** Briefly describe how you would approach designing and implementing a database to store your model. **

# Task 2 - Serving

Deliverable:
[x] Fully functional Web API.
[x] It should integrate the parsing component from task one.

Optional:
** Describe an authentication strategy that could be added to the TimeFilter endpoint **

We could use a number of methods, but for the sake of simplicity use JWT (JSON Web Token). The headers would include `Authorization: Bearer ...` which can be assessed by a middleware on the server.
