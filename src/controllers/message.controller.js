import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";

const getSidebarUsers = async (req, res) => {
	const user = req.user._id;
	try {
		const users = await User.find({ _id: { $ne: user } }).select(
			"-password"
		);
		res.status(200).json(users);
	} catch (error) {
		console.log("error getting users: ", error);
		res.status(500).json({ message: "internal server error" });
	}
};

const getMessages = async (req, res) => {
	const { id: userToChatId } = req.params;
	try {
		const user = req.user._id;

		const messages = await Message.find({
			$or: [
				{ senderId: user, receiverId: userToChatId },
				{ senderId: userToChatId, receiverId: user },
			],
		});

		res.status(201).json(messages);
	} catch (error) {
		console.log("error getting messages: ", error);
		res.status(500).json({ message: "internal server error" });
	}
};

const sendMessage = async (req, res) => {
	const { text, image } = req.body;
	const { id: receiverId } = req.params;
	const userId = req.user._id;

	try {
		let imageUrl;
		if (image) {
			const cloudRes = await cloudinary.uploader.upload(image);
			imageUrl = cloudRes.secure_url;
		}

		const message = new Message({
			senderId: userId,
			receiverId,
			text,
			image: imageUrl,
		});
		await message.save();

		// todo: real time implementation

		res.status(200).json(message);
	} catch (error) {
		console.log("error sending message: ", error);
		res.status(500).json({ message: "internal server error" });
	}
};

export { getSidebarUsers, getMessages, sendMessage };
