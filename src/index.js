import fetch from 'node-fetch';
import { createClient } from 'redis';

const endPoints = ["action-adventura", "animation", "classic", "comedy", "drama", 
                  "horror", "family", "mystery", "scifi-fantasy", "western"]

async function fetchData() {
  try {
    const response = await fetch('https://api.sampleapis.com/movies/family');
    if (!response.ok) {
      throw new Error('Error en la respuesta del servidor: ' + response.status);
    }
    const content = await response.text();
    // console.log(content);
    await redis1.set('family', JSON.stringify(content));
    // redis1.set('family', JSON.stringify(content), (err, reply) => {
    //   if (err) {
    //     console.error('Error al establecer el valor en Redis:', err);
    //     return;
    //   }
    //   console.log('Valor establecido en Redis:', reply);
    // });
    //const contenido = await response.json();
    // console.log(contenido);
  } catch (error) {
    console.error('Error al obtener los datos: ' + error);
  }
}

async function dataRedis() {
  await redis1.connect();
  await fetchData();
  const value = await redis1.get('family');

  console.log("********** Respuesta REDIS *********: " + value);
  await redis1.disconnect();
}

function generateEndPoints(){
  // Asegúrate de que min y max sean enteros
  min = Math.ceil(0);
  max = Math.floor(9);
  
  // Genera un número aleatorio entre min y max (inclusive)
  return Math.floor(Math.random() * (max - min + 1)) + min;
  
}

const redis1 = createClient({host: 'localhost', port: 6379,});
const redis2 = createClient({host: 'localhost', port: 6380,});
const redis3 = createClient({host: 'localhost', port: 6381,});

redis1.on('error', err => console.log('Redis Client Error', err));
redis2.on('error', err => console.log('Redis Client Error', err));
redis3.on('error', err => console.log('Redis Client Error', err));

dataRedis();






