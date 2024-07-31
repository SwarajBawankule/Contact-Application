const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const port = 3003;

const app = express();

// Middleware to serve static files and parse URL-encoded bodies
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/contact')
  .then(() => console.log("MongoDB connection successful"))
  .catch(err => console.error("MongoDB connection error:", err));

// Define a schema and model for the contact form data
const userSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  phone: String,
  country: String,
  message: String
});

const Users = mongoose.model("User", userSchema);

// Serve the HTML form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle form submission
app.post('/post', async (req, res) => {
  const { firstname, lastname, phone, country, message } = req.body;
  const user = new Users({
    firstname,
    lastname,
    phone,
    country,
    message
  });
  await user.save();
  console.log(user);
  res.send("Form Submission Successful");
});

// Start the server
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
