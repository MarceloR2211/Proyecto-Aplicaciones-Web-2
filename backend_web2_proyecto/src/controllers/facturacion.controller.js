const FacturacionModel = require('../models/facturacion.model');

const obtenerFacturas = async (req, res) => {
    try {
        const facturas = await FacturacionModel.obtenerFacturas();
        return res.status(200).json({ error: false, facturas });
    } catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
};

const obtenerFacturasDelCliente = async (req, res) => {
    try {
        const usuarioId = req.usuario.id; 
        const facturas = await FacturacionModel.obtenerFacturasDelCliente(usuarioId);
        return res.status(200).json({ error: false, facturas });
    } catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
};

const obtenerFacturaPorId = async (req, res) => {
    const { facturaId } = req.params;
    try {
        const factura = await FacturacionModel.obtenerFacturaPorId(facturaId);
        if (!factura) {
            return res.status(404).json({ error: true, message: 'La factura no existe.' });
        }
        if (req.usuario.rol === 'usuario' && factura.usuario_id !== req.usuario.id) {
            return res.status(403).json({ error: true, message: 'Acceso denegado.' });
        }
        return res.status(200).json({ error: false, factura });
    } catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
};  

const actualizarEstadoYComprobante = async (req, res) => {
    const { facturaId } = req.params;
    const { estado, nombreComprobante } = req.body;
    try {
        const facturaActualizada = await FacturacionModel.actualizarEstadoYComprobante(facturaId, estado, nombreComprobante);
        if (!facturaActualizada) {
            return res.status(404).json({ error: true, message: 'Factura no encontrada.' });
        }
        return res.status(200).json({ error: false, factura: facturaActualizada });
    } catch (error) {
        return res.status(400).json({ error: true, message: error.message });
    }
};

module.exports = {
    obtenerFacturas,
    obtenerFacturasDelCliente,
    obtenerFacturaPorId,
    actualizarEstadoYComprobante
};