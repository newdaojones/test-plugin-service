// schema.ts
import { gql } from 'apollo-server';

const typeDefs = gql`
  type Plugin {
    id: ID!
    name: String!
    description: String!
    version: String!
    author: String!
    downloadUrl: String! 
  }

  input PluginInput {
    name: String!
    version: String!
    author: String!
    description: String
    downloadUrl: String!
  }

  type Query {
    plugins: [Plugin!]!
    plugin(id: ID!): Plugin
  }

  type Mutation {
    downloadPlugin(id: ID!): String!
    createPlugin(input: PluginInput!): Plugin
  }
`;

export default typeDefs;
