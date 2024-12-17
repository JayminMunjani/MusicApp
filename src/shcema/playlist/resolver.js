import { combineResolvers } from 'graphql-resolvers';
import { isAuthenticated } from '../../authentication';
import { GraphQLError } from 'graphql';

export const playlistQuery = {
    getAllPlaylists: combineResolvers(isAuthenticated, async (_, args, { me, models }) => {
        try {
            const playlists = await models?.Playlist.find({
                userId: me?.id,
                isDeleted: false
            });
            return {
                data: playlists,
                count: playlists.length
            };
        } catch (error) {
            throw new GraphQLError(error);
        }
    }),
    getPlaylist: combineResolvers(isAuthenticated, async (_, { id }, { me, models }) => {
        try {
            const playlist = await models?.Playlist.find({
                _id: id,
                userId: me?.id,
                isDeleted: false
            });
            return playlist;
        } catch (error) {
            throw new GraphQLError(error);
        }
    })
};

export const playlistMutation = {
    createPlaylist: combineResolvers(isAuthenticated, async (_, { input }, { me, models }) => {
        try {
            const playlist = await models?.Playlist.create({
                ...input,
                userId: me?.id
            });
            return playlist;
        } catch (error) {
            throw new GraphQLError(error);
        }
    }),
    updatePlaylist: combineResolvers(isAuthenticated, async (_, { input }, { me, models }) => {
        try {
            const { id, ...updateData } = input;
            const playlist = await models?.Playlist.findOneAndUpdate(
                { _id: id, userId: me?.id, isDeleted: false },
                { $set: updateData },
                { new: true }
            );
            if (!playlist) {
                throw new GraphQLError("Playlist not found");
            }
            return playlist;
        } catch (error) {
            throw new GraphQLError(error);
        }
    }),
    deletePlaylist: combineResolvers(isAuthenticated, async (_, { id }, { me, models }) => {
        try {
            const playlist = await models?.Playlist.findOneAndUpdate(
                { _id: id, userId: me?.id },
                { $set: { isDeleted: true } },
                { new: true }
            );
            return playlist ? true : false;
        } catch (error) {
            throw new GraphQLError(error);
        }
    }),
    addTrackToPlaylist: combineResolvers(isAuthenticated, async (_, { playlistId, track }, { me, models }) => {
        try {
            const existingTrack = await models?.Playlist.findOne({
                _id: playlistId,
                userId: me?.id,
                isDeleted: false,
                "tracks.id": track.id
            });
            if (existingTrack) {
                throw new GraphQLError("Track already exists in playlist");
            }
            const playlist = await models?.Playlist.findOneAndUpdate(
                { _id: playlistId, userId: me?.id, isDeleted: false },
                { $push: { tracks: track } },
                { new: true }
            );
            if (!playlist) {
                throw new GraphQLError("Playlist not found");
            }
            return playlist;
        } catch (error) {
            throw new GraphQLError(error);
        }
    }),
    removeTrackFromPlaylist: combineResolvers(isAuthenticated, async (_, { playlistId, trackId }, { me, models }) => {
        try {
            const playlist = await models?.Playlist.findOneAndUpdate(
                { _id: playlistId, userId: me?.id, isDeleted: false },
                { $pull: { tracks: { id: trackId } } },
                { new: true }
            );
            if (!playlist) {
                throw new GraphQLError("Playlist not found");
            }
            return playlist;
        } catch (error) {
            throw new GraphQLError(error);
        }
    })
}