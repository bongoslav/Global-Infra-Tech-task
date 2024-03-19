import Router from "koa-router";
import { createNews, getNews } from "../controllers/news";
const router = new Router();

router.post("/news", createNews);
// TODO: results should be sortable & filterable by date & title
router.get("/news", getNews);
// TODO: update/delete multiple news
// router.patch("/news/:id", updateNews);
// router.delete("/news/:id", deleteNews);

export default router;
