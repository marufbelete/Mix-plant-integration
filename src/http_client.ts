import "./env";
import axios from "axios";
import * as jwt from "jsonwebtoken";

const getInternalApiSecret = () =>
  process.env.INTERNAL_API_SECRET || "MisomeInternal_123Trqtwref&2536";
const getInternalApiAud = () =>
  process.env.INTERNAL_API_AUD || "express-service";
const getInternalApiIss = () => process.env.INTERNAL_API_ISS || "nest-service";

const http = axios.create();

http.interceptors.request.use((config) => {
  const token = jwt.sign(
    { iss: getInternalApiIss() },
    getInternalApiSecret(),
    {
      audience: getInternalApiAud(),
      expiresIn: "10m",
    }
  );
  config.headers = {
    ...(config.headers || {}),
    "x-internal-auth": `Bearer ${token}`,
    "source-plant": process.env.SOURCE_PLANT || "A",
  };
  return config;
});

export default http;
