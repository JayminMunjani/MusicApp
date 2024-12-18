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

playlistSchema.index({ userId: 1, name: 1 }, { unique: true });

export const Playlist = new mongoose.model("playlist", playlistSchema);
