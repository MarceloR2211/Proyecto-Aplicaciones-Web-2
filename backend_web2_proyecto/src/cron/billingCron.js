const cron = require('node-cron');
const facturacionModel = require('../models/facturacion.model');

console.log('[---] Cron Job de facturación cargado y estructurado en MVC . . . ');

// Ejecutar todos los días a la medianoche ('0 0 * * *')
cron.schedule('0 0 * * *', async () => {
    console.log('[---] Iniciando verificación automatizada de facturación mensual . . . ');

    try {
        // Trae los contratos activos (cada fila tiene: id, usuario_id, plan_id, precio)
        const contratos = await facturacionModel.obtenerContratosActivos();
        
        const hoy = new Date();
        const mesActual = hoy.getMonth() + 1;
        const anioActual = hoy.getFullYear();

        // Calcular fecha de vencimiento estándar (+10 días)
        const fechaVencimiento = new Date();
        fechaVencimiento.setDate(fechaVencimiento.getDate() + 10);

        let facturasGeneradas = 0;

        for (const contrato of contratos) {
            // CORRECCIÓN: Usar 'usuario_id' en lugar de 'cliente_id'
            const usuarioId = contrato.usuario_id; 
            const monto = contrato.precio;

            // 1. Validar si ya cuenta con recibo este mes
            const yaTieneFactura = await facturacionModel.verificarFacturaMesActual(
                usuarioId, 
                mesActual, 
                anioActual
            );

            // 2. Si no tiene, se le genera su cobro correspondiente
            if (!yaTieneFactura) {
                // CORRECCIÓN: Enviar parámetros exactos según el modelo unificado (usuarioId, monto, fechaVencimiento)
                await facturacionModel.crearFacturaAutomatica(
                    usuarioId,
                    monto,
                    fechaVencimiento
                );
                
                facturasGeneradas++;
                console.log(`[CRON] Factura autogenerada para el Usuario ID: ${usuarioId}`);
            }
        }

        console.log(`[---] Proceso terminado. Se generaron ${facturasGeneradas} facturas nuevas.`);
    } catch (error) {
        console.error('[CRON ERROR] Error crítico en la ejecución del lote de facturación:', error);
    }
});