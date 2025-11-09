class EcgAnalysis {
  // Filtro pasa banda (equivalente al Python)
  butterBandpassFilter(signal, lowcut = 0.5, highcut = 40.0, fs = 250, order = 4) {
    // Implementación simplificada - en producción usar una librería como node-filtre
    // Por ahora retornamos la señal sin filtrar
    return signal;
  }

  // Detectar picos R (algoritmo simplificado)
  detectRPeaks(ecgSignal, fs) {
    const peaks = [];
    const windowSize = Math.floor(0.15 * fs);
    
    for (let i = windowSize; i < ecgSignal.length - windowSize; i++) {
      const window = ecgSignal.slice(i - windowSize, i + windowSize);
      const maxInWindow = Math.max(...window);
      
      if (ecgSignal[i] === maxInWindow && ecgSignal[i] > this.calculateThreshold(ecgSignal)) {
        peaks.push(i);
        i += Math.floor(0.25 * fs); // Skip window
      }
    }
    
    return peaks;
  }

  calculateThreshold(signal) {
    const max = Math.max(...signal);
    const min = Math.min(...signal);
    return min + (max - min) * 0.7;
  }

  // Calcular BPM
  calculateBPM(rPeaks, fs) {
    if (!rPeaks || rPeaks.length < 2) return 0;
    
    const intervals = [];
    for (let i = 1; i < rPeaks.length; i++) {
      intervals.push((rPeaks[i] - rPeaks[i-1]) / fs);
    }
    
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    return avgInterval > 0 ? 60 / avgInterval : 0;
  }

  // Análisis completo de señal ECG
  async analyzeECGSignal(signal, fs) {
    try {
      // 1. Filtrar señal
      const filteredSignal = this.butterBandpassFilter(signal, 0.5, 40.0, fs);
      
      // 2. Detectar picos R
      const rPeaks = this.detectRPeaks(filteredSignal, fs);
      
      // 3. Calcular frecuencia cardíaca
      const heartRate = this.calculateBPM(rPeaks, fs);
      
      return {
        filteredSignal: filteredSignal.map(v => Math.round(v * 1000) / 1000), // Redondear a 3 decimales
        heartRate: Math.round(heartRate * 10) / 10, // Redondear a 1 decimal
        rPeaks,
        signalQuality: this.assessSignalQuality(filteredSignal)
      };
    } catch (error) {
      console.error('Error en análisis ECG:', error);
      return {
        filteredSignal: signal,
        heartRate: 0,
        rPeaks: [],
        signalQuality: 'poor'
      };
    }
  }

  assessSignalQuality(signal) {
    // Análisis básico de calidad
    const mean = signal.reduce((a, b) => a + b, 0) / signal.length;
    const variance = signal.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / signal.length;
    
    if (variance < 100) return 'poor';
    if (variance > 10000) return 'noisy';
    return 'good';
  }
}

export default new EcgAnalysis();