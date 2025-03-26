import User from "../models/user.model.js";
import Message from "../models/message.model.js";

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

		res.status(200).json(messages);
	} catch (error) {
		console.log("error getting messages: ", error);
		res.status(500).json({ message: "internal server error" });
	}
};

export { getSidebarUsers, getMessages };
