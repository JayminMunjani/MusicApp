// PAKCAGES
import { combineResolvers } from "graphql-resolvers";
import { GraphQLError } from "graphql";
import jwt from "jsonwebtoken";

// FILES
import { isAuthenticated } from "../../authentication";
import { emailCheck, verifyRepeatEntry } from "../../functions/validations";


const generateToken = async (user, expiresIn) => {
	const { id, email } = user;
	return await jwt.sign({ id, email }, process.env.SECRET, { expiresIn });
};

export const userQuery = {
	// GET ME
	me: combineResolvers(async (parent, args, { models, me }) => {
		try {
			const res = await models.User.findById(me?.id).exec();
			if (!res) throw new GraphQLError("User not found");
			return res;
		} catch (err) {
			throw err;
		}
	}),

	// GETALLUSER BY PAGINATE
	getAllUser: combineResolvers(isAuthenticated, async (parent, args, { models, me }) => {
		try {
			const filter = JSON.parse(args?.filter);
			const sort = { [args?.sort?.key]: args?.sort?.type };
			const users = await models.User.find({ ...filter }).sort(sort).exec();
			return {
				count: users?.length || 0,
				data: users || [],
			};
		} catch (err) {
			throw err;
		}
	}),
};

export const userMutation = {
	// CREATE USER
	createUser: async (parent, { input }, { models, me }) => {
		try {
			await verifyRepeatEntry("User", { email: input?.email }, "This email is already in use");
			input.createdBy = me?.id;
			const user = await models.User.create(input);
			return user;
		} catch (err) {
			throw err;
		}
	},

	// SIGNIN USER
	signIn: async (parent, { email, password }, { models, me }) => {
		let filter = { email };
		const user = await models.User.findOne(filter);
		if (!user)
			throw new GraphQLError("Please enter valid email or userName", {
				extensions: { code: "BAD_USER_INPUT" },
			});

		if (!(await user.validatePassword(password)))
			throw new GraphQLError("Invalid Password", {
				extensions: { code: "BAD_USER_INPUT" },
			});

		user.save();
		return {
			token: generateToken(user, "8h"),
			user: user,
		};
	},

	// UPDATE USER
	updateUser: combineResolvers(isAuthenticated, async (parent, { input }, { models, me }) => {
		try {

			input.updatedBy = me?.id;
			const user = await models.User.findById(me?.id);

			// email validation
			if (user?.email !== input?.email && input?.email) await emailCheck(input?.email);

			const updatedUser = await models.User.findOneAndUpdate(
				{ _id: me?.id, isDeleted: false },
				input,
				{ new: true }
			);
			return updatedUser;
		} catch (err) {
			throw new GraphQLError(err, { extensions: { code: "BAD_USER_INPUT" } });
		}
	}),

	// DELETE USER
	deleteUser: combineResolvers(isAuthenticated, async (parent, args, { models, me }) => {
		try {
			const userId = args?.id;
			await models.User.findOneAndUpdate(
				{ _id: userId },
				{ isDeleted: true },
				{ new: true }
			);
			return true;
		} catch (err) {
			throw err;
		}
	}),
};
