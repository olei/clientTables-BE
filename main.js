import express from 'express'
import db from './mongodb/db'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import connectMongo from 'connect-mongo'
import history from 'connect-history-api-fallback'

import routes from "./routes/index"
import config from './config'

const app = express()

const MongoStore = connectMongo(session)
app.use(cookieParser())

app.use(
  session({
    name: config.session.name,
    secret: config.session.secret,
    resave: true,
    saveUninitialized: false,
    cookie: config.session.cookie,
    store: new MongoStore({
      url: config.url
    })
  })
)

app.engine('html', require('ejs').renderFile)

app.use(cookieParser())

app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')
routes(app)
// app.use(express.static(__dirname + '/views'))

console.log(process.env.NODE_ENV)
app.use(history())
app.listen(config.port)