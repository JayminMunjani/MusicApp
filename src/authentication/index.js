import { skip } from "graphql-resolvers";
import { GraphQLError } from "graphql";

export const isAuthenticated = (parent, args, { me }) => {
	return me ? skip : new GraphQLError("you are not authenticated", { extensions: { code: "UNAUTHENTICATED" } });
};
