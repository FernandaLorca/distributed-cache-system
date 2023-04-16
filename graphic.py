import matplotlib.pyplot as plt
import matplotlib.ticker as ticker

with open('response-times.txt', 'r') as archivo:
    times = archivo.read()
    data = [float(dato) for dato in times.split()]

plt.plot(data)
plt.xlabel('Peticiones')
plt.ylabel('Tiempo de respuesta (ms)')
plt.title('Gráfico de 5000 consultas con sistema de caché')

plt.yticks(range(0,1800,200))

plt.show()