import session from 'express-session'

export const sessionConfig = session({
  secret: process.env.SESSION_SECRET || 'supersecretkey',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true
  }
})
