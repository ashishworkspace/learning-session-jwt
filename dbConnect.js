import mongoose from "mongoose";
const uri = process.env.MONGO_URI;

export const mongoConnect = () => {
  return mongoose.connect(uri).catch((err) => console.log(err));
};
