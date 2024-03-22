import Koa, { Context } from "koa";
import bodyParser from "koa-bodyparser";
import newsRoutes from "./routes/news";
import requestLogger from "./middlewares/logger";
import connectDB from "./config/db";
require("dotenv").config();

const app = new Koa();

app.use(bodyParser());
if (process.env.NODE_ENV === "development") {
  app.use(requestLogger);
}

app.use(newsRoutes.routes());
app.use(async (ctx: Context, next) => {
  try {
    await next();
  } catch (error: any) {
    console.error("Internal Server Error:", error);
    ctx.status = 500;
    ctx.body = { error: "Internal Server Error" };
  }
});

if (process.env.NODE_ENV !== "test") {
  connectDB();
  const PORT = process.env.PORT || "3000";
  app.listen(PORT, () => {
    console.log(`🟢 Node is listening on port: ${PORT}`);
  });
}

export default app;
