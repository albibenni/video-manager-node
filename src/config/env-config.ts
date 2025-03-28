import dotenv, { configDotenv } from "dotenv";
import path, { resolve } from "path";

function setupEnv() {
  const basePath = import.meta.dirname;
  switch (process.env.NODE_ENV) {
    case "prod":
      console.log("Environment is 'prod'");
      configDotenv({
        path: resolve(basePath, "../.env.prod"),
      });
      break;
    case "dev":
      console.log("Environment is 'development'");
      configDotenv({
        path: resolve(basePath, "../.env.dev"),
      });
      break;
    case "local":
      console.log("Environment is 'local'");
      dotenv.config({
        path: path.resolve(process.env.PWD!, ".env.local"),
      });
      break;
    default:
      console.log("Environment is 'default'");
      dotenv.config({
        path: path.resolve(process.env.PWD!, ".env.local"),
      });
  }
}
setupEnv();

const config = {
  db: {
    user: process.env.POSTGRES_USER ?? "trigon",
    password: process.env.POSTGRES_PASSWORD ?? "password",
    host: process.env.POSTGRES_HOST ?? "localhost",
    port: parseInt(process.env.POSTGRES_PORT ?? "5431"),
    database: process.env.POSTGRES_DB ?? "trigon",
    url:
      process.env.DB_URL ??
      "postgresql://trigon:password@localhost:5431/trigon",
  },
  minio: {
    root_user: process.env.MINIO_ROOT_USER ?? "admin",
    root_password: process.env.MINIO_ROOT_PASSWORD ?? "password",
    port: parseInt(process.env.MINIO_PORT ?? "9000"),
    admin_port: parseInt(process.env.MINIO_ADMIN_PORT ?? "9000"),
  },
  aws: {
    endpoint: process.env.AWS_ENDPOINT ?? "",
    bucket: process.env.AWS_S3_BUCKET ?? "",
    region: process.env.AWS_REGION ?? "",
    access_key: process.env.AWS_ACCESS_KEY ?? "",
    secret_key: process.env.AWS_SECRET_ACCESS_KEY ?? "",
    ssl: process.env.AWS_SSL ?? false,
    force_path_style: process.env.AWS_FORCE_STYLE ?? false,
  },
};
export default config;
