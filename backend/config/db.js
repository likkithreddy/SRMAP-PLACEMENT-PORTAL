import mongoose from "mongoose";

const connectDB = async ()=>{
    await mongoose.connect(`${process.env.MONGODB_URL}/placmentportal`).then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    })
}

export default connectDB;