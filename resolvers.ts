import { getDb } from './db';

const resolvers = {
  Query: {
    plugins: async () => {
      // Fetch all plugins from the PostgreSQL database
      const plugins = (await getDb()).any('SELECT * FROM plugins');
      return plugins;
    },
    plugin: async (_: any, { id }: { id: string }) => {
      // Fetch a specific plugin by ID from the PostgreSQL database
      const plugin = (await getDb()).oneOrNone('SELECT * FROM plugins WHERE id = $1', [id]);
      return plugin;
    },
  },
  Mutation: {
    downloadPlugin: async (_: any, { id }: { id: string }) => {
      // Implement the logic to download the plugin file and return it as a Base64-encoded string
      // You can use the 'downloadUrl' from the plugin data to fetch the file
      // Note: This is a placeholder implementation and should be replaced with your actual file download logic
      const plugin = (await getDb()).oneOrNone('SELECT * FROM plugins WHERE id = $1', [id]);
      if (!plugin) {
        throw new Error('Plugin not found');
      }

      const fileContent = 'example_base64_encoded_file_content';
      return fileContent;
    },
    createPlugin: async (_: any, args: any) => {
      const { name, version, author, description, downloadUrl } = args.input;
      const result = (await getDb()).one(
        'INSERT INTO plugins (name, version, author, description, downloadUrl) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [name, version, author, description, downloadUrl]
      );
      return result;
    },
  },
};

export default resolvers;
