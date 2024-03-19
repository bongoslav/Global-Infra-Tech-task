import Router from "koa-router";
import {
  createNews,
  deleteNews,
  getNews,
  updateNews,
} from "../controllers/news";
const router = new Router();

router.post("/news", createNews);
router.get("/news", getNews);
router.patch("/news/:id", updateNews);
router.delete("/news/:id", deleteNews);

export default router;
