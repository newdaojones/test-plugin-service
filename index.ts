import { ApolloServer } from 'apollo-server';
import typeDefs from './schema';
import resolvers from './resolvers';
import { getDb } from './db';

async function initializeDatabase() {
  const db = await getDb();
  await db.none(`
    CREATE TABLE IF NOT EXISTS plugins (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      version VARCHAR(50) NOT NULL,
      author VARCHAR(255) NOT NULL,
      description TEXT,
      fileURL VARCHAR(255) NOT NULL
    );
  `);

  const existingPlugin = await db.oneOrNone('SELECT * FROM plugins WHERE name = $1 AND version = $2', ['Plugin1', '1.0.0']);

  if (!existingPlugin) {
    await db.none(`
      INSERT INTO plugins (name, version, author, description, fileURL)
      VALUES ('Plugin1', '1.0.0', 'Author1', 'Description for Plugin1', 'https://example.com/plugin1.zip');
    `);
  }
}

async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async () => {
      const db = await getDb();
      return { db };
    },
  });

  const { url } = await server.listen();
  console.log(`🚀 Server ready at ${url}`);
}

startApolloServer().catch((err) => {
  console.error(err);
  process.exit(1);
});
