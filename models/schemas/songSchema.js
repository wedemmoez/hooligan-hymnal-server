var mongoose = require("mongoose");

module.exports = new mongoose.Schema(
	{
		category: String,
		deleteLocal: String,
		title: {
			type: String,
			required: "Title is required"
		},
		instructions: String,
		lyrics: String,
		referenceTitle: String,
		reference_title: String,
		referenceLink: String,
		reference_link: String,
		sheetMusicLink: String,
		playerId: String,
		player_id: String,
		legend: String,
		capoSignal: String
	},
	{
		timestamps: {
			createdAt: "createTime",
			updatedAt: "updateTime"
		}
	}
);
