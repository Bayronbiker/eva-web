import React from 'react';
import LegalLayout, { G, GL } from './LegalLayout';
import { Shield, Database, Lock, Users, Trash2, Mail } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <LegalLayout
      titulo="Política de Privacidad"
      subtitulo="Última actualización: 11 de mayo de 2026"
    >
      {/* Resumen visual */}
      <div style={{
        background: GL, borderRadius: '14px', padding: '18px 20px',
        marginBottom: '28px', display: 'flex', gap: '14px', alignItems: 'flex-start'
      }}>
        <Shield size={22} color={G} style={{ flexShrink: 0, marginTop: '2px' }} />
        <p style={{ margin: 0, fontSize: '14px', color: '#1B5E20', lineHeight: 1.6 }}>
          <strong>En resumen:</strong> Tomamos tu privacidad en serio. Solo recolectamos lo
          mínimo necesario para que EVA funcione, no vendemos tu información y puedes
          solicitar la eliminación de tu cuenta en cualquier momento.
        </p>
      </div>

      <h2 style={s.h2}>1. Quiénes somos</h2>
      <p>
        EVA Finanzas es una aplicación de gestión contable para pequeñas y medianas
        empresas (PYMES) en Colombia. Esta política describe cómo recolectamos, usamos
        y protegemos tu información cuando usas nuestra aplicación móvil y plataforma web.
      </p>

      <h2 style={s.h2}>2. Información que recolectamos</h2>
      <p>Para brindarte el servicio, recolectamos los siguientes tipos de datos:</p>

      <Bloque icon={<Users size={18} color={G} />} titulo="Datos de cuenta">
        <ul style={s.ul}>
          <li>Nombre completo</li>
          <li>Correo electrónico</li>
          <li>Contraseña (almacenada con cifrado bcrypt — nunca en texto plano)</li>
          <li>Información de tu negocio: nombre, NIT, dirección, teléfono</li>
        </ul>
      </Bloque>

      <Bloque icon={<Database size={18} color={G} />} titulo="Datos de uso de la app">
        <ul style={s.ul}>
          <li>Movimientos financieros que registras (ingresos, gastos)</li>
          <li>Facturas, cotizaciones y remisiones que generas</li>
          <li>Productos de tu inventario</li>
          <li>Información de tus clientes (la que tú agregues manualmente)</li>
        </ul>
      </Bloque>

      <Bloque icon={<Lock size={18} color={G} />} titulo="Datos técnicos">
        <ul style={s.ul}>
          <li>Modelo de dispositivo y versión de Android</li>
          <li>Versión de la app de EVA</li>
          <li>Logs de errores (para mejorar la app)</li>
        </ul>
        <p style={{ ...s.muted, marginTop: '8px' }}>
          No recolectamos ubicación GPS, contactos, fotos ni archivos del dispositivo.
        </p>
      </Bloque>

      <h2 style={s.h2}>3. Cómo usamos tu información</h2>
      <p>Usamos tus datos exclusivamente para:</p>
      <ul style={s.ul}>
        <li>Permitirte iniciar sesión y mantener tu cuenta activa</li>
        <li>Almacenar de forma segura tus registros contables</li>
        <li>Generar reportes y estadísticas personalizados de tu negocio</li>
        <li>Enviarte notificaciones importantes sobre tu cuenta (por correo)</li>
        <li>Detectar y prevenir uso indebido o fraudulento de la app</li>
        <li>Mejorar la app a través del análisis de errores anónimos</li>
      </ul>

      <h2 style={s.h2}>4. Cómo protegemos tu información</h2>
      <ul style={s.ul}>
        <li><strong>Cifrado en tránsito:</strong> toda la comunicación entre la app
          y nuestros servidores viaja por HTTPS (TLS 1.2+)</li>
        <li><strong>Contraseñas con hash:</strong> usamos bcrypt; nadie en EVA puede ver
          tu contraseña en texto plano</li>
        <li><strong>Acceso restringido:</strong> solo personal autorizado puede acceder
          a la infraestructura, y todo acceso queda registrado</li>
        <li><strong>Copias de seguridad:</strong> realizamos backups diarios automáticos</li>
      </ul>

      <h2 style={s.h2}>5. Con quién compartimos tu información</h2>
      <div style={{
        background: '#FFF3E0', borderRadius: '12px', padding: '16px 18px',
        borderLeft: '4px solid #FF9800', marginBottom: '20px'
      }}>
        <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#E65100' }}>
          🛡️ EVA nunca vende, alquila ni comparte tu información personal con terceros
          para fines publicitarios o de marketing.
        </p>
      </div>
      <p>Únicamente compartimos datos en estos casos limitados:</p>
      <ul style={s.ul}>
        <li><strong>Proveedores de infraestructura:</strong> hospedaje en la nube
          (Railway, Vercel) bajo acuerdos de confidencialidad</li>
        <li><strong>Requerimientos legales:</strong> si una autoridad colombiana competente
          lo exige mediante orden judicial</li>
      </ul>

      <h2 style={s.h2}>6. Tus derechos</h2>
      <p>Conforme a la Ley 1581 de 2012 (Habeas Data en Colombia), tienes derecho a:</p>
      <ul style={s.ul}>
        <li><strong>Acceder</strong> a tu información personal almacenada en EVA</li>
        <li><strong>Corregir</strong> datos inexactos o desactualizados</li>
        <li><strong>Eliminar</strong> tu cuenta y todos los datos asociados</li>
        <li><strong>Exportar</strong> tus datos en formato PDF o Excel</li>
        <li><strong>Revocar</strong> el consentimiento de uso en cualquier momento</li>
      </ul>

      <Bloque icon={<Trash2 size={18} color={G} />} titulo="Eliminación de cuenta">
        <p style={{ margin: 0 }}>
          Para eliminar tu cuenta, escríbenos a{' '}
          <a href="mailto:soporte@evafinanzas.com" style={s.link}>soporte@evafinanzas.com</a>{' '}
          desde el correo registrado. Procesaremos la solicitud en un máximo de 15 días
          hábiles y recibirás confirmación por correo cuando se complete.
        </p>
      </Bloque>

      <h2 style={s.h2}>7. Retención de datos</h2>
      <p>
        Mantenemos tu información mientras tu cuenta esté activa. Si eliminas tu cuenta,
        borramos todos tus datos personales en un plazo máximo de 30 días, excepto aquella
        información que estemos obligados a conservar por ley (por ejemplo, registros
        contables que la DIAN exija retener).
      </p>

      <h2 style={s.h2}>8. Privacidad de menores</h2>
      <p>
        EVA no está dirigida a menores de 18 años. No recolectamos intencionalmente datos
        de menores. Si descubrimos que un menor se registró sin consentimiento de sus
        padres, eliminaremos su cuenta inmediatamente.
      </p>

      <h2 style={s.h2}>9. Cambios a esta política</h2>
      <p>
        Si modificamos esta política, te notificaremos a través de la app y por correo
        al menos 30 días antes de que los cambios entren en vigor. La fecha en la parte
        superior indica la última actualización.
      </p>

      <h2 style={s.h2}>10. Contacto</h2>
      <Bloque icon={<Mail size={18} color={G} />} titulo="¿Preguntas sobre privacidad?">
        <p style={{ margin: 0 }}>
          Escríbenos a{' '}
          <a href="mailto:soporte@evafinanzas.com" style={s.link}>soporte@evafinanzas.com</a>
          {' '}o por WhatsApp al{' '}
          <a href="https://wa.me/573226798678" style={s.link}>+57 322 679 8678</a>.
          Respondemos en menos de 48 horas hábiles.
        </p>
      </Bloque>
    </LegalLayout>
  );
};

/** Bloque visual con ícono y título */
const Bloque = ({ icon, titulo, children }) => (
  <div style={{
    background: '#F9FBF5', borderRadius: '12px', padding: '16px 18px',
    marginBottom: '16px', borderLeft: `3px solid ${G}`
  }}>
    <div style={{
      display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px'
    }}>
      {icon}
      <strong style={{ fontSize: '14px', color: '#1B5E20' }}>{titulo}</strong>
    </div>
    {children}
  </div>
);

/** Estilos compartidos */
const s = {
  h2: { fontSize: '20px', fontWeight: 800, marginTop: '32px', marginBottom: '12px', color: '#1A1A1A' },
  ul: { margin: '8px 0', paddingLeft: '20px' },
  muted: { fontSize: '13px', color: '#757575', margin: 0 },
  link: { color: G, fontWeight: 600, textDecoration: 'none' }
};

export default PrivacyPolicy;
