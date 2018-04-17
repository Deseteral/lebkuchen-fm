const ENVIRONMENT = process.env.NODE_ENV;
const prod = ENVIRONMENT === "production"; // Anything else is treated as 'dev'

const MONGODB_URI = prod
  ? process.env["MONGODB_URI"]
  : process.env["MONGODB_URI_LOCAL"];

if (!MONGODB_URI) {
  console.error("No mongo connection string. Set MONGODB_URI environment variable.");
  process.exit(1);
}

export {
  MONGODB_URI,
  ENVIRONMENT,
};
