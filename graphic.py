import matplotlib.pyplot as plt

with open('response_times.txt', 'r') as archivo:
    times = archivo.read()
    data = [float(dato) for dato in times.split()]

plt.plot(data)
plt.xlabel('Peticiones')
plt.ylabel('Tiempo de respuesta (ms)')
plt.show()