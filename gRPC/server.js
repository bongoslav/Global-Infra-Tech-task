const grpc = require("@grpc/grpc-js");
const PROTO_PATH = "./news.proto";
var protoLoader = require("@grpc/proto-loader");

const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};
var packageDefinition = protoLoader.loadSync(PROTO_PATH, options);
const newsProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();
let news = [
  {
    id: "1",
    title: "Title 1",
    description: "Description 1",
    text: "Text 1",
    date: "2024-03-21",
  },
  {
    id: "2",
    title: "Title 2",
    description: "Description 2",
    text: "Text 2",
    date: "2024-03-22",
  },
];

server.addService(newsProto.NewsService.service, {
  getAllNews: (_, callback) => {
    const newsList = { news: news };
    callback(null, newsList);
  },
  getNews: (_, callback) => {
    const newsId = _.request.id;
    const newsItem = news.find(({ id }) => newsId == id);
    callback(null, newsItem);
  },
  addNews: (call, callback) => {
    const _news = { id: Date.now(), ...call.request };
    news.push(_news);
    callback(null, _news);
  },
  editNews: (_, callback) => {
    const newsId = _.request.id;
    const newsItem = news.find(({ id }) => newsId == id);
    newsItem.title = _.request.title;
    newsItem.description = _.request.description;
    newsItem.text = _.request.text;
    newsItem.date = _.request.date;
    callback(null, newsItem);
  },
  deleteNews: (_, callback) => {
    const newsId = _.request.id;
    news = news.filter(({ id }) => id !== newsId);
    callback(null, {});
  },
});

server.bindAsync(
  "127.0.0.1:50051",
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    console.log("Server running at http://127.0.0.1:50051");
  }
);
