import fetch from 'node-fetch';
import { appendFileSync } from 'fs';
import { createClient } from 'redis';

const redis1 = createClient({ url: 'redis://127.0.0.1:6379' });
const redis2 = createClient({ url: 'redis://127.0.0.1:6380' });
const redis3 = createClient({ url: 'redis://127.0.0.1:6381' });

redis1.on('error', err => console.log('Redis Client Error', err));
redis2.on('error', err => console.log('Redis Client Error', err));
redis3.on('error', err => console.log('Redis Client Error', err));

await redis1.connect();
await redis2.connect();
await redis3.connect();

const url = "https://api.sampleapis.com/movies/"

const endPoints = ["animation", "classic", "comedy", "drama",
  "horror", "family", "mystery", "western"]

async function fetchData() {
  try {
    let movie = generateEndPointsRandom();
    let type = movie[0];
    let id = movie[1];
    let key = type + "-" + id;
    console.log("URL: " + key)
    const check = await checkRedisData(id, key);
    console.log("Value check: " + check)
    if (check.length == 0) {
      const response = await fetch(`${url}${type}/${id}`);
      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor: ' + response.status);
      }
      const content = await response.text();

      if (id > 0 && id < 23) {
        await redis1.set(key, content, {EX: 10000})
      } else if (id > 22 && id < 45) {
        await redis2.set(key, content, {EX: 10000})
      } else {
        await redis3.set(key, content, {EX: 10000})
      }
    }
  } catch (error) {
    console.error('Error al obtener los datos: ' + error);
  }
}


function generateRandom(min, max) {

  min = Math.ceil(min);
  max = Math.floor(max);

  const number = Math.floor(Math.random() * (max - min + 1)) + min

  return number;
}

function generateEndPointsRandom() {
  let movie = [];
  let numberType = generateRandom(0, 7);
  let numberID = generateRandom(1, 66);
  movie.push(endPoints[numberType]);
  movie.push(numberID);

  return movie;
}

async function checkRedisData(id, key) {
  let dataRedis = "";

  if (id > 0 && id < 28) { //se guarda en redis1
    const value = await redis1.get(key);
    if (value != null) {
      dataRedis = value;
    }
  } else if (id > 27 && id < 55) {
    const value = await redis2.get(key);
    if (value != null) {
      dataRedis = value;
    }
  } else {
    const value = await redis3.get(key);
    if (value != null) {
      dataRedis = value;
    }
  }

  return dataRedis;
}

async function makeRequests(n) {
  for (let i = 0; i < n; i++) {
    const startTime = new Date().getTime();
    await fetchData();
    const endTime = new Date().getTime();
    const responseTime = endTime - startTime;
    console.log("Petición " + (i + 1) + ": " + responseTime + " ms");
    // responseTimes.push(responseTime);
    let time = responseTime + "\n"
    appendFileSync('response-times-redis.txt', time, err => {
      if (err) {
        console.error(err);
        return;
      }
    })
  }
}

const n = 5000; // número de consultas
makeRequests(n)

