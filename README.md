# Assessment

## Installation

`docker compose up -d --build`

A `rest.http` file showcases the requests available from the server.

```http

GET http://localhost:3000/GetTypes?types=Emails,Chats,Sms
authorization: Bearer 123
accept: application/json
content-type: application/json
```

## Tasks

### Task 1 – Parsing

Deliverable:

- [x] Functional and tested code that can parse and store data read from files.
- [x] The parsing should occur on startup of the Web API so it can be consumed later.

> Follow-up question:
> ** Briefly describe how you would approach designing and implementing a database to store your model. **

In order to best design a database it would be important to understand how the data will be used. If the messages need to be segregated (and used by type) then it makes sense to create new tables for each type of message (more or less how they are presented in the resources folder).

If type is not important, I would create one table for the message text (and other common data) and create a junction table connecting that message to its type/owner/etc.

### Task 2 - Serving

Deliverable:

- [x] Fully functional Web API.
- [x] It should integrate the parsing component from task one.

> Optional:
> ** Describe an authentication strategy that could be added to the TimeFilter endpoint **

For simplicity, we can use JWT (JSON Web Token) for authentication. The client should include an `Authorization: Bearer ...` header, which the server middleware can validate.

### Task 3 – Continuous Integration and continuous Delivery/Deployment

Deliverable:
Briefly describe a strategy for creating a CI-CD pipeline for the API created in earlier tasks.

1. Since this is a containerized application, we can use AWS Fargate for hosting. 
2. We would implement a pipeline on a Github account which will listen for pushes to specific branches (ie, `master`, `dev`)
3. Depending on the branch, the pipeline will build and write to the Fargate task

I've implemented this using AWS CDK. See [this repository](https://github.com/RizaHKhan/cdk-for-laravel-deployment/blob/master/lib/constructs/pipeline.ts) for an example that sets up a Laravel application on an EC2 instance via Pipelines.
