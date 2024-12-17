export const userSchema = `
type User {
    id:ID
	userName: String
    email: String
    password: String
	isDeleted: Boolean
  }
  
  type UserRes {
    id:ID
	userName: String
    email: String
    password: String
	isVerified: Boolean
	isDeleted: Boolean
  }


  input userInput{
	id:ID
	userName: String
    email: String
    password: String
  }

  type UserPaginate {
		count: Int
		data: [UserRes]
	}

	type Token {
		token: String
		user: UserRes
	}

	extend type Query {
		me: UserRes
		getAllUser(sort: Sort, filter: String): UserPaginate
	}

	extend type Mutation {
		createUser(input: userInput): User
		signIn(email: String, password: String!): Token
		updateUser(input: userInput): User
		deleteUser(id: ID): Boolean
	}
`;
