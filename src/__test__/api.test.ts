import app from "../server";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose, { ObjectId } from "mongoose";
import News from "../models/News";
import supertest from "supertest";
import { NewsRequestBody } from "../controllers/news";
let mongoServer: MongoMemoryServer;

interface INewsResponse {
  _id: ObjectId;
  title: string;
  description: string;
  text: string;
  date: Date;
}

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  // clear existing data before each test
  await News.deleteMany({});
});

describe("Database Connection", () => {
  it("should connect to the database", () => {
    expect(mongoose.connection.readyState).toBe(1); // 1 means connected
  });
});

describe("GET /api/news", () => {
  const server = app.callback();
  const request = supertest(server);
  const newsData = [
    {
      title: "Test Title 1",
      description: "Description 1",
      text: "Text 1",
      date: "2024-03-25",
    },
    {
      title: "Test Title 2",
      description: "Description 2",
      text: "Text 2",
      date: "2024-03-20",
    },
  ];

  it("should return status 200 with all news articles", async () => {
    await News.create(newsData);
    const response = await request.get("/api/news");

    const newsArr = response.body as INewsResponse[];
    expect(response.status).toBe(200);
    expect(newsArr.length).toBe(2);
    expect(newsArr[0].title).toBe(newsData[0].title);
  });

  it("should return status 200 with filtered articles by date", async () => {
    await News.create(newsData);
    const response = await request.get("/api/news?date=2024-03-20");

    const newsArr = response.body as INewsResponse[];
    expect(response.status).toBe(200);
    expect(newsArr.length).toBe(1);
    expect(newsArr[0].title).toBe(newsData[1].title);
  });

  it("should return status 200 with filtered articles by title", async () => {
    await News.create(newsData);
    const response = await request.get("/api/news?title=Test%20Title%201");

    const newsArr = response.body as INewsResponse[];
    expect(response.status).toBe(200);
    expect(newsArr.length).toBe(1);
    expect(newsArr[0].title).toBe(newsData[0].title);
  });

  it("should return status 200 with sorted articles by date in ascending order", async () => {
    await News.create(newsData);
    const response = await request.get("/api/news?sortBy=date&orderBy=asc");

    const newsArr = response.body as INewsResponse[];
    expect(response.status).toBe(200);
    expect(newsArr.length).toBe(2);
    expect(newsArr[0].title).toBe(newsData[1].title);
  });

  it("should return status 200 with sorted articles by title in descending order", async () => {
    await News.create(newsData);
    const response = await request.get("/api/news?sortBy=title&orderBy=desc");

    const newsArr = response.body as INewsResponse[];
    expect(response.status).toBe(200);
    expect(newsArr.length).toBe(2);
    expect(newsArr[0].title).toBe(newsData[1].title);
  });
});

describe("GET /api/news/:id", () => {
  const server = app.callback();
  const request = supertest(server);
  const newsData = [
    {
      _id: "65fb5716a99861ca125601ec",
      title: "Test Title 1",
      description: "Description 1",
      text: "Text 1",
      date: "2024-03-25",
    },
    {
      _id: "65fb5c6c3565aa4e7c69e1d6",
      title: "Test Title 2",
      description: "Description 2",
      text: "Text 2",
      date: "2024-03-20",
    },
  ];

  it("should return status 200 with correct news", async () => {
    await News.create(newsData);
    const response = await request.get(`/api/news/${newsData[0]._id}`);

    const news = response.body as INewsResponse;
    expect(response.status).toBe(200);
    expect(news).not.toBe(typeof Array);
    expect(news.title).toBe(newsData[0].title);
  });

  it("should return status 400 with error message", async () => {
    await News.create(newsData);
    const response = await request.get(`/api/news/${newsData[0]._id}1`);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Invalid news ID");
  });

  it("should return status 404 with error message", async () => {
    await News.create(newsData);
    const response = await request.get(
      `/api/news/${newsData[0]._id.replace("a", "e")}`
    );

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("News not found");
  });
});

describe("POST /api/news/", () => {
  const server = app.callback();
  const request = supertest(server);

  it("should create a news document and return status 201 with the created news", async () => {
    const newsData = {
      title: "Test Title 1",
      description: "Description 1",
      text: "Text 1",
      date: new Date().toISOString(),
    };
    const response = await request.post("/api/news").send(newsData);

    expect(response.status).toBe(201);
    const createdNews = await News.findOne({ title: newsData.title });
    expect(createdNews).toBeTruthy();
    expect(response.body.title).toBe(createdNews!.toJSON().title);
  });

  it("should create a news document and return status 201 with the created news - date not given", async () => {
    const newsData = {
      title: "Test Title 1",
      description: "Description 1",
      text: "Text 1",
    };
    const response = await request.post("/api/news").send(newsData);

    expect(response.status).toBe(201);
    const createdNews = await News.findOne({ title: newsData.title });
    expect(createdNews).toBeTruthy();
    expect(response.body.title).toBe(createdNews!.toJSON().title);
  });

  it("should return a validation error and return status 400 with error message", async () => {
    const newsData = {
      title: "Test Title 1",
      description: "Description 1",
      date: new Date().toISOString(),
    };
    const response = await request.post("/api/news").send(newsData);

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('"text" is required');
  });
});

describe("PUT /api/news/:id", () => {
  const server = app.callback();
  const request = supertest(server);
  let newsId: ObjectId;
  let updatedNewsData: NewsRequestBody;
  const randomId = new mongoose.Types.ObjectId();

  beforeEach(async () => {
    const news = await News.create({
      title: "Test Title",
      description: "Test Description",
      text: "Test Text",
      date: new Date(),
    });
    newsId = news._id;

    updatedNewsData = {
      title: "Updated Test Title",
      description: "Updated Test Description",
      text: "Updated Test Text",
      date: new Date(),
    };
  });

  it("should update a news document and return status 200 with the updated news", async () => {
    const response = await request
      .put(`/api/news/${newsId}`)
      .send(updatedNewsData);

    expect(response.status).toBe(200);

    expect(response.body.title).toBe(updatedNewsData.title);
    expect(response.body.description).toBe(updatedNewsData.description);
    expect(response.body.text).toBe(updatedNewsData.text);
    expect(response.body.date).toBe(updatedNewsData.date!.toISOString());
  });

  it("should return status 400 with error message", async () => {
    const response = await request.put(`/api/news/123`).send(updatedNewsData);

    const res = response.body as { error: string };
    expect(response.status).toBe(400);
    expect(res.error).toBe("Invalid news ID");
  });

  it("should return status 404 with error message", async () => {
    const response = await request
      .put(`/api/news/${randomId}`)
      .send(updatedNewsData);

    const res = response.body as { error: string };
    expect(response.status).toBe(404);
    expect(res.error).toBe("News not found");
  });
});

describe("PATCH /api/news/:id", () => {
  const server = app.callback();
  const request = supertest(server);
  let newsId: ObjectId;
  const randomId = new mongoose.Types.ObjectId();

  beforeEach(async () => {
    const news = await News.create({
      title: "Test Title",
      description: "Test Description",
      text: "Test Text",
      date: new Date(),
    });
    newsId = news._id;
  });

  it("should update a news document and return status 200 with the updated news", async () => {
    const updatedNewsData = {
      title: "Updated Title",
      description: "Updated Description",
    };

    const response = await request
      .patch(`/api/news/${newsId}`)
      .send(updatedNewsData);

    expect(response.status).toBe(200);

    const updatedNews = await News.findById(newsId);
    expect(updatedNews).toBeTruthy();
    expect(updatedNews!.title).toBe(updatedNewsData.title);
    expect(updatedNews!.description).toBe(updatedNewsData.description);
  });

  it("should return status 400 for an invalid news ID", async () => {
    const invalidId = "invalidId";

    const response = await request.patch(`/api/news/${invalidId}`).send({});

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Invalid news ID");
  });

  it("should return status 404 if news item not found", async () => {
    const response = await request.patch(`/api/news/${randomId}`).send({});

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("News not found");
  });
});

describe("DELETE /api/news/:id", () => {
  const server = app.callback();
  const request = supertest(server);
  let newsId: ObjectId;
  const randomId = new mongoose.Types.ObjectId();

  beforeEach(async () => {
    const news = await News.create({
      title: "Test Title",
      description: "Test Description",
      text: "Test Text",
      date: new Date(),
    });
    newsId = news._id;
  });

  it("should delete a news document and return status 200 with affirmation message", async () => {
    const response = await request.delete(`/api/news/${newsId}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("News deleted successfully");
    const newsCount = await News.countDocuments();
    expect(newsCount).toBe(0);
  });

  it("should return status 404 with error message", async () => {
    const response = await request.delete(`/api/news/${randomId}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("News not found");
    const newsCount = await News.countDocuments();
    expect(newsCount).toBe(1);
  });
});

describe("DELETE /api/news/", () => {
  const server = app.callback();
  const request = supertest(server);
  let newsIds: ObjectId[];
  const randomId = new mongoose.Types.ObjectId();

  beforeEach(async () => {
    const news = await News.create(
      {
        title: "Test Title 1",
        description: "Test Description 1",
        text: "Test Text 1",
        date: new Date(),
      },
      {
        title: "Test Title 2",
        description: "Test Description 2",
        text: "Test Text 2",
        date: new Date(),
      }
    );
    newsIds = news.map((news) => news.id);
  });

  it("should delete all news documents and return status 200 with affirmation message", async () => {
    const response = await request.delete(`/api/news/`).send({
      newsIds,
    });
    console.log(response.body);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("All news deleted successfully");
    const newsCount = await News.countDocuments();
    expect(newsCount).toBe(0);
  });

  it("should return status 400 with error message", async () => {
    const response = await request.delete(`/api/news/`).send(newsIds[0]);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("News IDs must be provided as an array");
    const newsCount = await News.countDocuments();
    expect(newsCount).toBe(2);
  });

  it("should return status 404 with error message", async () => {
    const response = await request
      .delete(`/api/news/`)
      .send({ newsIds: [randomId] });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Some news could not be found or deleted");
    const newsCount = await News.countDocuments();
    expect(newsCount).toBe(2);
  });

  it("should return status 404 with error message - passing invalid id", async () => {
    const response = await request
      .delete(`/api/news/`)
      .send({ newsIds: ["123"] });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Some news could not be found or deleted");
    const newsCount = await News.countDocuments();
    expect(newsCount).toBe(2);
  });
});

describe("Internal Server Error Handling", () => {
  const server = app.callback();
  const request = supertest(server);
  let newsId: ObjectId;

  beforeEach(async () => {
    const news = await News.create({
      title: "Test Title",
      description: "Test Description",
      text: "Test Text",
      date: new Date(),
    });
    newsId = news._id;
  });

  it("should handle internal server error", async () => {
    jest.spyOn(News, "findByIdAndUpdate").mockImplementationOnce(() => {
      throw new Error("Mocked internal server error");
    });
    const response = await request.patch(`/api/news/${newsId}`).send({});
    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Internal Server Error");
  });
});
