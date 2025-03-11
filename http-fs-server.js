const express = require('express');
const app = express();
const port = 9090;

app.use(express.json());

app.get('/readdir/:path', async (req, res) => {
  res.json([
    {
      name: "file1"
    },
    {
      name: "file2"
    }
  ]);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
