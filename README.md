# Privat24 client

A simple client for privat24 banking

```javascript
const Privat = require('privat24-client');

const card = new Privat({
    merchantId: '123321',
    password: 'asdfe2dadfe34dasdf',
    cardnumber: '12332123123123',
    country: 'UA'
});

card.balance()
    .then(result => {
        // balance result
    });

card.statements(startDate, endDate)
    .then(result => {
        // bank statements for given card
    });
```
