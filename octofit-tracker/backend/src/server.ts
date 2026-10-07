import express from 'express'
import mongoose from 'mongoose'
import type { ErrorRequestHandler } from 'express'
import { connectDatabase } from './config/database.js'
import apiRouter from './routes/api.js'

const app = express()
const port = 8000
const codespaceName = process.env.CODESPACE_NAME
const apiBaseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000'

app.use(express.json())
app.use(apiRouter)

app.get('/api/health', (_request, response) => {
  response.json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'connecting',
  })
})

const handleError: ErrorRequestHandler = (error, _request, response, _next) => {
  console.error('API request failed:', error)
  response.status(500).json({ error: 'Internal server error' })
}

app.use(handleError)

connectDatabase()
  .then(() => {
    app.listen(port, '0.0.0.0', () => {
      console.log(`OctoFit API listening at ${apiBaseUrl}`)
    })
  })
  .catch((error: unknown) => {
    console.error('Unable to start OctoFit API:', error)
    process.exitCode = 1
  })