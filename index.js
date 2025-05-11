const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/pay', async (req, res) => {
  res.send("The /pay route is alive and responding.");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Ticket server running on port ${PORT}`));
