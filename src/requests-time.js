import fetch from 'node-fetch';
import { writeFileSync } from 'fs';

async function fetchData() {
  try {
    const response = await fetch('https://api.sampleapis.com/movies/drama');
    if (!response.ok) {
      throw new Error('Error en la respuesta del servidor: ' + response.status);
    }
    const data = await response.json();
    //console.log(data);
  } catch (error) {
    console.error('Error al obtener los datos: ' + error);
  }
}

/****** 100 peticiones para evaluar la api *****/
async function makeRequests(n) {
  const responseTimes = [];
  for (let i = 0; i < n; i++) {
    const startTime = new Date().getTime();
    await fetchData();
    const endTime = new Date().getTime();
    const responseTime = endTime - startTime;
    console.log("Petición " + (i+1) + ": " + responseTime + " ms"); 
    responseTimes.push(responseTime);
  }
  return responseTimes;
}

const n = 100; // número de consultas
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