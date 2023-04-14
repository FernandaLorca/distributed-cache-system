import fetch from 'node-fetch';
import { createClient } from 'redis';
import express from 'express';
import responseTime from 'response-time';

const redis1 = createClient({ url: 'redis://127.0.0.1:6379' });
const redis2 = createClient({ url: 'redis://127.0.0.1:6380' });
const redis3 = createClient({ url: 'redis://127.0.0.1:6381' });

redis1.on('error', err => console.log('Redis Client Error', err));
redis2.on('error', err => console.log('Redis Client Error', err));
redis3.on('error', err => console.log('Redis Client Error', err));

await redis1.connect();
await redis2.connect();
await redis3.connect();

const app = express();
app.use(responseTime())
app.listen(3000);
console.log("Listen port 3000")
const urlComedy = "https://api.sampleapis.com/movies/comedy/"

app.get("/movies/:id", async (req, res) => {
  let id = req.params.id
  let key = "comedy-" + id;

  try {
    const check = await checkRedisData(id, key);
    if (check.length == 0) {
      const response = await fetch(urlComedy + id);
      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor: ' + response.status);
      }
      const content = await response.text();

      if (id > 0 && id < 30) {                          //se guarda en redis1
        await redis1.set(key, JSON.stringify(content))
        res.send(JSON.parse(content));
      } else if (id > 29 && id < 59) {                  //se guarda en redis2
        await redis2.set(key, JSON.stringify(content))
        res.send(JSON.parse(content));
      } else {                                          //se guarda en redis3
        await redis3.set(key, JSON.stringify(content))
        res.send(JSON.parse(content));
      }
    } else {
      return res.send(JSON.parse(check))
    }
  } catch (error) {
    console.error('Error al obtener los datos: ' + error);
  }


})

// async function fetchData() {
//   try {
//     let id = generateRandom(1, 87);
//     let key = "comedy-" + id;
//     console.log("URL: " + key)
//     const check = await checkRedisData(key);
//     console.log("Value check: " + check)
//     if (check.length == 0) {
//       const response = await fetch(`${urlComedy}${id}`);
//       if (!response.ok) {
//         throw new Error('Error en la respuesta del servidor: ' + response.status);
//       }
//       const content = await response.text();
//       console.log("****** Respuesta servidor ******: " + content);
//       //const redis = generateRandom(1,3);
//       if (id > 0 && id < 28) { //se guarda en redis1
//         console.log("KEY: " + key);
//         console.log("Contenedor 1");
//         await redis1.set(key, JSON.stringify(content))
//         const value = await redis1.get(key);
//         console.log("Respuesta Redis: " + JSON.parse(value));
//       } else if (id > 27 && id < 55) {
//         console.log("KEY: " + key);
//         console.log("Contenedor 3");
//         await redis2.set(key, JSON.stringify(content))
//         const value = await redis2.get(key);
//         console.log("Respuesta Redis: " + JSON.parse(value));
//       } else {
//         console.log("KEY: " + key);
//         console.log("Contenedor 3");
//         await redis3.set(key, JSON.stringify(content))
//         const value = await redis3.get(key);
//         console.log("Respuesta Redis: " + JSON.parse(value));
//       }
//       //revisar, redis solo acepta string de contenido
//     } else {
//       console.log("Almacenado en contenedor: " + check[0]);
//       console.log("Respuesta Redis: " + JSON.parse(check[1]));
//     }
//   } catch (error) {
//     console.error('Error al obtener los datos: ' + error);
//   }
// }

async function checkRedisData(id, key) {
  let dataRedis = "";

  if (id > 0 && id < 30) { //se guarda en redis1
    const value = await redis1.get(key);
    if (value != null) {
      dataRedis = value;
    }
  } else if (id > 29 && id < 59) {
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
