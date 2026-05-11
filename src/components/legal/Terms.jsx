import React from 'react';
import LegalLayout, { G, GL } from './LegalLayout';
import { FileText, AlertTriangle, CheckCircle, XCircle, Scale } from 'lucide-react';

const Terms = () => {
  return (
    <LegalLayout
      titulo="Términos y Condiciones"
      subtitulo="Última actualización: 11 de mayo de 2026"
    >
      {/* Resumen */}
      <div style={{
        background: GL, borderRadius: '14px', padding: '18px 20px',
        marginBottom: '28px', display: 'flex', gap: '14px', alignItems: 'flex-start'
      }}>
        <Scale size={22} color={G} style={{ flexShrink: 0, marginTop: '2px' }} />
        <p style={{ margin: 0, fontSize: '14px', color: '#1B5E20', lineHeight: 1.6 }}>
          <strong>En resumen:</strong> Al usar EVA aceptas estas reglas. EVA es una
          herramienta de apoyo contable; las decisiones financieras finales son tuyas.
          Te comprometes a no usar la app para fines ilegales.
        </p>
      </div>

      <h2 style={s.h2}>1. Aceptación de los términos</h2>
      <p>
        Al descargar, instalar o usar EVA Finanzas ("la app", "el servicio") aceptas
        cumplir con estos términos. Si no estás de acuerdo, por favor desinstala la app
        y no la uses. El uso continuado tras cualquier modificación implica aceptación
        de los nuevos términos.
      </p>

      <h2 style={s.h2}>2. Descripción del servicio</h2>
      <p>
        EVA es una herramienta de software que te ayuda a llevar el control contable
        básico de tu negocio: registro de ingresos y gastos, generación de facturas,
        cotizaciones y remisiones, control de inventario, gestión de clientes y
        generación de reportes.
      </p>
      <p>
        <strong>EVA no es:</strong> un asesor contable, fiscal ni legal. La app provee
        herramientas, pero las decisiones financieras, tributarias y legales son
        responsabilidad exclusiva del usuario.
      </p>

      <h2 style={s.h2}>3. Registro y cuenta</h2>
      <Bloque icon={<CheckCircle size={18} color={G} />} titulo="Para registrarte debes:">
        <ul style={s.ul}>
          <li>Ser mayor de 18 años o tener autorización legal para realizar negocios</li>
          <li>Proporcionar información veraz, exacta y completa</li>
          <li>Mantener actualizados los datos de tu cuenta</li>
          <li>Proteger tu contraseña — no la compartas con nadie</li>
        </ul>
      </Bloque>

      <p>
        Eres responsable de toda actividad que ocurra en tu cuenta. Si detectas un acceso
        no autorizado, debes notificarlo inmediatamente a{' '}
        <a href="mailto:soporte@evafinanzas.com" style={s.link}>soporte@evafinanzas.com</a>.
      </p>

      <h2 style={s.h2}>4. Uso aceptable</h2>
      <Bloque icon={<XCircle size={18} color="#D32F2F" />} titulo="Está prohibido:">
        <ul style={s.ul}>
          <li>Usar EVA para actividades ilegales, fraudulentas o de lavado de activos</li>
          <li>Registrar datos falsos o inflados con fines de evasión tributaria</li>
          <li>Intentar acceder a datos de otros usuarios</li>
          <li>Aplicar ingeniería inversa, descompilar o intentar copiar el código</li>
          <li>Sobrecargar nuestros servidores con peticiones automatizadas</li>
          <li>Revender, redistribuir o sublicenciar la app sin nuestra autorización</li>
          <li>Usar la app para acosar, difamar o dañar a terceros</li>
        </ul>
      </Bloque>
      <p>
        El incumplimiento puede resultar en la suspensión o terminación inmediata de tu
        cuenta, además de las acciones legales que correspondan.
      </p>

      <h2 style={s.h2}>5. Suscripción y pagos</h2>
      <p>
        Actualmente EVA ofrece un plan gratuito con funciones completas durante el
        período de lanzamiento. En el futuro podríamos introducir planes pagos; cuando
        eso ocurra, te notificaremos con al menos 30 días de anticipación y podrás
        decidir si continúas con un plan pago o exportas tus datos.
      </p>

      <h2 style={s.h2}>6. Propiedad intelectual</h2>
      <p>
        El código fuente, diseño, logos, textos y demás elementos de EVA son propiedad
        de EVA Finanzas y están protegidos por las leyes de derechos de autor.
      </p>
      <p>
        <strong>Tus datos son tuyos.</strong> Toda la información que ingresas en EVA
        (movimientos, facturas, clientes, productos) te pertenece. Puedes exportarla
        en cualquier momento desde la app.
      </p>

      <h2 style={s.h2}>7. Disponibilidad del servicio</h2>
      <p>
        Hacemos nuestro mejor esfuerzo para mantener EVA disponible 24/7, pero no
        garantizamos disponibilidad ininterrumpida. Pueden existir pausas por
        mantenimiento programado, fallas de infraestructura o causas de fuerza mayor.
      </p>
      <p>
        Recomendamos hacer copias periódicas de tus datos exportándolos en PDF/Excel
        desde la sección de Estadísticas o Balance.
      </p>

      <h2 style={s.h2}>8. Limitación de responsabilidad</h2>
      <Bloque icon={<AlertTriangle size={18} color="#F57C00" />} titulo="Importante:">
        <p style={{ margin: 0 }}>
          EVA se proporciona "tal cual" sin garantías de ningún tipo. No nos hacemos
          responsables por:
        </p>
        <ul style={{ ...s.ul, marginTop: '8px' }}>
          <li>Pérdidas económicas derivadas de decisiones tomadas usando datos de EVA</li>
          <li>Errores en los cálculos o reportes generados por la app</li>
          <li>Multas o sanciones por incumplimiento tributario</li>
          <li>Pérdida de datos por fallas técnicas, fuerza mayor o terminación de cuenta</li>
          <li>Daños indirectos, incidentales o consecuentes</li>
        </ul>
      </Bloque>
      <p>
        <strong>Recomendación:</strong> contrata un contador profesional para validar
        tus declaraciones tributarias y decisiones financieras importantes.
      </p>

      <h2 style={s.h2}>9. Terminación</h2>
      <p>
        Puedes dejar de usar EVA en cualquier momento simplemente desinstalando la app
        o solicitando la eliminación de tu cuenta por correo.
      </p>
      <p>
        Nos reservamos el derecho de suspender o terminar tu acceso si:
      </p>
      <ul style={s.ul}>
        <li>Violas estos términos</li>
        <li>Realizas actividad fraudulenta o ilegal</li>
        <li>Tu cuenta permanece inactiva por más de 24 meses consecutivos</li>
      </ul>

      <h2 style={s.h2}>10. Modificaciones</h2>
      <p>
        Podemos actualizar estos términos en el tiempo. Cualquier cambio será notificado
        en la app y por correo al menos 30 días antes de su entrada en vigor. La fecha
        de "última actualización" en la parte superior indica la versión vigente.
      </p>

      <h2 style={s.h2}>11. Ley aplicable y jurisdicción</h2>
      <p>
        Estos términos se rigen por las leyes de la República de Colombia. Cualquier
        controversia será resuelta ante los jueces competentes de la ciudad de Bogotá D.C.
      </p>

      <h2 style={s.h2}>12. Contacto</h2>
      <Bloque icon={<FileText size={18} color={G} />} titulo="¿Dudas sobre estos términos?">
        <p style={{ margin: 0 }}>
          Escríbenos a{' '}
          <a href="mailto:soporte@evafinanzas.com" style={s.link}>soporte@evafinanzas.com</a>
          {' '}o por WhatsApp al{' '}
          <a href="https://wa.me/573226798678" style={s.link}>+57 322 679 8678</a>.
        </p>
      </Bloque>
    </LegalLayout>
  );
};

const Bloque = ({ icon, titulo, children }) => (
  <div style={{
    background: '#F9FBF5', borderRadius: '12px', padding: '16px 18px',
    marginBottom: '16px', borderLeft: `3px solid ${G}`
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
      {icon}
      <strong style={{ fontSize: '14px', color: '#1B5E20' }}>{titulo}</strong>
    </div>
    {children}
  </div>
);

const s = {
  h2: { fontSize: '20px', fontWeight: 800, marginTop: '32px', marginBottom: '12px', color: '#1A1A1A' },
  ul: { margin: '8px 0', paddingLeft: '20px' },
  link: { color: G, fontWeight: 600, textDecoration: 'none' }
};

export default Terms;
