import mongoose from "mongoose";

export const connectDB = async () => {
	try {
		const con = await mongoose.connect(process.env.MONGODB_URI);
		console.log("mongodb connected: ", con.connection.host);
	} catch (error) {
		console.log("mongodb connection error: ", error);
	}
};
