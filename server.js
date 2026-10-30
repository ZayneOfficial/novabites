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
let nextMealId = Math.max(...meals.map((meal) => meal.id)) + 1;

app.get("/api/meals", (req, res) => {
  res.json(meals);
});

app.get("/api/meals/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id < 1) {
    return res.status(400).json({ error: "Meal ID must be a positive integer" });
  }

  const meal = meals.find((item) => item.id === id);
  if (!meal) {
    return res.status(404).json({ error: "Meal not found" });
  }

  res.json(meal);
});

app.post("/api/meals", (req, res) => {
  const { name, price } = req.body ?? {};
  if (typeof name !== "string" || name.trim().length === 0) {
    return res.status(400).json({ error: "Meal name is required" });
  }
  if (typeof price !== "number" || !Number.isFinite(price) || price < 0) {
    return res.status(400).json({ error: "Meal price must be a non-negative number" });
  }

  const meal = { id: nextMealId++, name: name.trim(), price };
  meals.push(meal);
  res.status(201).json(meal);
});

app.put("/api/meals/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id < 1) {
    return res.status(400).json({ error: "Meal ID must be a positive integer" });
  }

  const meal = meals.find((item) => item.id === id);
  if (!meal) {
    return res.status(404).json({ error: "Meal not found" });
  }

  const { name, price } = req.body ?? {};
  if (typeof name !== "string" || name.trim().length === 0) {
    return res.status(400).json({ error: "Meal name is required" });
  }
  if (typeof price !== "number" || !Number.isFinite(price) || price < 0) {
    return res.status(400).json({ error: "Meal price must be a non-negative number" });
  }

  meal.name = name.trim();
  meal.price = price;
  res.json(meal);
});

app.patch("/api/meals/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id < 1) {
    return res.status(400).json({ error: "Meal ID must be a positive integer" });
  }

  const meal = meals.find((item) => item.id === id);
  if (!meal) {
    return res.status(404).json({ error: "Meal not found" });
  }

  const updates = req.body;
  if (
    !updates ||
    typeof updates !== "object" ||
    Array.isArray(updates) ||
    Object.keys(updates).length === 0 ||
    Object.keys(updates).some((key) => key !== "name" && key !== "price")
  ) {
    return res.status(400).json({ error: "Provide a non-empty update with only name and/or price" });
  }
  if (
    Object.hasOwn(updates, "name") &&
    (typeof updates.name !== "string" || updates.name.trim().length === 0)
  ) {
    return res.status(400).json({ error: "Meal name must be a non-empty string" });
  }
  if (
    Object.hasOwn(updates, "price") &&
    (typeof updates.price !== "number" ||
      !Number.isFinite(updates.price) ||
      updates.price < 0)
  ) {
    return res.status(400).json({ error: "Meal price must be a non-negative number" });
  }

  if (Object.hasOwn(updates, "name")) {
    meal.name = updates.name.trim();
  }
  if (Object.hasOwn(updates, "price")) {
    meal.price = updates.price;
  }
  res.json(meal);
});

app.delete("/api/meals/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id < 1) {
    return res.status(400).json({ error: "Meal ID must be a positive integer" });
  }

  const mealIndex = meals.findIndex((item) => item.id === id);
  if (mealIndex === -1) {
    return res.status(404).json({ error: "Meal not found" });
  }

  meals.splice(mealIndex, 1);
  res.status(204).end();
});

app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Request body must contain valid JSON" });
  }
  next(err);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
