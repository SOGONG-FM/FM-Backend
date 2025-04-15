const express = require("express");
const app = express();
const authRoutes = require("./router/authRoutes");
const postRoutes = require("./router/postRoutes");
const setupSwagger = require("./docs/swagger");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger");

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/posts", postRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(5000, () => {
  console.log("Server started on http://192.168.1.27:5000");
});

app.get("/", (req, res) => {
  res.send("정상 실행중");
});

setupSwagger(app);
