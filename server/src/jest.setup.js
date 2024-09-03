const { MySqlContainer } = require("@testcontainers/mysql");
const { createConnection } = require("mysql2/promise");
require("dotenv").config();

let container;
let connection;

beforeAll(async () => {
  jest.setTimeout(30000);

  container = await new MySqlContainer()
    .withUsername(process.env.DB_USERNAME)
    .withUserPassword(process.env.DB_PASSWORD)
    .withDatabase(process.env.DB_NAME)
    .start();

  console.log("creating database...");

  connection = await createConnection({
    host: container.getHost(),
    port: container.getPort(),
    database: container.getDatabase(),
    user: container.getUsername(),
    password: container.getUserPassword(),
  });

  await connection.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER AUTO_INCREMENT PRIMARY KEY,
      google_id VARCHAR(200) NOT NULL,
      email VARCHAR(200) NOT NULL UNIQUE,
      name VARCHAR(200) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    );
  `);

  console.log("connecting to database...");

  await connection.query(`
    CREATE TABLE IF NOT EXISTS urls (
      id INTEGER AUTO_INCREMENT PRIMARY KEY,
      real_url TEXT NOT NULL,
      shortened_url_id VARCHAR(100) NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL,
      user_id INT,
      views INTEGER DEFAULT 0 NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
  `);
}, 30000);

afterAll(async () => {
  if (connection) {
    await connection.end();
  }
  if (container) {
    await container.stop();
  }
});
