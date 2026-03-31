import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connect } from "mongoose";

dotenv.config();

const app = express();
connectDB();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("EduSync API running");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});