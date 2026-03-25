require('dotenv').config()

const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  methodOverride = require('method-override'),
  passport = require('passport'),
  localStrategy = require('passport-local'),
  User = require('./models/user'),
  flash = require('connect-flash'),
  session = require('express-session'),
  path = require('path')

//requiring routes
const kostRenderRoutes = require('./routes/kost/render')
const kostApiRoutes = require('./routes/kost/api')
const commentRenderRoutes = require('./routes/comment/render')
const commentApiRoutes = require('./routes/comment/api')
const reviewRenderRoutes = require('./routes/reviews/render')
const reviewApiRoutes = require('./routes/reviews/api')
const indexRoutes = require('./routes/auth')
const userRenderRoutes = require('./routes/users/render')
const userApiRoutes = require('./routes/users/api')

const connectDB = require('./config/db')
const { registerGracefulShutdown } = require('./utils/gracefulShutdown')

// database setup cloud
connectDB()

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.use(express.static(path.join(__dirname, 'public')))
app.use(methodOverride('_method'))
app.set('view engine', 'ejs')
app.use(flash())

//PASSPORT CONFIGURATION

const sessionConfig = {
  name: 'session',
  secret: process.env.SECRET || 'thisshouldbeabettersecret!',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
    // 1000 = 1000 milidetik dalam 1 detik
    // 60 = 60 detik dalam 1 menit
    // 60 = 60 menit dalam 1 jam
    // 1 = 1 jam
    expires: Date.now() + 1000 * 60 * 60 * 1,
    maxAge: 1000 * 60 * 60 * 1,
  },
}

app.use(session(sessionConfig))

app.use(passport.initialize()) //passing ke app use
app.use(passport.session()) //passing ke app use
passport.use(new localStrategy(User.authenticate())) //passport.authenticate << untuk itu
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

//END

//MIDDLEWARE//

app.use(function (req, res, next) {
  //passing ke app use
  res.locals.currentUser = req.user //untuk display user di nav -- nama currentUser bisa apa aja
  res.locals.error = req.flash('error')
  res.locals.success = req.flash('success')
  app.locals.moment = require('moment') //moment configuration
  next()
})

app.use(flash())

//END//

//ROUTERS
app.use('/', indexRoutes, userRenderRoutes, userApiRoutes) //parameter pertama akan menimpa url
app.use('/kost', kostRenderRoutes)
app.use('/kost', kostApiRoutes)
app.use('/kost/:id/comment', commentRenderRoutes)
app.use('/kost/:id/comment', commentApiRoutes)
app.use('/kost/:id/reviews', reviewRenderRoutes)
app.use('/kost/:id/reviews', reviewApiRoutes)

// Global error handler (keep minimal)
app.use((err, req, res, _next) => {
  console.error(err && err.stack ? err.stack : err)
  if (res.headersSent) {
    return _next(err)
  }
  const status = err.status || 500
  const message = status === 500 ? 'Internal server error' : err.message
  if (req.accepts('html')) {
    req.flash('error', message)
    return res.redirect('back')
  }
  res.status(status).json({ error: message })
})

// ** 404 not found page
app.all('*', (req, res) => {
  res.status(404).send('404 Not Found')
})

///server

const PORT = process.env.PORT || 5001

const server = app.listen(PORT, () => {
  console.log(`Server Running in ${process.env.NODE_ENV} mode on port ${PORT}`)
})

// Register graceful shutdown hooks
registerGracefulShutdown({
  server,
  mongoose,
  timeoutMs: parseInt(process.env.SHUTDOWN_TIMEOUT || '10000', 10),
})
