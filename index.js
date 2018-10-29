const express = require("express");
const graphqlHTTP = require("express-graphql");
const { buildSchema } = require("graphql");
const createError = require("http-errors");
const logger = require("morgan");
// const mongoose = require("mongoose");
const cors = require("cors");

// const indexRouter = require("./routes/index");
// const partyRouter = require("./routes/partyRoute");

const app = express();

const port = 5000;

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const db = {
  users: [
    {
      userId: "a",
      currentLocation: { lng: 50.1, lat: 40.2 },
      isStarted: false
    },
    {
      userId: "b",
      currentLocation: { lng: 500.1, lat: 40.2 },
      isStarted: false
    }
  ]
};

const schema = buildSchema(`
  type Query {
    users: [User!]!
    user(userId: ID!): User
  }

  type User {
    userId: ID!
    currentLocation: Location,
    isStarted: Boolean!
  }

  type Location {
    lng: Float
    lat: Float
    time: String
  }
`);

const rootValue = {
  users: () => db.users,
  user: args => db.users.find(user => user.userId === args.userId)
};

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue,
    graphiql: true
  })
);

// const mongoUrl = process.env.MONGOLAB_URI || "mongodb://localhost:27017/cerf";

// mongoose.connect(
//   mongoUrl,
//   { useNewUrlParser: true }
// );

// app.use("/", indexRouter);
// app.use("/parties", partyRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err);
});

app.listen(process.env.PORT || port, () => {
  console.log(`listening on port ${port}`);
});

module.exports = app;
