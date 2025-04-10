const getPublicId = (cloudinaryUrl) => {
	const parts = cloudinaryUrl.split("/");
	const filename = parts.pop(); // Extracts 'diljljjr9hfihqnsgfqi.jpg'
	const publicId = filename.split(".")[0]; // Removes the file extension
	return publicId;
};

export default getPublicId;
