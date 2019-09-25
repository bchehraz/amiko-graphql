const { buildSchema } = require('graphql');

module.exports = buildSchema(`
  type User {
    _id: ID!
    email: String!
    password: String
    createdPosts: [Post!]
    referralCode: String!
    referralCount: Int!
  }

  type Post {
    _id: ID!
    title: String!
    date: String!
    content: String!
    author: User!
  }

  type Referral {
    code: String!
    signUps: Int!
  }

  type AuthData {
    userId: ID!
    token: String!
    tokenExpiration: Int!
    email: String!
  }

  input UserInput {
    email: String!
    password: String!
    referral: String
  }

  type RootQuery {
    posts(userId: ID!): Post
  }

  type RootMutation {
    createUser(userInput: UserInput!): AuthData!
    createTestUser(userInput: UserInput!): AuthData!
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);
