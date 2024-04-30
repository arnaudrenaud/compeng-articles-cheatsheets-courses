# What to do with runtime errors

Errors are painful for the developer and the user alike. Errors without a clear message even more. And what about silent errors that make debugging a pain?

## TL;DR

- Do not blindly use `try-catch` blocks
- Uncaught errors end up in logs, making debugging easier
- If an error is not your fault, catch it (it is called an exception)
- If an error is the user's fault, tell them clearly

## Goals

The objective of this practical guide is to help you, the developer:

- Distinguish exceptions from errors
- Give yourself full information about the error
- Give the user limited but useful information about the error

We’ll use the example of a web server, but the same principles apply to any other type of server-side and to most client-side applications.

## Error or exception?

A runtime error happens when an instruction fails to complete.

You can either:

- let errors terminate the program – in this case, errors are left _unckecked_
- or catch them before they do – in this case, errors are _checked_ and are called _exceptions_

### Unchecked error

Errors may imply a bug: a logical misconception or some misconfiguration. In this case, they should not be caught and silenced but rather fixed.

Examples:

- an algorithm crashes unexpectedly
- you try to connect to a database with invalid credentials

### Exceptions (checked error)

Reciprocally, an error may not imply a malfunction in the program. It is typically the case when abnormal behavior comes from a third party.

Hence the name, _exception_: exceptionally, it should be caught and worked around because there is nothing to fix in our program.

Examples:

- a user requests a non-existent resource
- a user submits malformed data
- an external provider does not respond

## What to do in four cases

### 1. User-induced error

In case of a user-induced error (for example, a malformed request):

⚙️ _Is it an error or an exception?_

An exception (it must be caught).

🧑‍💻 _Should I tell the user all about it?_

Absolutely, so they can fix it.

📝 _Should I output the error to logs?_

You may, marking it as a user-induced exception. This way, you could learn about app usage and improve user experience.

### 2. Third-party-induced error

In case of a third-party-induced error (for example, an external remote API used by your app):

⚙️ _Is it an error or an exception?_

An exception (it must be caught).

🧑‍💻 _Should I tell the user all about it?_

Yes, so that they know it’s not a bug on your side: you can’t do much, they just have to wait.

📝 _Should I output the error to logs?_

Yes, marking it as a third-party-induced exception. This way, you could learn about deficiencies among your external providers.

### Internal error

#### 3. Outside a user request

In case of an error occuring outside a user request (for example a script failing at server startup):

⚙️ _Is it an error or an exception?_

An error (it must _not_ be caught).

📝 _Should I output the error to logs?_

Absolutely, it’s a failure that needs to be fixed.

You have nothing to do in this case. By default, it will crash the server and output the error.

#### 4. Within a user request

In case of an error occuring inside a user request:

⚙️ _Is it an error or an exception?_

An error (it must _not_ be caught).

🧑‍💻 _Should I tell the user all about it?_

No, just show them a simple message (such as "Internal server error") so that they know something has to be fixed on your side.

📝 _Should I output the error to logs?_

Absolutely, it’s a failure that needs to be fixed.

You generally have nothing to do in this case. Any error uncaught by the developer will, in the end, be caught by the server and result in a default client-side error message while it outputs the full error in logs.

_Note: in Node.js Express 4 however, you have to catch async errors yourself to avoid a server crash._

## In practice in JavaScript

Some programming languages provide a distinction between plain errors and exceptions, such as Java with classes `Error` and `Exception`.

In JavaScript, you can only `throw new Error(…)`. It is up to you to distinguish exceptions and actual errors.

Below is a example with a Node.js Express server (version `5.0.0-beta.3`) handling all four different cases seen above:

1. User-induced exception
2. Third-party induced exception
3. Error outside a user request
4. Error within a user request

```js
// ⚠️ This will fail with Express version 4: make sure you use Express 5+ (tested on `express@5.0.0-beta.3`)
const express = require("express");

const EXCEPTIONS = {
  THING_WITH_NAME_ALREADY_EXISTS: {
    id: "THING_WITH_NAME_ALREADY_EXISTS",
    message: "A thing with the same name already exists.",
    status: 400,
    // case 1: we do not want to log this user-induced exception
    shouldLog: false,
  },
  NOTIFICATION_SERVICE_UNAVAILABLE: {
    id: "NOTIFICATION_SERVICE_UNAVAILABLE",
    message:
      "The notification service is currently unavaible, please retry later.",
    status: 500,
    // case 2: we want to log this third-party-induced exception
    shouldLog: true,
  },
  // …
};

// this function will distinguish exceptions and unchecked errors
function handleErrors(error, req, res, next) {
  const exception = EXCEPTIONS[error.message];

  if (!exception || exception?.shouldLog) {
    console.error({
      type: exception ? "EXCEPTION" : "ERROR",
      error,
    });
  }

  res
    .status(exception?.status ?? 500)
    .send(exception?.message ?? "Internal server error.");
}

async function notify() {
  try {
    await service.sendNotification(/* … */);
  } catch (error) {
    // case 2: third-party-induced exception
    throw new Error(EXCEPTIONS.NOTIFICATION_SERVICE_UNAVAILABLE.id, {
      cause: error,
    });
  }
}

async function runServer() {
  // case 3: an error at startup will crash the server, as wanted
  await database.connect(/* … */);

  const server = express();

  server.get("/", () => {
    // case 4: error will be caught by `handleErrors`, which will tell the user "Internal server error."
    throw new Error("random unchecked error");
  });

  server.post("/things", async (req, res) => {
    const existingThingWithName = await database.find(/* name from req.body */);
    if (existingThingWithName) {
      // case 1: user-induced exception
      throw new Error(EXCEPTIONS.THING_WITH_NAME_ALREADY_EXISTS.id);
    }
    await notify(/* … */);
    res.sendStatus(201);
  });

  server.use(handleErrors);

  server.listen(4000, () => {
    console.log("Server listening on port 4000…");
  });
}

runServer();
```

## Summary

Using these rules, both you and the user will be properly informed at the correct level:

- The user knows whether:
  - their request is incorrect
  - or they just need to wait for a third-party service to resume
  - or they need to wait for a fix
- You know whether errors need a fix or if they are exceptions independent of your work

Finally, you have seen it is no use to surround everything with `try-catch` blocks: you should only catch known exceptions and let your server treat the rest as errors.
