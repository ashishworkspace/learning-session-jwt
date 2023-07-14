import mongoose from "mongoose";
const uri = process.env.MONGO_URI;

export const mongoConnect = async () => {
  try {
    return await mongoose.connect(uri);
  } catch (err) {
    return console.log(err);
  }
};
