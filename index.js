const express = require('express');
const Stripe = require('stripe');
const app = express();
const cors = require('cors');

app.use(cors());
console.log("Stripe key present:", !!process.env.STRIPE_SECRET_KEY);
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

app.get('/pay', async (req, res) => {
  const { email, ...tickets } = req.query;
  const items = [];

  const priceMap = {
    "3DayTicket": "price_1RNbaORsTRQij9eYlnTNO5YA",
    "AdultSaturdayTicket": "price_1RNbb3RsTRQij9eYgKmUWrK9",
    "AdultSundayTicket": "price_1RNbbjRsTRQij9eY0k1Tk2At",
    "AdultMondayTicket": "price_1RNbcURsTRQij9eYGyGXw1t2",
    "ChildSaturdayTicket": "price_1RNbe6RsTRQij9eYFCd9O53y",
    "ChildSundayTicket": "price_1RNbevRsTRQij9eY1lGOztqg",
    "ChildMondayTicket": "price_1RNbfHRsTRQij9eYPm1g9chR",
    "Disabled3DayTicket": "price_1RNbgSRsTRQij9eYGdVIPFvy",
    "DisabledSaturdayTicket": "price_1RNbhDRsTRQij9eYSklKbIRI",
    "DisabledSundayTicket": "price_1RNbhXRsTRQij9eYOOUfpSb1",
    "DisabledMondayTicket": "price_1RNbhsRsTRQij9eYlNCbmq0y"
  };

  for (const [key, value] of Object.entries(tickets)) {
    if (priceMap[key]) {
      items.push({
        price: priceMap[key],
        quantity: parseInt(value)
      });
    }
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    customer_email: email,
    line_items: items,
    success_url: 'https://yourwebsite.com/success',
    cancel_url: 'https://yourwebsite.com/cancel'
  });

  res.redirect(303, session.url);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Ticket server running on port ${PORT}`));
