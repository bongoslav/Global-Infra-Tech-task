import Koa from "koa";
import bodyParser from "koa-bodyparser";
import newsRoutes from "./routes/news";
import "./config/db";
require("dotenv").config();

const app = new Koa();

app.use(bodyParser());
// TODO: logger

app.use(newsRoutes.routes());

if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || "3000";
  app.listen(PORT, () => {
    return console.log(`Node is listening on port: ${PORT}`);
  });
}
