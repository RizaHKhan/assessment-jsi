# Assessment

## Installation

`docker compose up -d --build`

A `rest.http` file showcases the requests available from the server. The server will be available on port 3000.

```http

GET http://localhost:3000/GetTypes?types=Emails,Chats,Sms
authorization: Bearer 123
accept: application/json
content-type: application/json
```

Response
```json
{
  "Emails": [
    {
      "From": "alice@email.com",
      "To": "bob@email.com,charles@email.com",
      "Cc": "",
      "Bcc": "",
      "DateTime": "2021-01-01T11:00",
      "Subject": "Hello",
      "Body": "How are you guys?"
    },
    {
      "From": "bob@email.com",
      "To": "alice@email.com,charles@email.com",
      "Cc": "",
      "Bcc": "",
      "DateTime": "2021-01-01T11:05",
      "Subject": "Hey",
      "Body": "I'm fine I hope to meet with you guys today!?"
    }
  ],
  "Chats": [
    {
      "Application": "Facebook",
      "From": "john@yahoo.com",
      "To": "Susan Smith",
      "DateTime": "2021-01-01T09:00",
      "Text": "Hi did you call me earlier?"
    },
    {
      "Application": "WhatsApp",
      "From": "6135557777",
      "To": "6135556666",
      "DateTime": "2021-01-01T09:01",
      "Text": "Let's go see a movie in the weekend?!"
    }
  ],
  "Sms": [
    {
      "From": "6135556666",
      "To": "6135557777",
      "DateTime": "2021-01-01T10:00",
      "Text": "Hello how are you?"
    },
    {
      "From": "6135557777",
      "To": "6135556666",
      "DateTime": "2021-01-01T10:01",
      "Text": "I'm fine thanks! Yourself?"
    }
  ]
}

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
