import Koa from "koa";
import bodyParser from "koa-bodyparser";
import healthcheckRoutes from "./healthcheck";
import newsRoutes from "./routes/news"
import "./config/db"
require("dotenv").config();

const app = new Koa();

app.use(bodyParser());

app.use(healthcheckRoutes.routes());
app.use(newsRoutes.routes());

if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || "3000";
  app.listen(PORT, () => {
    return console.log(`Koa is listening on port: ${PORT}`);
  });
}
