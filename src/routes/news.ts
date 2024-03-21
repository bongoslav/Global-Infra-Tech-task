import Router from "koa-router";
import {
  createNews,
  deleteMultipleNews,
  deleteSingleNews,
  getNews,
  getSingleNews,
  updateNews,
  updateNewsProperty,
} from "../controllers/news";
import {
  validateRequiredNewsInput,
  validatePatchNewsInput,
} from "../middlewares/validation";
const router = new Router({ prefix: "/api" });

router.post("/news", validateRequiredNewsInput, createNews);
router.get("/news/:id", getSingleNews);
router.get("/news", getNews);
router.put("/news/:id", validateRequiredNewsInput, updateNews);
router.patch("/news/:id", validatePatchNewsInput, updateNewsProperty);
router.delete("/news/:id", deleteSingleNews);
router.delete("/news", deleteMultipleNews);

export default router;
