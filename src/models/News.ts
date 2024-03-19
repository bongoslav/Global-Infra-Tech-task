import mongoose, { Schema, Document } from "mongoose";

interface INews extends Document {
  title: string;
  description: string;
  text: string;
  date: Date;
}

const newsSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  text: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const News = mongoose.model<INews>("News", newsSchema);

export default News;
