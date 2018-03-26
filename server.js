import express from 'express'
import axios from 'axios'
import cors from 'cors'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import Session from 'session'

const PORT = 3003

const session = new Session()

const CUSTOMISATION_BACKEND_BASE_URL = 'http://backend.customisation:3002/api'

const GET = (url) => axios.get(url)
  .then(({ data }) => data)
  .catch(({ error, errorCode }) => ({ error, errorCode }))

const POST = (url, data) => axios.post(url, data)
  .then(({ data }) => data)
  .catch(({ error, errorCode }) => ({ error, errorCode }))

const app = express()

app.use(cors())

app.use(bodyParser.json())

app.use(cookieParser())

const verifyPermission = ({ merchantId, username, sessionId }) => {
  const userDataFromSession = session.getUserDataFromSession(sessionId)
  if (
    userDataFromSession &&
    merchantId === userDataFromSession.merchantId &&
    username === userDataFromSession.username
  ) {
    return true
  }
  return false
}

// Forward verified requests to customisation backend
app.get('/api/theme-preview', async function (req, res) {
  const { previewToken } = req.query
  try {
    const data = await GET(`${CUSTOMISATION_BACKEND_BASE_URL}/theme-preview?previewToken=${previewToken}`)
    return res.status(200).json(data)
  } catch (e) {
    return res.status(400).json(e)
  }
})

// Forward verified requests to customisation backend
app.post('/api/theme-preview', async function (req, res) {
  const { previewToken, themeSettings, sectionSettings } = req.body
  try {
    const data = await POST(`${CUSTOMISATION_BACKEND_BASE_URL}/theme-preview`, { previewToken, themeSettings, sectionSettings })
    return res.status(200).json(data)
  } catch (e) {
    return res.status(400).json(e)
  }
})

// Forward verified requests to customisation backend
app.get('/api/preview-token', async function (req, res) {
  const { merchantId, sessionId, username } = req.cookies
  if (!verifyPermission({ merchantId, sessionId, username })) return res.sendStatus(401)
  try {
    const data = await GET(`${CUSTOMISATION_BACKEND_BASE_URL}/preview-token?merchantId=${merchantId}`)
    return res.status(200).json(data)
  } catch (e) {
    return res.status(401).json(e)
  }
})

app.post('/api/login', function (req, res) {
  const { username, password } = req.body
  if (username === 'tri' && password === '12345') { // mock username & password
    const merchantId = '12345' // mock merchantId
    const sessionId = session.createNewSession({ username, merchantId })
    return res.status(200).json({
      sessionId,
      merchantId,
      username
    })
  }
  const { merchantId, username: _username, sessionId } = req.cookies
  if (verifyPermission({ merchantId, username: _username, sessionId })) {
    return res.status(200).json({
      sessionId,
      merchantId,
      username
    })
  }
  return res.status(401).json({ error: 'Unauthorized', errorCode: '401' })
})

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})
