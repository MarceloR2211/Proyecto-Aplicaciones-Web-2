const fs = require('fs/promises');
const path = require('path');
const FacturacionModel = require('../models/facturacion.model');

const MAX_PDF_BYTES = 5 * 1024 * 1024;

const subirComprobante = async (req, res) => {
  const facturaId = Number(req.body.facturaId);
  const nombreOriginal = String(req.body.nombreArchivo || '').trim();
  const contenidoBase64 = String(req.body.contenidoBase64 || '');
  const usuarioId = req.usuario?.id;

  if (!facturaId || !usuarioId || !nombreOriginal || !contenidoBase64) {
    return res.status(400).json({
      error: true,
      message: 'Faltan datos del comprobante.'
    });
  }

  const coincidencia = contenidoBase64.match(
    /^data:application\/pdf;base64,(.+)$/
  );

  if (!coincidencia) {
    return res.status(400).json({
      error: true,
      message: 'El comprobante debe ser un archivo PDF válido.'
    });
  }

  const contenido = Buffer.from(coincidencia[1], 'base64');

  if (contenido.length === 0 || contenido.length > MAX_PDF_BYTES) {
    return res.status(400).json({
      error: true,
      message: 'El comprobante no puede superar los 5 MB.'
    });
  }

  const nombreSeguro = `factura-${facturaId}-usuario-${usuarioId}-${Date.now()}.pdf`;
  const directorio = path.join(process.cwd(), 'uploads', 'comprobantes');
  const rutaFisica = path.join(directorio, nombreSeguro);
  const rutaPublica = `/uploads/comprobantes/${nombreSeguro}`;

  try {
    await fs.mkdir(directorio, { recursive: true });
    await fs.writeFile(rutaFisica, contenido);

    const factura = await FacturacionModel.registrarComprobante(
      facturaId,
      usuarioId,
      rutaPublica
    );

    if (!factura) {
      await fs.unlink(rutaFisica).catch(() => undefined);
      return res.status(404).json({
        error: true,
        message: 'La factura no existe, no pertenece al usuario o ya no admite comprobantes.'
      });
    }

    return res.status(200).json({
      error: false,
      message: 'Comprobante registrado correctamente.',
      factura
    });
  } catch (error) {
    console.error('Error al registrar comprobante:', error);
    await fs.unlink(rutaFisica).catch(() => undefined);
    return res.status(500).json({
      error: true,
      message: 'No se pudo guardar el comprobante.'
    });
  }
};

module.exports = { subirComprobante };
