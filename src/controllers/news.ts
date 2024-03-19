import { Context } from "koa";
import News from "../models/News";
import { SortOrder } from "mongoose";

interface NewsRequestBody {
  title: string;
  description: string;
  text: string;
}

async function getNews(ctx: Context) {
  try {
    // TODO: proper validation & error handling
    let query: any = {};

    const sortBy = (ctx.query.sortBy as string) || "date"; // default to sorting by date
    const sortOrder = ctx.query.orderBy === "desc" ? -1 : 1; // default to ascending order
    const sortOptions = { [sortBy]: sortOrder as SortOrder };

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
    const news = await News.find(query).sort(sortOptions);
    ctx.body = news;
  } catch (error) {
    console.error("Error fetching news:", error);
    ctx.status = 500;
    ctx.body = { error: "Internal Server Error" };
  }
}

async function createNews(ctx: Context) {
  try {
    // TODO: proper validation & error handling
    const { title, description, text } = ctx.request.body as NewsRequestBody;
    const newsData = {
      title,
      description,
      text,
      date: new Date(),
    };
    const news = await News.create(newsData);

    ctx.status = 201;
    ctx.body = news;
  } catch (error) {
    console.error("Error creating news:", error);
    ctx.status = 500;
    ctx.body = { error: "Internal Server Error" };
  }
}

async function updateNews(ctx: Context) {
  try {
    // TODO: proper validation & error handling
    const newsId = ctx.params.id;
    const updatedNewsData = ctx.request.body as NewsRequestBody;

    const updatedNews = await News.findByIdAndUpdate(newsId, updatedNewsData, {
      new: true,
    });

    if (!updatedNews) {
      ctx.status = 404;
      ctx.body = { error: "News item not found" };
      return;
    }

    ctx.status = 200;
    ctx.body = updatedNews;
  } catch (error) {
    console.error("Error updating news:", error);
    ctx.status = 500;
    ctx.body = { error: "Internal Server Error" };
  }
}

async function deleteNews(ctx: Context) {
  try {
    // TODO: proper validation & error handling
    const newsId = ctx.params.id;
    const deletedNews = await News.findByIdAndDelete(newsId);

    if (!deletedNews) {
      ctx.status = 404;
      ctx.body = { error: "News item not found" };
      return;
    }

    ctx.status = 200;
    ctx.body = { message: "News item deleted successfully" };
  } catch (error) {
    console.error("Error deleting news:", error);
    ctx.status = 500;
    ctx.body = { error: "Internal Server Error" };
  }
}

export { getNews, createNews, updateNews, deleteNews };
