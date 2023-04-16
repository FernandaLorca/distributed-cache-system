import { createClient } from 'redis';

const redis = createClient({url: 'redis://127.0.0.1:6379'});

redis.on('error', err => console.log('Redis Client Error', err));

await redis.connect();
await redis.set('key', 'content');
const value = await redis.get('key');
await redis.disconnect();
console.log(value);

