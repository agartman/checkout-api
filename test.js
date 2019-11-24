const headers = {
  date: "Thu, 14 Nov 2019 12:42:46 GMT",
  "content-type": "application/json; charset=utf-8",
  "content-length": "31641",
  connection: "close",
  "x-dns-prefetch-control": "off",
  "x-frame-options": "SAMEORIGIN",
  "strict-transport-security": "max-age=15552000; includeSubDomains",
  "x-download-options": "noopen",
  "x-content-type-options": "nosniff",
  "x-xss-protection": "1; mode=block",
  "cof-request-id": "e60b37fb-2b3e-42c6-b243-de928f311be3",
  "checkout-account": "375917",
  "checkout-algorithm": "sha256",
  "checkout-method": "POST",
  "checkout-transaction-id": "b5039d68-06e0-11ea-85a7-bbb8fefa2c7e",
  signature: "6a1c67efb70869959e746b1646cd8ccb9688bccd4b80c95730c7c449619bd8dd"
};

Object.keys(headers).forEach(key => {
  if (key.indexOf("checkout-") !== 0) {
    delete headers[key];
  }
});
console.log(headers);
