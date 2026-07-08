import { Redis } from "@upstash/redis";

// Optional shared cache client for future LMS features such as analytics or rate limits.
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default redis;
