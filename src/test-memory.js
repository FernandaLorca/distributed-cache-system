import fetch from 'node-fetch';
import { createClient } from 'redis';

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

//requests
const url = "https://api.sampleapis.com/movies/"
const endPoints = ["animation", "classic", "comedy", "drama", "horror", "family", "mystery", "western"]
const retraso = (ms) => new Promise(resolve => setTimeout(resolve, ms));
async function afterdelay(){  
  for(let i = 0; i<5000; i++){   
      //await retraso(1000); 
      let movie = generateEndPointsRandom();
      let key = movie[0] + "-" + movie[1];
      try {
        const check = await checkRedisData(movie[1], key);      //check data in redis, return data
        if (check.length == 0) {                          //data is not in redis, check.length = 0                  
          const response = await fetch(url + "/" + movie[0] + "/" + movie[1]);
          if (!response.ok){
            throw new Error('Error en la respuesta del servidor: ' + response.status);
          }
          const content = await response.text();
          let ttl = generateRandom(5000,10000);

          if (movie[1] > 0 && movie[1] < 30) {                          //set in redis1
            await redis1.set(key, content, {EX : ttl})
            console.log((i+1) + ": Se guarda id " + movie[0] + "/" + movie[1] + " en redis1 " );
            
          } else if (movie[1] > 29 && movie[1] < 59) {                  //set in redis2
            await redis2.set(key, content, {EX : ttl})
            console.log((i+1) + ": Se guarda id " + movie[0] + "/" + movie[1] + " en redis2 " );
            
          } else {                                          //set in redis3
            await redis3.set(key, content, {EX : ttl})
            console.log((i+1) + ": Se guarda id " + movie[0] + "/" + movie[1] + " en redis3 " );
            
          }               
        } else {                
          console.log((i+1) + ": Estaba en caché la movie: " + movie[0] + "/" + movie[1]);                        //data is already in redis
        }
      } catch (error) {
        console.error('Error al obtener los datos: ' + error);
        await retraso(3000);
      }
    }
}

async function checkRedisData(id, key) {
  let dataRedis = "";

  if (id > 0 && id < 30) {                 //get in redis1
    const value = await redis1.get(key);
    if (value != null) {
      dataRedis = value;
    }
  } else if (id > 29 && id < 59) {        //get in redis2
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

afterdelay();