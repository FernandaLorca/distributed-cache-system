import { createClient } from 'redis';

const redis = createClient({url: 'redis://127.0.0.1:6379'});

redis.on('error', err => console.log('Redis Client Error', err));

// let movie = ["family", 3];
await redis.connect();
// const key = movie[0] + "-" + movie[1];
// const content = "funcionaaaa";
//await redis.set('hola', 'aaa');
const value = await redis.get('family');
await redis.disconnect();
console.log(value);

