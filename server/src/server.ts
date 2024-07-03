import express, { Request, Response } from "express";
import * as path from "path";
import cors from 'cors';

// Create Express server
const app = express();
const PORT = process.env.PORT || 8080;

app.use(
  cors({
    origin: "http://localhost:8000",
    methods: ["GET", "POST"],
  })
);

const dataFilePath = path.resolve(__dirname, "data.json"); // Adjust path as per your project structure
const jsonData = require(dataFilePath); // Import JSON data

// Routes
app.get("/v1/battery", (req: Request, res: Response) => {
  res.json(jsonData);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
