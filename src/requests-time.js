import fetch from 'node-fetch';
import { writeFileSync } from 'fs';

const urlApi = "https://api.sampleapis.com/movies/"

const endPoints = ["animation", "classic", "comedy", "drama",
  "horror", "family", "mystery", "western"] //faltan 2

async function fetchData() {
  try {
    movie = generateEndPointsRandom();
    const response = await fetch(`${urlApi}${movie[0]}/${movie[1]}`);
    if (!response.ok) {
      throw new Error('Error en la respuesta del servidor: ' + response.status);
    }
    const data = await response.json();
    //console.log(data);
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
/****** 100 peticiones para evaluar la api *****/
async function makeRequests(n) {
  const responseTimes = [];
  for (let i = 0; i < n; i++) {
    const startTime = new Date().getTime();
    await fetchData();
    const endTime = new Date().getTime();
    const responseTime = endTime - startTime;
    console.log("Petición " + (i + 1) + ": " + responseTime + " ms");
    responseTimes.push(responseTime);
  }
  return responseTimes;
}

const n = 5000; // número de consultas
makeRequests(n)
  .then(responseTimes => {
    console.log('Arreglo de tiempos de respuesta:', responseTimes);
    const contenido = responseTimes.join('\n');
    writeFileSync('response_times.txt', contenido, err => {
      if (err) {
        console.error(err);
        return;
      }
    })
  })
  .catch(error => {
    console.error('Error al obtener los datos: ' + error);
  });

/*********************************************/