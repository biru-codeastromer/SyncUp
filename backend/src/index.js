import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());


app.use("/auth", authRoutes);
app.use("/api/posts", postRoutes);

app.get("/", (req, res) => {
	res.send("SyncUp Backend Running!");
});


app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});