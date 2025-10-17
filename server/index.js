const express = require('express');
const app = express();
const PORT = 5000;

// A sample API endpoint
app.get('/api', (req, res) => {
  res.json({ message: "Hello from the Express server!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});