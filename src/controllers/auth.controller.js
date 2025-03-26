import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { genJWT } from "../utils/genToken.js";
import cloudinary from "../lib/cloudinary.js";

const signup = async (req, res) => {
	const { name, email, password } = req.body;
	// console.log(name, email, password);

	if (!name || !email || !password)
		return res.status(400).json({ message: "all fields are required" });

	if (password.length < 8)
		return res
			.status(400)
			.json({ message: "password must be atleast 8 chars" });

	try {
		const user = await User.findOne({ email });
		if (user)
			return res.status(400).json({
				message: "user with same email already exist",
			});

		const salt = await bcrypt.genSalt(10);
		const hashedPswrd = await bcrypt.hash(password, salt);

		const newUser = new User({
			name,
			email,
			password: hashedPswrd,
		});

		if (newUser) {
			genJWT(newUser._id, res);
			await newUser.save();

			const { _id, name, email, profile_pic } = newUser;
			return res.status(200).json({ _id, name, email, profile_pic });
		} else {
			return res.status(400).json({ message: "invalid user data" });
		}
	} catch (error) {
		console.log("error registering user: ", error);
		res.status(500).json({ message: "internal server error" });
	}
};

const signin = async (req, res) => {
	const { email, password } = req.body;
	console.log(email, password);

	if (!email || !password)
		return res
			.status(400)
			.json({ message: "email and password is required" });

	try {
		const user = await User.findOne({ email });
		if (!user)
			return res.status(400).json({ message: "invalid cridentials" });

		const isValid = await bcrypt.compare(password, user.password);

		if (!isValid)
			return res.status(400).json({ message: "invalid cridentials" });

		genJWT(user._id, res);

		res.status(200).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			profile_pic: user.profile_pic,
		});
	} catch (error) {
		console.log("error signin user: ", error);
		res.status(500).json({ message: "internal server error" });
	}
};

const signout = async (_, res) => {
	try {
		res.cookie("jwt", "", { maxAge: 0 });
		res.status(200).json({ message: "signout successfully!" });
	} catch (error) {
		console.log("error signout user: ", error);
		res.status(500).json({ message: "internal server error" });
	}
};

const updateProfile = async (req, res) => {
	const {name, profile_pic } = req.body;

	console.log(name, profile_pic);

	if (!profile_pic)
		return res.status(400).json({ message: "image file is required" });

	const user = req.user;

	try {
		const cloudRes = await cloudinary.uploader.upload(profile_pic);
		if (!cloudRes)
			return res.status(500).json({ message: "failed to upload image" });

		user.profile_pic = cloudRes.secure_url;
		await user.save();

		res.status(200).json(user);
	} catch (error) {
		console.log("error updating profile: ", error);
		res.status(500).json({ message: "internal server error" });
	}
};

const testAuth = (req, res) => {
	try {
		res.status(200).json(req.user);
	} catch (error) {
		console.log("error test user: ", error);
		res.status(500).json({ message: "internal server error" });
	}
};

export { signup, signin, signout, updateProfile, testAuth };
