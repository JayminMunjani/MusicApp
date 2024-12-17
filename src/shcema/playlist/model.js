import mongoose from "mongoose";

const playlistSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    tracks: [
        {
            type: mongoose.Schema.Types.Mixed,
        }
    ],
    isDeleted: {
        type: Boolean,
        default: false,
    },
});

export const Playlist = new mongoose.model("playlist", playlistSchema);
