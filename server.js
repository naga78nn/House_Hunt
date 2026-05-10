// HOUSEHUNT - Your Go-To Rental App (Simple MERN Prototype)
// Run with: node server.js
// Then open: http://localhost:3000

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 MongoDB connection
mongoose
  .connect("mongodb://127.0.0.1:27017/househunt")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ Mongo Error:", err));

// 🔹 Property Schema
const propertySchema = new mongoose.Schema({
  title: String,
  description: String,
  location: String,
  price: Number,
  owner: String,
});

const Property = mongoose.model("Property", propertySchema);

// 🔹 Routes
app.get("/", (req, res) => {
  res.send(`
  <!DOCTYPE html>
  <html>
  <head>
    <title>HouseHunt - Rental App</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body { font-family: Arial; background:#ffc0cb; margin:0; padding:0; }
      header { background:#e75480; color:#fff; padding:15px; text-align:center; }
      .container { max-width:800px; margin:30px auto; background:#fff; padding:20px; border-radius:10px; box-shadow:0 0 10px rgba(0,0,0,0.1);}
      input, textarea { width:100%; padding:10px; margin:10px 0; border:1px solid #ccc; border-radius:5px;}
      button { background:#e75480; color:white; padding:10px 15px; border:none; border-radius:5px; cursor:pointer;}
      button:hover { background:#c71585; }
      .delete-all { background:#ff4d4d; margin-top:10px; }
      .delete-all:hover { background:#cc0000; }
      .property { border-bottom:1px solid #ddd; padding:10px 0; }
      h2 { color:#e75480; }
    </style>
  </head>
  <body>
    <header>
      <h1>🏠 HouseHunt</h1>
      <p>Your Go-To Rental App</p>
    </header>
    <div class="container">
      <h2>Add Property</h2>
      <form id="propertyForm">
        <input type="text" id="title" placeholder="Title" required>
        <textarea id="description" placeholder="Description"></textarea>
        <input type="text" id="location" placeholder="Location" required>
        <input type="number" id="price" placeholder="Price (₹)" required>
        <input type="text" id="owner" placeholder="Owner Name" required>
        <button type="submit">Add Property</button>
      </form>

      <button class="delete-all" id="clearAllBtn">🗑️ Delete All Properties</button>

      <h2>Available Properties</h2>
      <div id="propertyList"></div>
    </div>

    <script>
      const form = document.getElementById("propertyForm");
      const list = document.getElementById("propertyList");
      const clearAllBtn = document.getElementById("clearAllBtn");

      async function loadProperties() {
        const res = await fetch("/api/properties");
        const data = await res.json();
        list.innerHTML = data.length ? data.map(p => \`
          <div class="property">
            <h3>\${p.title}</h3>
            <p>\${p.description}</p>
            <p><b>Location:</b> \${p.location}</p>
            <p><b>Price:</b> ₹\${p.price}</p>
            <p><b>Owner:</b> \${p.owner}</p>
          </div>
        \`).join("") : "<p>No properties available.</p>";
      }

      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const property = {
          title: title.value,
          description: description.value,
          location: location.value,
          price: price.value,
          owner: owner.value
        };
        await fetch("/api/properties", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(property)
        });
        form.reset();
        loadProperties();
      });

      clearAllBtn.addEventListener("click", async () => {
        if (confirm("Are you sure you want to delete ALL properties?")) {
          await fetch("/api/properties", { method: "DELETE" });
          loadProperties();
        }
      });

      loadProperties();
    </script>
  </body>
  </html>
  `);
});

// 🔹 API endpoints
app.get("/api/properties", async (req, res) => {
  const properties = await Property.find();
  res.json(properties);
});

app.post("/api/properties", async (req, res) => {
  const property = new Property(req.body);
  await property.save();
  res.json({ message: "Property added!" });
});

// 🔹 DELETE route - Remove all properties
app.delete("/api/properties", async (req, res) => {
  await Property.deleteMany({});
  res.json({ message: "All properties deleted!" });
});

// 🔹 Server start
const PORT = 3000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
