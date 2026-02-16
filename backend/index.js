import express from "express";
import uploadRoutes from "./routes/uploadRoutes.js";

const app = express();

const PORT = 3000;


app.use(express.json());


app.use("/api", uploadRoutes);

app.get("/api/test", (req, res) => {
  return res.json("health is good");
});

app.listen(PORT, () => {
  console.log("server is listening");
});
