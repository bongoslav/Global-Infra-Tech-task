import Router from "koa-router";
import {
  createNews,
  deleteMultipleNews,
  deleteSingleNews,
  getNews,
  getSingleNews,
  updateNews,
} from "../controllers/news";
import { validateNewsInput } from "../middleware/validation/validation";
const router = new Router({prefix: '/api'});

router.post("/news", validateNewsInput, createNews);
router.get("/news/:id", getSingleNews);
router.get("/news", getNews);
router.patch("/news/:id", validateNewsInput, updateNews);
router.delete("/news/:id", deleteSingleNews);
router.delete("/news", deleteMultipleNews);

export default router;
