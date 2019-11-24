import axios from 'axios'
import bodyParser from 'body-parser'
import cors from 'cors'
import { calculateHmac } from './hmac'
import { IPayment, IPaymentPublic } from './paymentTypes'

import express = require('express')
// Create a new express application instance
const app: express.Application = express()
app.use(bodyParser.json())
app.use(cors())

const ACCOUNT = process.env.CHECKOUT_ACCOUNT || '375917'
const SECRET = process.env.CHECKOUT_SECRET || 'SAIPPUAKAUPPIAS'
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

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min // The maximum is exclusive and the minimum is inclusive
}

const createInternalPayment = (publicCheckout: IPaymentPublic): IPayment => {
  const orderId = `order-at-time-${Date.now()}`
  const totalPrice = publicCheckout.items.reduce((accumulator, item) => {
    return accumulator + item.unitPrice
  }, 0)
  return {
    orderId,
    amount: totalPrice,
    currency: 'EUR',
    customer: publicCheckout.customer,
    items: publicCheckout.items.map((item: any) => {
      return {
        ...item,
        deliveryDate: new Date().toISOString().substring(0, 10),
        vatPercentage: 24
      }
    }),
    language: 'FI',
    reference: `${getRandomInt(10000, 99999)}`,
    stamp: orderId,
    callbackUrls: {
      cancel: 'https://pizzaadev.appspot.com/callback/cancel',
      success: 'https://pizzaadev.appspot.com/callback/success'
    },
    redirectUrls: {
      cancel: 'http://localhost:3000/cancel',
      success: 'http://localhost:3000/thanks'
    }
  }
}

app.post('/payments', async (req, res) => {
  const crypto = require('crypto')
  const nonce = crypto.randomBytes(16).toString('base64')
  const publicCheckout = req.body as IPaymentPublic
  const internalPayment = createInternalPayment(publicCheckout)
  const paymentHeaders = getPaymentHeaders(nonce, new Date().toISOString())
  const paymentSignature = calculateHmac(
    SECRET!,
    paymentHeaders,
    internalPayment
  )

  const { status, statusText, data } = await axios.post(
    '/payments',
    internalPayment,
    {
      baseURL: 'https://api.checkout.fi',
      headers: {
        ...paymentHeaders,
        'content-type': 'application/json; charset=utf-8',
        signature: paymentSignature
      }
    }
  )
  if (status === 201) {
    res.send(data)
  } else {
    res.send(statusText)
  }
})

app.get('/callback/success', (req, res) => {
  console.log('CALLBACK SUCCESS')
  console.log('query', req.query)
  res.send('CALLBACK SUCCESS')
})

app.get('/callback/cancel', (req, res) => {
  console.log('CALLBACK cancel')
  console.log('query', req.query)
  res.send('CALLBACK cancel')
})

const server = app.listen(8080, () => {
  console.log(`Example app listening at port 8080`)
})
