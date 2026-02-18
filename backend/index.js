import express from "express";
import uploadRoutes from "./routes/uploadRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

const app = express();

const PORT = process.env.PORT || 8000;


app.use(express.json());


app.use("/api", uploadRoutes);
app.use("/api", chatRoutes);

app.get("/api/test", (req, res) => {
  return res.json("health is good");
});

app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});
