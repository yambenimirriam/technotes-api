import mongoose from 'mongoose';

const connectDB = (url) => {
  mongoose.set('strictQuery', true);
  mongoose
    .connect(url)
    .then(() => console.log('Mongodb connected'))
    .catch((error) => {
      console.log(error);
      setTimeout(connectDB, 5000);
    });
};

export default connectDB;
