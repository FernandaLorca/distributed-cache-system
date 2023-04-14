import fetch from 'node-fetch';
import { appendFileSync } from 'fs';

const url = "https://api.sampleapis.com/movies/comedy/"

// const endPoints = ["animation", "classic", "comedy", "drama",
//   "horror", "family", "mystery", "western"] //faltan 2

async function fetchData() {
  try {
    let id = generateRandom(1,87);
    console.log(id);
    const response = await fetch(`${url}${id}`);
    if (!response.ok) {
      throw new Error('Error en la respuesta del servidor: ' + response.status);
    }
    const data = await response.json();
    console.log(data);
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

async function makeRequests(n) {
  const responseTimes = [];
  for (let i = 0; i < n; i++) {
    const startTime = new Date().getTime();
    await fetchData();
    const endTime = new Date().getTime();
    const responseTime = endTime - startTime;
    console.log("Petición " + (i + 1) + ": " + responseTime + " ms");
    // responseTimes.push(responseTime);
    let time = responseTime + "\n"
    appendFileSync('response-times.txt', time, err => {
      if (err) {
        console.error(err);
        return;
      }
    })
  }
  //   return responseTimes;
}

const n = 5000; // número de consultas
makeRequests(n)

