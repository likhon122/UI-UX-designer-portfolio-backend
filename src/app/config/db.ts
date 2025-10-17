import mongoose from 'mongoose';
import { ENV } from '.';

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(ENV.mongoDBUrl as string);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
