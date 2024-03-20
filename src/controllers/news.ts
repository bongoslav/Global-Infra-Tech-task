import { Context } from "koa";
import News from "../models/News";
import mongoose, { CastError, SortOrder } from "mongoose";

interface NewsRequestBody {
  title: string;
  description: string;
  text: string;
  date?: Date;
}

async function getNews(ctx: Context) {
  try {
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
  } catch (error: any) {
    console.error("Error fetching news:", error);
    ctx.status = 500;
    ctx.body = { error: error.message };
  }
}

async function getSingleNews(ctx: Context) {
  try {
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
  } catch (error: any) {
    console.error("Error fetching news:", error);
    ctx.status = 500;
    ctx.body = { error: error.message };
  }
}

async function createNews(ctx: Context) {
  try {
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
  } catch (error) {
    console.error("Error creating news:", error);
    ctx.status = 500;
    ctx.body = { error: "Internal Server Error" };
  }
}

async function updateNews(ctx: Context) {
  try {
    const newsId = ctx.params.id;
    const updatedNewsData = ctx.request.body as NewsRequestBody;

    const updatedNews = await News.findByIdAndUpdate(newsId, updatedNewsData, {
      new: true, // return the updated document
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

async function deleteSingleNews(ctx: Context) {
  try {
    const newsId = ctx.params.id;
    const deletedNews = await News.findByIdAndDelete(newsId);

    if (!deletedNews) {
      ctx.status = 404;
      ctx.body = { error: "News item not found" };
      return;
    }

    ctx.status = 200;
    ctx.body = { message: "News item deleted successfully" };
  } catch (error: any) {
    console.error("Error deleting news:", error);
    ctx.status = 500;
    ctx.body = { error: error.message };
  }
}

async function deleteMultipleNews(ctx: Context) {
  try {
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
          return { newsId, error: error.message };
        }
      })
    );

    const failedDeletions = deletionResults.filter((result) => !result.deleted);

    if (failedDeletions.length) {
      ctx.status = 404;
      ctx.body = { error: "Some news items could not be found or deleted" };
      return;
    }

    ctx.status = 200;
    ctx.body = { message: "All news items deleted successfully" };
  } catch (error) {
    console.error("Error deleting news:", error);
    ctx.status = 500;
    ctx.body = { error: "Internal Server Error" };
  }
}

export {
  getNews,
  getSingleNews,
  createNews,
  updateNews,
  deleteSingleNews,
  deleteMultipleNews,
};
