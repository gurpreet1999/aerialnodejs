require("dotenv").config();
const PORT = process.env.PORT || 3000;
const express = require("express");
const app = express();
const cors = require('cors');

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import route handlers
const PartnerRoutes = require("./routes/Partner/index.js");

// Use the route handlers

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});



app.use(
  "/v1/partner",
  (req, res, next) => {
    next();
  },
  PartnerRoutes
);

// Start the server

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
