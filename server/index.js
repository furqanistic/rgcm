import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import path from 'path'

import auditRoute from './routes/auditlog.js'
import authRoute from './routes/auth.js'
import bookingRoute from './routes/booking.js'
const __dirname = path.resolve()
const app = express()
app.use(cors())
dotenv.config()
app.use(cookieParser())
app.use(express.json())
// app.use(
//   cors({
//     origin: '*',
//     credentials: true,
//   })
// )

app.use('/api/audit/', auditRoute)
app.use('/api/booking/', bookingRoute)
app.use('/api/auth/', authRoute)

app.use(express.static(path.join(__dirname, '/client/dist')))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/dist', 'index.html'))
})

const connect = () => {
  mongoose
    .connect(process.env.MONGKEY)
    .then(() => {
      console.log('Successfully connected')
    })
    .catch((err) => console.log(err))
}
app.use((err, req, res, next) => {
  const status = err.status || 500
  const message = err.message || 'Something went wrong'
  return res.status(status).json({
    success: false,
    status,
    message,
  })
})

app.listen(process.env.PORT || 5000, async () => {
  connect()
  console.log('Database is loading...')
})
