import routes from "../routes";
import Videos from "../models/Video";

// Home

export const home = async (req, res) => {
	try {
		const videos = await Videos.find({}).sort({ _id: -1 });
		res.render("home", { pageTitle: "Home", videos });
	} catch (error) {
		console.log(error);
		res.render("home", { pageTitle: "Home", videos: [] });
	}
};

// Search
export const search = (req, res) => {
	const {
		query: { term: searchingBy },
	} = req;
	res.render("search", { pageTitle: "Search", searchingBy });
};

// Upload
export const getUpload = (req, res) =>
	res.render("upload", { pageTitle: "Upload" });

export const postUpload = async (req, res) => {
	const {
		body: { title, description },
		file: { path },
	} = req;

	const newVideo = await Videos.create({
		fileUrl: path,
		title,
		description,
	});

	console.log(newVideo);
	res.redirect(routes.videoDetail(newVideo.id));
};

export const videoDetail = async (req, res) => {
	// 밑의 의미는 const id = req.params.id
	const {
		params: { id },
	} = req;
	try {
		const video = await Videos.findById(id);
		res.render("videoDetail", { pageTitle: video.title, video });
	} catch (error) {
		res.redirect(routes.home);
	}
};
// Edit Video
export const getEditVideo = async (req, res) => {
	const {
		params: { id },
	} = req;
	try {
		const video = await Videos.findById(id);
		res.render("editVideo", { pageTitle: `Edit ${video.title}`, video });
	} catch (error) {
		res.redirect(routes.home);
	}
};

export const postEditVideo = async (req, res) => {
	const {
		params: { id },
		body: { title, description },
	} = req;
	try {
		await Videos.findeOneAndUpdate({ _id: id }, { title, description });
		res.redirect(routes.videoDetail(id));
	} catch (error) {
		res.redirect(routes.home);
	}
};
// Delete Video
export const deleteVideo = async (req, res) => {
	const {
		params: { id },
	} = req;
	try {
		await Videos.findOneAndRemove({ _id: id });
	} catch (error) {}
	res.redirect(routes.home);
};
