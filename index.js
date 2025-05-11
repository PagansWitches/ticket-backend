const express = require('express');
const cors = require('cors');
const Stripe = require('stripe');
const app = express();

app.use(cors());

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

app.get('/pay', async (req, res) => {
  try {
    console.log("Incoming request:", req.query);
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
      if (priceMap[key] && parseInt(value)) {
        items.push({
          price: priceMap[key],
          quantity: parseInt(value)
        });
      }
    }

    console.log("Stripe line items:", items);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: email,
      line_items: items,
      success_url: 'https://yourwebsite.com/success',
      cancel_url: 'https://yourwebsite.com/cancel'
    });

    res.redirect(303, session.url);
  } catch (err) {
    console.error("Stripe error:", err);
    res.status(500).send("Something went wrong.");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Ticket server running on port ${PORT}`));
