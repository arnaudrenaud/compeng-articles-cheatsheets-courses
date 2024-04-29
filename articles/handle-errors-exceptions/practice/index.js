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
