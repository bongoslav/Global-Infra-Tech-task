const client = require("./client");

client.getAllNews({}, (error, news) => {
  if (error) throw error;
  console.log(news);
});

client.getNews({ id: 1 }, (error, news) => {
  if (error) throw error;
  console.log(news);
});

client.addNews(
  {
    title: "Title 3",
    description: "Description 3",
    text: "Text 3",
    date: "2024-03-23",
  },
  (error, news) => {
    if (error) throw error;
    console.log("Successfully created a news item.");
  }
);

client.editNews(
  {
    id: 2,
    title: "Title 2 edited",
    description: "Description 2 edited",
    text: "Text 2 edited",
    date: "2024-03-22 edited",
  },
  (error, news) => {
    if (error) throw error;
    console.log("Successfully edited a news item.");
  }
);

client.deleteNews(
  {
    id: 2,
  },
  (error, news) => {
    if (error) throw error;
    console.log("Successfully deleted a news item.");
  }
);
