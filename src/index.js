import fetch from 'node-fetch';
import { createClient } from 'redis';
import express from 'express';
import responseTime from 'response-time';

//clients redis
const redis1 = createClient({ url: 'redis://127.0.0.1:6379' });
const redis2 = createClient({ url: 'redis://127.0.0.1:6380' });
const redis3 = createClient({ url: 'redis://127.0.0.1:6381' });

redis1.on('error', err => console.log('Redis Client Error', err));
redis2.on('error', err => console.log('Redis Client Error', err));
redis3.on('error', err => console.log('Redis Client Error', err));

//conection
await redis1.connect();
await redis2.connect();
await redis3.connect();

//front
const app = express();
app.use(responseTime())
app.listen(4050);
console.log("Listen port 4050")

//requests
const url = "https://api.sampleapis.com/movies/"
app.get("/movies/:type/:id", async (req, res) => {
  let id = req.params.id
  let type =req.params.type
  let key = type + "-" + id;

  try {
    const check = await checkRedisData(id, key);      //check data in redis, return data
    if (check.length == 0) {                          //data is not in redis, check.length = 0                  
      const response = await fetch(url + type + "/" +id);
      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor: ' + response.status);
      }
      const content = await response.text();
      let ttl = 30;
      //set data in redis: 1,2,3 depends of id
      if (id > 0 && id < 23) {                          //set in redis1
        await redis1.set(key, content, {EX : ttl})
        res.send(JSON.parse(content));
      } else if (id > 22 && id < 45) {                  //set in redis2
        await redis2.set(key, content, {EX : ttl})
        res.send(JSON.parse(content));
      } else {                                          //set in redis3
        await redis3.set(key, content, {EX : ttl})
        res.send(JSON.parse(content));
      }
    } else {                                        //data is already in redis
      return res.send(JSON.parse(check))
    }
  } catch (error) {
    console.error('Error al obtener los datos: ' + error);
  }

})

async function checkRedisData(id, key) {
  let dataRedis = "";

  if (id > 0 && id < 23) {                 //get in redis1
    const value = await redis1.get(key);
    if (value != null) {
      dataRedis = value;
    }
  } else if (id > 22 && id < 45) {        //get in redis2
    const value = await redis2.get(key);
    if (value != null) {
      dataRedis = value;
    }
  } else {                                //get in redis3
    const value = await redis3.get(key);
    if (value != null) {
      dataRedis = value;
    }
  }

  return dataRedis;
}