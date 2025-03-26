import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
	try {
		const token = req.cookies.jwt;
		console.log(token);
		if (!token)
			return res
				.status(401)
				.json({ messsage: "unauthorized - token missing" });

		const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
		if (!decodedToken)
			res.status(401).json({ message: "unauthrorized - invalid token" });

		const user = await User.findById(decodedToken.userId).select(
			"-password"
		);
		if (!user) res.status(404).json({ message: "user not found" });

		req.user = user;
		next();
	} catch (error) {
		console.log("error in protected route: ", error);
		return res.status(500).json({ message: "internal server error" });
	}
};
