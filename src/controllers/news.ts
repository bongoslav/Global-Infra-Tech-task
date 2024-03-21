import { Context } from "koa";
import News from "../models/News";
import mongoose, { SortOrder } from "mongoose";

export interface NewsRequestBody {
  title: string;
  description: string;
  text: string;
  date?: Date;
}

async function getNews(ctx: Context) {
  let query: any = {};
  let sortOrder;

  let sortBy = ctx.query.sortBy as string;
  if (ctx.query.orderBy === "asc") {
    sortOrder = 1;
  } else if (ctx.query.orderBy === "desc") {
    sortOrder = -1;
  }
  const sortOptions = {
    [sortBy]: sortOrder as SortOrder,
  };

  if (ctx.query.date) {
    // filter for the given `day` (exclude the H:M:S)
    const startDate = new Date(ctx.query.date as string);
    startDate.setUTCHours(0, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 1);
    query.date = { $gte: startDate, $lt: endDate };
  }
  if (ctx.query.title) {
    query.title = { $regex: ctx.query.title, $options: "i" };
  }

  // if return dataset is large we can use `.cursor()` & iterate so it isn't loaded in memory
  let newsQuery = News.find(query);
  if (sortBy) newsQuery = newsQuery.sort(sortOptions);
  const news = await newsQuery.exec();

  ctx.body = news;
}

async function getSingleNews(ctx: Context) {
  const newsId = ctx.params.id;

  if (!mongoose.Types.ObjectId.isValid(newsId)) {
    ctx.status = 400;
    ctx.body = { error: "Invalid news ID" };
    return;
  }

  const news = await News.findById(newsId);

  if (!news) {
    ctx.status = 404;
    ctx.body = { error: "News not found" };
    return;
  }

  ctx.status = 200;
  ctx.body = news;
}

async function createNews(ctx: Context) {
  // prettier-ignore
  const { title, description, text, date } = ctx.request.body as NewsRequestBody;
  const newsData: NewsRequestBody = {
    title,
    description,
    text,
  };

  newsData.date = date ? date : new Date();
  const news = await News.create(newsData);

  ctx.status = 201;
  ctx.body = news;
}

async function updateNews(ctx: Context) {
  const newsId = ctx.params.id;
  const updatedNewsData = ctx.request.body as NewsRequestBody;

  if (!mongoose.Types.ObjectId.isValid(newsId)) {
    ctx.status = 400;
    ctx.body = { error: "Invalid news ID" };
    return;
  }

  const updatedNews = await News.findByIdAndUpdate(newsId, updatedNewsData, {
    new: true, // return the updated document
  });

  if (!updatedNews) {
    ctx.status = 404;
    ctx.body = { error: "News not found" };
    return;
  }

  ctx.status = 200;
  ctx.body = updatedNews;
}

async function updateNewsProperty(ctx: Context) {
  const newsId = ctx.params.id;
  const updatedFields = ctx.request.body as Partial<NewsRequestBody>;

  if (!mongoose.Types.ObjectId.isValid(newsId)) {
    ctx.status = 400;
    ctx.body = { error: "Invalid news ID" };
    return;
  }

  const updatedNews = await News.findByIdAndUpdate(
    newsId,
    { $set: updatedFields },
    { new: true }
  );

  if (!updatedNews) {
    ctx.status = 404;
    ctx.body = { error: "News not found" };
    return;
  }

  ctx.status = 200;
  ctx.body = updatedNews;
}

async function deleteSingleNews(ctx: Context) {
  const newsId = ctx.params.id;
  const deletedNews = await News.findByIdAndDelete(newsId);

  if (!deletedNews) {
    ctx.status = 404;
    ctx.body = { error: "News not found" };
    return;
  }

  ctx.status = 200;
  ctx.body = { message: "News deleted successfully" };
}

async function deleteMultipleNews(ctx: Context) {
  const { newsIds } = ctx.request.body as { newsIds: string[] };

  if (!Array.isArray(newsIds)) {
    ctx.status = 400;
    ctx.body = { error: "News IDs must be provided as an array" };
    return;
  }

  const deletionResults = await Promise.all(
    newsIds.map(async (newsId) => {
      // handle if cast to ObjectId failed (e.g. "123" passed as newsId)
      try {
        const result = await News.findByIdAndDelete(newsId);
        return { newsId, deleted: !!result };
      } catch (error: any) {
        return { newsId };
      }
    })
  );

  const failedDeletions = deletionResults.filter((result) => !result.deleted);

  if (failedDeletions.length) {
    ctx.status = 404;
    ctx.body = { error: "Some news could not be found or deleted" };
    return;
  }

  ctx.status = 200;
  ctx.body = { message: "All news deleted successfully" };
}

export {
  getNews,
  getSingleNews,
  createNews,
  updateNews,
  updateNewsProperty,
  deleteSingleNews,
  deleteMultipleNews,
};
