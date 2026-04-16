import React from 'react';

// Genera HTML para imprimir como PDF con formato legal colombiano
// Funciona para facturas, cotizaciones y remisiones

const ImprimirDocumento = ({ tipo, datos, empresa }) => {
  // tipo: 'factura' | 'cotizacion' | 'remision'
  // datos: objeto del documento
  // empresa: datos del emisor
};

// Funcion que genera e imprime el PDF
export const imprimirDocumento = (tipo, datos, empresa = {}) => {
  const now = new Date();
  const fechaEmision = now.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
  const horaEmision = now.toLocaleTimeString('es-CO');

  const fmt = (n) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n || 0);

  const item = datos.items?.[0] || {};
  const subtotal = datos.subtotal || 0;
  const iva = datos.iva || 0;
  const total = datos.total || 0;
  const ivaValor = subtotal * (iva / 100);

  const tituloDoc = tipo === 'factura' ? 'FACTURA DE VENTA' : tipo === 'cotizacion' ? 'COTIZACION' : 'REMISION DE ENTREGA';
  const prefijo = tipo === 'factura' ? 'FAC' : tipo === 'cotizacion' ? 'COT' : 'REM';

  const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${tituloDoc} - ${datos.numero || prefijo + '-001'}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, Helvetica, sans-serif; font-size: 11px; color: #1a1a1a; background: #fff; padding: 20px; }
    .page { max-width: 794px; margin: 0 auto; }

    /* ENCABEZADO */
    .header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 16px; border-bottom: 2px solid #2E7D32; margin-bottom: 16px; }
    .empresa-nombre { font-size: 20px; font-weight: 900; color: #2E7D32; margin-bottom: 3px; }
    .empresa-info { font-size: 10px; color: #666; line-height: 1.5; }
    .doc-box { background: #2E7D32; color: white; padding: 12px 18px; border-radius: 10px; text-align: right; min-width: 180px; }
    .doc-titulo { font-size: 13px; font-weight: 900; letter-spacing: 0.5px; margin-bottom: 4px; }
    .doc-numero { font-size: 16px; font-weight: 900; margin-bottom: 6px; }
    .doc-fecha { font-size: 10px; opacity: 0.85; }

    /* AVISO LEGAL */
    .aviso-legal { background: #f9f9f9; border: 1px solid #e0e0e0; border-radius: 6px; padding: 8px 12px; margin-bottom: 14px; font-size: 9.5px; color: #666; line-height: 1.5; }
    .aviso-legal strong { color: #2E7D32; }

    /* PARTES */
    .partes { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px; }
    .parte-box { border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; }
    .parte-header { background: #f0f0f0; padding: 6px 12px; font-size: 10px; font-weight: 700; color: #555; text-transform: uppercase; letter-spacing: 0.5px; }
    .parte-body { padding: 10px 12px; font-size: 10.5px; line-height: 1.7; }
    .parte-nombre { font-size: 13px; font-weight: 900; color: #1a1a1a; margin-bottom: 2px; }

    /* TABLA ITEMS */
    table { width: 100%; border-collapse: collapse; margin-bottom: 14px; }
    thead tr { background: #2E7D32; }
    thead th { color: white; padding: 8px 10px; text-align: left; font-size: 10px; font-weight: 700; text-transform: uppercase; }
    thead th:last-child { text-align: right; }
    tbody tr { border-bottom: 1px solid #f0f0f0; }
    tbody tr:nth-child(even) { background: #fafafa; }
    tbody td { padding: 9px 10px; font-size: 10.5px; }
    tbody td:last-child { text-align: right; font-weight: 700; }

    /* TOTALES */
    .totales { display: flex; justify-content: flex-end; margin-bottom: 16px; }
    .totales-box { width: 260px; }
    .total-row { display: flex; justify-content: space-between; padding: 5px 0; font-size: 10.5px; border-bottom: 1px solid #f0f0f0; }
    .total-row:last-child { border-bottom: none; }
    .total-final { display: flex; justify-content: space-between; padding: 10px 12px; background: #1a1a1a; border-radius: 8px; margin-top: 8px; }
    .total-final span { color: white; font-size: 11px; font-weight: 700; }
    .total-final strong { color: #4CAF50; font-size: 15px; font-weight: 900; }

    /* CONDICIONES */
    .condiciones { border: 1px solid #e0e0e0; border-radius: 8px; padding: 10px 14px; margin-bottom: 14px; }
    .condiciones h4 { font-size: 10px; font-weight: 700; color: #2E7D32; text-transform: uppercase; margin-bottom: 6px; }
    .condiciones p { font-size: 10px; color: #666; line-height: 1.6; }

    /* FIRMA */
    .firmas { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px; }
    .firma-box { border-top: 1px solid #1a1a1a; padding-top: 6px; text-align: center; }
    .firma-nombre { font-size: 10.5px; font-weight: 700; color: #1a1a1a; }
    .firma-cargo { font-size: 9.5px; color: #666; }

    /* PIE */
    .pie { text-align: center; margin-top: 16px; padding-top: 12px; border-top: 1px solid #e0e0e0; font-size: 9px; color: #999; line-height: 1.6; }

    @media print {
      body { padding: 10px; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
<div class="page">

  <!-- ENCABEZADO -->
  <div class="header">
    <div>
      <div class="empresa-nombre">${empresa.nombre || 'EVA - Gestion Empresarial'}</div>
      <div class="empresa-info">
        ${empresa.nit ? 'NIT: ' + empresa.nit + '<br/>' : ''}
        ${empresa.direccion ? empresa.direccion + '<br/>' : ''}
        ${empresa.telefono ? 'Tel: ' + empresa.telefono + '<br/>' : ''}
        ${empresa.email ? empresa.email : ''}
      </div>
    </div>
    <div class="doc-box">
      <div class="doc-titulo">${tituloDoc}</div>
      <div class="doc-numero">${datos.numero || prefijo + '-001'}</div>
      <div class="doc-fecha">Emitido: ${fechaEmision}</div>
      <div class="doc-fecha">${horaEmision}</div>
    </div>
  </div>

  <!-- AVISO LEGAL (solo facturas) -->
  ${tipo === 'factura' ? `
  <div class="aviso-legal">
    <strong>Documento Equivalente</strong> - Emitido en cumplimiento de la <strong>Resolucion DIAN 000042 de 2020</strong> y el
    <strong>Decreto 358 de 2020</strong>. Este documento no reemplaza la factura electronica de venta habilitada ante la DIAN.
    Para factura electronica con validacion previa, consulte con su contador o proveedor tecnologico autorizado por la DIAN.
    Regimen: <strong>Simplificado / Comun</strong> segun corresponda.
  </div>
  ` : tipo === 'cotizacion' ? `
  <div class="aviso-legal">
    <strong>Cotizacion Comercial</strong> - Este documento es una propuesta economica y NO constituye una factura de venta.
    Validez: <strong>30 dias calendarios</strong> a partir de la fecha de emision. Sujeto a disponibilidad de productos/servicios.
  </div>
  ` : `
  <div class="aviso-legal">
    <strong>Remision de Entrega</strong> - Documento que ampara el despacho fisico de mercancias.
    NO es una factura de venta. Debe ir acompanado de la factura correspondiente para efectos contables y fiscales.
  </div>
  `}

  <!-- PARTES -->
  <div class="partes">
    <div class="parte-box">
      <div class="parte-header">Vendedor / Emisor</div>
      <div class="parte-body">
        <div class="parte-nombre">${empresa.nombre || 'EVA - Gestion Empresarial'}</div>
        ${empresa.nit ? '<span>NIT: ' + empresa.nit + '</span><br/>' : ''}
        ${empresa.direccion ? '<span>' + empresa.direccion + '</span><br/>' : ''}
        ${empresa.telefono ? '<span>Tel: ' + empresa.telefono + '</span>' : ''}
      </div>
    </div>
    <div class="parte-box">
      <div class="parte-header">${tipo === 'factura' ? 'Comprador / Cliente' : 'Cliente'}</div>
      <div class="parte-body">
        <div class="parte-nombre">${datos.clienteNombre || 'No especificado'}</div>
        ${datos.clienteId ? '<span>ID/NIT referenciado en sistema</span>' : ''}
      </div>
    </div>
  </div>

  <!-- TABLA DE ITEMS -->
  <table>
    <thead>
      <tr>
        <th style="width:40%">Descripcion</th>
        <th style="text-align:center">Cantidad</th>
        <th style="text-align:right">Precio Unitario</th>
        ${tipo === 'factura' ? '<th style="text-align:right">IVA</th>' : ''}
        <th style="text-align:right">Total</th>
      </tr>
    </thead>
    <tbody>
      ${(datos.items || [{ descripcion: item.descripcion || 'Servicio / Producto', cantidad: 1, precioUnitario: subtotal, total: subtotal }]).map(it => `
      <tr>
        <td>${it.descripcion || '-'}</td>
        <td style="text-align:center">${it.cantidad || 1}</td>
        <td style="text-align:right">${fmt(it.precioUnitario)}</td>
        ${tipo === 'factura' ? '<td style="text-align:right">' + iva + '%</td>' : ''}
        <td>${fmt(it.total || it.precioUnitario * it.cantidad)}</td>
      </tr>
      `).join('')}
    </tbody>
  </table>

  <!-- TOTALES -->
  <div class="totales">
    <div class="totales-box">
      <div class="total-row">
        <span>Subtotal:</span>
        <span>${fmt(subtotal)}</span>
      </div>
      ${tipo === 'factura' ? `
      <div class="total-row">
        <span>IVA (${iva}%):</span>
        <span>${fmt(ivaValor)}</span>
      </div>
      ` : ''}
      <div class="total-final">
        <span>${tipo === 'factura' ? 'TOTAL A PAGAR:' : 'VALOR TOTAL:'}</span>
        <strong>${fmt(total)}</strong>
      </div>
    </div>
  </div>

  <!-- CONDICIONES -->
  <div class="condiciones">
    <h4>Condiciones ${tipo === 'factura' ? 'de Pago' : tipo === 'cotizacion' ? 'Comerciales' : 'de Entrega'}</h4>
    <p>
      ${tipo === 'factura' ? 'Forma de pago: Contado. El no pago oportuno generara intereses de mora segun la tasa legal vigente. En caso de incumplimiento se podra iniciar proceso de cobro juridico.' :
        tipo === 'cotizacion' ? 'Esta cotizacion tiene una validez de 30 dias calendario. Los precios estan sujetos a cambios sin previo aviso vencido el plazo. Para aceptar la cotizacion, responder por escrito o firmar y devolver este documento.' :
        'La mercancia viaja por cuenta y riesgo del destinatario. Cualquier anomalia en la entrega debe ser reportada dentro de las 24 horas siguientes al recibo de este documento.'}
    </p>
  </div>

  <!-- FIRMAS -->
  <div class="firmas">
    <div class="firma-box">
      <div class="firma-nombre">${empresa.nombre || 'Emisor'}</div>
      <div class="firma-cargo">Firma y sello del vendedor</div>
    </div>
    <div class="firma-box">
      <div class="firma-nombre">${datos.clienteNombre || 'Cliente'}</div>
      <div class="firma-cargo">Firma y cedula del comprador</div>
    </div>
  </div>

  <!-- PIE DE PAGINA -->
  <div class="pie">
    Documento generado por EVA - Sistema de Gestion Empresarial | ${fechaEmision} ${horaEmision}<br/>
    ${tipo === 'factura' ? 'Para efectos tributarios, este documento equivale a soporte de costos y deducciones segun articulo 771-2 del E.T. colombiano.' : ''}
  </div>

</div>
</body>
</html>`;

  const ventana = window.open('', '_blank', 'width=900,height=700');
  if (!ventana) { alert('Permite ventanas emergentes para imprimir el documento.'); return; }
  ventana.document.write(htmlContent);
  ventana.document.close();
  ventana.focus();
  setTimeout(() => { ventana.print(); }, 500);
};

export default ImprimirDocumento;