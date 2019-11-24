export const calculateHmac = (secret: string, params: any, body?: any) => {
  const crypto = require('crypto')
  const hmacPayload = Object.keys(params)
    .sort()
    .map(key => [key, params[key]].join(':'))
    .concat(body ? JSON.stringify(body) : '')
    .join('\n')
  return crypto
    .createHmac('sha256', secret)
    .update(hmacPayload)
    .digest('hex')
}
