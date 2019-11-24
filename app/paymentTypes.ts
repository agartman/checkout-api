export interface IItem {
  unitPrice: number // 1590,
  units: number // 1,
  vatPercentage: number // 24,
  productCode: string // "#927502759",
  deliveryDate: string // "2018-03-07",
  description: string // "Cat ladder",
  category: string // "Pet supplies",
  merchant: string // "375917",
  stamp: string // "29858472952",
  reference: string // "9187445"
  orderId: string
}

export interface ICustomer {
  email: string // "erja.esimerkki@example.org",
  firstName: string // "Erja",
  lastName: string // "Esimerkki",
  phone: string // "+358501234567",
  vatId: string // "FI12345671"
}

export interface IAddress {
  streetAddress: string // "Eteläpuisto 2 C",
  postalCode: string // "33200",
  city: string // "Tampere",
  county: string // "Pirkanmaa",
  country: string // "FI"
}

export interface IUrls {
  success: string // "https://ecom.example.org/success",
  cancel: string // "https://ecom.example.org/cancel"
}

export interface IPayment {
  stamp: string
  reference: string // "9187445",
  amount: number // 1590,
  currency: string // "EUR",
  language: string // "FI",
  orderId: string // "FI",
  items: IItem[]
  customer: ICustomer
  deliveryAddress: IAddress
  invoicingAddress: IAddress
  redirectUrls: IUrls
  callbackUrls: IUrls
}
/*  stamp: "unique-identifier-for-merchant46",
    reference: "37591",
    amount: 1525,
    currency: "EUR",
    language: "FI",
    items: [
      {
        unitPrice: 1525,
        units: 1,
        vatPercentage: 24,
        productCode: "#1234",
        deliveryDate: "2018-09-01"
      }
    ],
    customer: {
      email: "test.customer@example.com"
    },
    redirectUrls: {
      success: "https://ecom.example.com/cart/success",
      cancel: "https://ecom.example.com/cart/cancel"
    }
  };*/
