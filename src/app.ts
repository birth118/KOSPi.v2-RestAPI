import express from 'express'
import { json } from 'body-parser'
//import passport from 'passport'
require('express-async-errors')
import cookieSession from 'cookie-session'
import cors from 'cors'

import {
  signOutRoute,
  signUpRoute,
  currentUserRoute,
  signInRoute,
  googleAuth,
  // googleAuthRedirect,
  //googlePassport,
} from './routes/users/'

import { test } from './routes/mytest'

import {
  stockCodeDelete,
  stockCodeList,
  stockCodeNew,
  stockCodeShow,
  stockCodeUpdate,
  stockCodeSummary,
  stockCodeCurrency,
} from './routes/stockcodes'

import { transactList, transactNew, transactAllByDate } from './routes/transact'

import { NotFoundError } from './errors/custom-error'
import { errorHanlder } from './middleware/error-handler'
import { currentUser } from './middleware/current-user'

require('./apis/passport')

const app = express()

//app.set('trust proxy', true) // Express sits behind trustful proxy

app.use(json())

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
}

app.use(cors(corsOptions))

// ----> For cookie-session npm ( session is only kept in client side )
// ----> It supports req.session.jwt
app.use(
  cookieSession({
    name: 'kospi-session',
    signed: false,
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
    secure: false,
  })
)

// --> For express-session npm.
// --> Unale to support req.session.jwt

// const SECRET_STRING = 'alittlesecret'
// import session from 'express-session'
// app.use(
//   session({
//     secret: SECRET_STRING,
//     resave: false,
//     saveUninitialized: false,
//     cookie: { secure: false },
//   })
// )

/* PASSPORT is no longer used */

// PASSPORT INITIALISATION & session
// app.use(passport.initialize())

// // --> TO bind to req.session.passport. In case req.session.jwt, not effective
// app.use(passport.session())

// Explicitly run to get currentUser
app.use(currentUser)

// Routes
app.use(signOutRoute)
app.use(signUpRoute)
app.use(currentUserRoute)
app.use(signInRoute)
//app.use(googlePassport)
//app.use(googleAuthRedirect)
app.use(googleAuth)

app.use(stockCodeDelete)
app.use(stockCodeList)
app.use(stockCodeNew)
app.use(stockCodeShow)
app.use(stockCodeUpdate)
app.use(stockCodeSummary)
app.use(stockCodeCurrency)

app.use(transactList)
app.use(transactNew)
app.use(transactAllByDate)

app.use(test)

// 4: after checking all valid router
app.all('*', async (req, res) => {
  throw new NotFoundError('Route Not Found')
})

app.use(errorHanlder)

export default app
