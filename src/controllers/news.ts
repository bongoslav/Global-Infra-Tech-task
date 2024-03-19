import { Context } from "koa";
import News from "../models/News";

interface NewsRequestBody {
  title: string;
  description: string;
  text: string;
}

async function getNews(ctx: Context) {
  try {
    const news = await News.find();

    ctx.body = news;
  } catch (error) {
    console.error("Error fetching news:", error);
    ctx.status = 500;
    ctx.body = { error: "Internal Server Error" };
  }
}

async function createNews(ctx: Context) {
  try {
		// TODO: proper validation
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

export { getNews, createNews };
