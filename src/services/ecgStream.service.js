import { EventEmitter } from "events";
import EcgAnalysis from "./ecgAnalysis.js";


class EcgStreamService extends EventEmitter {
  constructor() {
    super();
    this.ringBuffer = [];
    this.RING_CAP = 1000;
    this.subscribers = new Set();
  }

  // Procesar y broadcast datos (equivalente a process_and_broadcast)
  async processAndBroadcast(data) {
    // Aquí puedes aplicar tu lógica de procesamiento (filtros, BPM, etc.)
    const datafiltred = await EcgAnalysis.analyzeECGSignal(data.samples, data.sample_rate);
    // Por ahora solo lo reenvía directamente a los suscriptores
    for (const cb of this.subscribers) {
      try {
        cb(datafiltred); // envía data a cada cliente conectado
      } catch (e) {
        console.error('Error enviando SSE:', e);
      }
    }

    return { success: true, received: data.samples?.length || 0, message: 'Data processed and broadcasted'};
  }

  // Agregar al buffer circular
  addToRingBuffer(block) {
    this.ringBuffer.push(block);
    if (this.ringBuffer.length > this.RING_CAP) {
      this.ringBuffer.shift();
    }
  }

  // Broadcast a suscriptores SSE
  broadcastToSubscribers(block) {
    const payload = JSON.stringify(block);
    this.subscribers.forEach(subscriber => {
      try {
        subscriber.res.write(`data: ${payload}\n\n`);
      } catch (error) {
        // Remover suscriptor si hay error
        this.subscribers.delete(subscriber);
      }
    });
  }

  // Agregar suscriptor SSE
  addSubscriber(callback) {
    // Configurar headers SSE
    
    this.subscribers.add(callback);
    return callback;
  }

  removeSubscriber(callback) {
    this.subscribers.delete(callback);
  }

  // Obtener datos recientes (para /peek)
  getRecent(seconds = 10, deviceId = null) {
    // Puedes implementar memoria tipo ring buffer si lo necesitas
    return [];
  }

}

export default new EcgStreamService();
