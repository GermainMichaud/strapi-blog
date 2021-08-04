module.exports = ({ env }) => ({
  defaultConnection: "default",
  connections: {
    default: {
      connector: "bookshelf",
      settings: {
        client: "postgres",
        host: env("PG_HOST", "localhost"),
        port: env("PG_PORT", 5432),
        database: env("PG_DATABASE", "blog"),
        username: env("PG_USERNAME", "blog"),
        password: env("PG_PASSWORD", "blog"),
        schema: env("PG_SCHEMA", "public"),
        ssl: env("PG_SSL", false),
      },
      options: {},
    },
  },
});
