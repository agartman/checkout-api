import axios from 'axios'
import bodyParser from 'body-parser'
import { calculateHmac } from './hmac'
import { IPayment } from './paymentTypes'

import express = require('express')
// Create a new express application instance
const app: express.Application = express()
app.use(bodyParser.json())

const ACCOUNT = '375917'
const SECRET = 'SAIPPUAKAUPPIAS'
const getPaymentHeaders = (nonce: string, timestamp: string) => {
  return {
    'checkout-account': ACCOUNT,
    'checkout-algorithm': 'sha256',
    'checkout-method': 'POST',
    'checkout-nonce': nonce,
    'checkout-timestamp': timestamp
  }
}

app.get('/', (req, res) => {
  console.log(req.url)
  res.send('Hello World!!')
})

app.post('/payments', async (req, res) => {
  const crypto = require('crypto')
  const nonce = crypto.randomBytes(16).toString('base64')
  const body = req.body as IPayment
  const paymentHeaders = getPaymentHeaders(nonce, new Date().toISOString())
  const paymentSignature = calculateHmac(SECRET, paymentHeaders, body)

  const { status, statusText, data } = await axios.post('/payments', body, {
    baseURL: 'https://api.checkout.fi',
    headers: {
      ...paymentHeaders,
      'content-type': 'application/json; charset=utf-8',
      signature: paymentSignature
    }
  })
  if (status === 201) {
    res.send(data)
  } else {
    res.send(statusText)
  }
})

app.get('/success', (req, res) => {
  console.log('SUCCESS')
  console.log(JSON.stringify(req))
  res.send('Success')
})

app.get('/cancel', (req, res) => {
  console.log('CANCEL')
  console.log(JSON.stringify(req))
  res.send('Canceled')
})

app.get('/callback', (req, res) => {
  console.log('CALLBACK')
  console.log(JSON.stringify(req))
  res.send('Canceled')
})

const server = app.listen(8080, () => {
  console.log(`Example app listening at port 8080`)
})
