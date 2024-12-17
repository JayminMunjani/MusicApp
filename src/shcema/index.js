import { User, userMutation, userQuery, userSchema } from "./user";
import { Playlist, playlistMutation, playlistQuery, playlistSchema } from "./playlist";

import { gql } from "graphql-tag";

export const models = {
	User,
	Playlist,
};

export const typeDefs = gql`
	scalar Date
	scalar JSON
	scalar Number

	type Query
	type Mutation

	input Sort {
		key: String
		type: Int
	}

	${userSchema}
	${playlistSchema}
`;

export const resolvers = {
	Query: {
		...userQuery,
		...playlistQuery
	},
	Mutation: {
		...userMutation,
		...playlistMutation
	},
};
