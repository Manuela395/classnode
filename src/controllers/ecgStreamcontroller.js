import ecgStreamService from "../services/ecgStreamService.js";

class EcgStreamController {
  
  // Insertar bloque de datos ECG (POST /ecg-stream/insert)
  async insertBlock(req, res) {
    // //console.log('Insertando bloque de datos ECG');
    try {
      const data = req.body;
      console.log('Datos recibidos:', data);
      
      // Validaciones básicas
      if (!data || typeof data !== 'object') {
        throw res.status(400).json({ 
          success: false, 
          error: 'invalid_json' 
        });
      }

      const requiredFields = ['device_id', 'fs_hz', 'samples'];
      for (const field of requiredFields) {
        if (!(field in data)) {
          throw res.status(400).json({ 
            success: false, 
            error: `missing_field:${field}` 
          });
        }
      }

      // Procesar datos
      const result = await ecgStreamService.processAndBroadcast(data);
      
      if (!result.success) {
        throw res.status(400).json(result);
      }

      res.json({
        success: true,
        received: result.received,
        message: result.message
      });

    } catch (error) {
      console.error('Error en insertBlock:', error);
      res.status(500).json({ 
        success: false, 
        error: `processing_error:${error.message}` 
      });
    }
  }

 // GET /api/ecgstream/stream
  async sseStream(req, res) {
    // Configurar cabeceras SSE
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    });

    // Primer evento (confirmación de conexión)
    res.write('event: connected\ndata: "SSE connection established"\n\n');

    // Registrar suscriptor
    const subscriber = ecgStreamService.addSubscriber((payload) => {
      res.write(`data: ${JSON.stringify(payload)}\n\n`);
    });

    // Heartbeat cada 30 segundos
    const heartbeat = setInterval(() => {
      res.write(': heartbeat\n\n');
    }, 30000);

    // Limpiar al cerrar conexión
    req.on('close', () => {
      clearInterval(heartbeat);
      ecgStreamService.removeSubscriber(subscriber);
      res.end();
    });
  }

  // Obtener datos recientes (GET /ecg-stream/peek)
  peekData(req, res) {
    try {
      const seconds = parseInt(req.query.seconds) || 10;
      const deviceId = req.query.device_id || null;

      const recentData = ecgStreamService.getRecent(seconds, deviceId);
      
      res.json(recentData);

    } catch (error) {
      console.error('Error en peekData:', error);
      res.status(500).json({ 
        success: false, 
        error: 'peek_error' 
      });
    }
  }
}

export default new EcgStreamController();
