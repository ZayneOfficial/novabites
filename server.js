const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "NovaBites API is running"
  });
});

const meals = [
  { id: 1, name: "Chicken Burger", price: 65 },
  { id: 2, name: "Beef Burger", price: 75 },
  { id: 3, name: "Pizza", price: 100 }
];

app.get("/api/meals", (req, res) => {
  res.json(meals);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

