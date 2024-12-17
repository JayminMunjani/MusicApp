import { GraphQLError } from "graphql";
import { models } from "../../shcema";

// Varify email is not repeated
export const emailCheck = async (email) => {
  const user = await models.User.findOne({ email, isDeleted: false });
  if (user) throw new GraphQLError("Email is already exist", { extensions: { code: 'BAD_USER_INPUT' } });
};

// Varify mobile is not repeated
export const verifyRepeatEntry = async (model, filter,msg) => {
  const matchData = await models[`${model}`].findOne({ ...filter, isDeleted: false, });
  if (matchData) throw new GraphQLError(msg, { extensions: { code: 'BAD_USER_INPUT' } });
};