const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const path = require("path");
const { swaggerUi, swaggerDocs } = require("./swaggerConfig");

const app = express();

app.use(express.static(path.join(__dirname, "..", "public")));
app.use(cors());
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/api", routes);

app.get("/", (req, res) => {
  return res
    .status(200)
    .json(
      "Api funcionando! Vá para /api/users (Documentação da API disponível em /api-docs)"
    );
});

module.exports = app;
