import { ApolloServer } from 'apollo-server-express'
import express, { json, urlencoded } from 'express'
import createError from 'http-errors'
import logger from 'morgan'
import {
  PORT,
  IN_PROD,
  NODE_ENV,
  DB_USERNAME,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_NAME
} from './config'
import mongoose from 'mongoose'
import cors from 'cors'

import typeDefs from './typeDefs'
import resolvers from './resolvers'

const indexRouter = require('./routes/index')
// const partyRouter = require("./routes/partyRoute");

const app = express()

app.disable('x-powered-by')
app.use(logger('dev'))
app.use(json())
app.use(urlencoded({ extended: false }))
app.use(cors())

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: !IN_PROD
})

server.applyMiddleware({ app })

const mongoUrl =
  process.env.MONGOLAB_URI ||
  `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`

mongoose
  .connect(mongoUrl, { useNewUrlParser: true })
  .then(() => {
    app.use('/', indexRouter)
    // app.use("/parties", partyRouter);

    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
      next(createError(404))
    })

    // error handler
    app.use(function (err, req, res, next) {
      // set locals, only providing error in development
      res.locals.message = err.message
      res.locals.error = NODE_ENV === 'development' ? err : {}

      // render the error page
      res.status(err.status || 500)
      res.send(err)
    })

    app.listen(PORT, () => {
      console.log(`http://localhost:${PORT}${server.graphqlPath}`)
    })
  })
  .catch(() => {
    console.log('error connecting to DB')
  })

module.exports = app
