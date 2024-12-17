export const playlistSchema = `
    type Playlist {
        id: ID
        name: String!
        description: String
        userId: ID!
        tracks: [Track]
        isDeleted: Boolean
    }

    type Track {
        id: ID
        title: String
        artist: String
        duration: String
        url: String
    }

    input TrackInput {
        id: String
        title: String
        artist: String
        duration: String
        url: String
    }

    input PlaylistInput {
        name: String!
        description: String
        tracks: [JSON]
    }

    input UpdatePlaylistInput {
        id: ID!
        name: String
        description: String
        tracks: [JSON]
    }

    extend type Query {
        getAllPlaylists: [Playlist]
        getPlaylist(id: ID!): Playlist
    }

    extend type Mutation {
        createPlaylist(input: PlaylistInput): Playlist
        updatePlaylist(input: UpdatePlaylistInput): Playlist
        deletePlaylist(id: ID!): Boolean
        addTrackToPlaylist(playlistId: ID!, track: TrackInput): Playlist
        removeTrackFromPlaylist(playlistId: ID!, trackId: ID!): Playlist
    }
`;
