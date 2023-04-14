import fetch from 'node-fetch';
import { createClient } from 'redis';
//const express = require('express');

// const app = express();
// app.get()
// app.listen(3000);

const urlComedy = "https://api.sampleapis.com/movies/comedy/"

async function fetchData() {
  try {
    let id = generateRandom(1, 87);
    let key = "comedy-" + id;
    console.log("URL: " + key)
    const check = await checkRedisData(key);
    console.log("Value check: " + check)
    if (check.length == 0) {
      const response = await fetch(`${urlComedy}${id}`);
      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor: ' + response.status);
      }
      const content = await response.text();
      console.log("****** Respuesta servidor ******: " + content);
      //const redis = generateRandom(1,3);
      if (id > 0 && id < 28) { //se guarda en redis1
        console.log("KEY: " + key);
        console.log("Contenedor 1");
        await redis1.set(key, JSON.stringify(content))
        const value = await redis1.get(key);
        console.log("Respuesta Redis: " + JSON.parse(value));
      } else if (id > 27 && id < 55) {
        console.log("KEY: " + key);
        console.log("Contenedor 3");
        await redis2.set(key, JSON.stringify(content))
        const value = await redis2.get(key);
        console.log("Respuesta Redis: " + JSON.parse(value));
      } else {
        console.log("KEY: " + key);
        console.log("Contenedor 3");
        await redis3.set(key, JSON.stringify(content))
        const value = await redis3.get(key);
        console.log("Respuesta Redis: " + JSON.parse(value));
      }
      //revisar, redis solo acepta string de contenido
    } else {
      console.log("Almacenado en contenedor: " + check[0]);
      console.log("Respuesta Redis: " + JSON.parse(check[1]));
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

async function checkRedisData(key) {
  let dataRedis = [];
  for (let i = 0; i < 3; i++) {
    if (i == 0) {
      console.log("Iteración 1");
      await redis1.connect();
      const value = await redis1.get(key);
      if (value != null) {
        dataRedis.push(i + 1);
        dataRedis.push(value);
      }

    } else if (i == 1) {
      console.log("Iteración 2");
      await redis2.connect();
      const value = await redis2.get(key);
      if (value != null) {
        dataRedis.push(i + 1);
        dataRedis.push(value);
      }
    
    } else if (i == 2) {
      console.log("Iteración 3");
      await redis3.connect();
      const value = await redis3.get(key);
      if (value != null) {
        dataRedis.push(i + 1);
        dataRedis.push(value);
      }
    }
    //console.log("**** Respuesta REDIS ***: " + value);
  }
  return dataRedis;
}

const redis1 = createClient({ url: 'redis://127.0.0.1:6379' });
const redis2 = createClient({ url: 'redis://127.0.0.1:6380' });
const redis3 = createClient({ url: 'redis://127.0.0.1:6381' });

redis1.on('error', err => console.log('Redis Client Error', err));
redis2.on('error', err => console.log('Redis Client Error', err));
redis3.on('error', err => console.log('Redis Client Error', err));

fetchData();