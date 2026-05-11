import React from 'react';
import LegalLayout, { G, GL } from './LegalLayout';
import {
  Sparkles, Target, Users, Smartphone, Globe, Heart, Mail, Phone
} from 'lucide-react';

const About = () => {
  return (
    <LegalLayout
      titulo="Acerca de EVA"
      subtitulo="Versión 1.0.0 · Build 1"
    >
      {/* Mensaje principal */}
      <div style={{
        background: `linear-gradient(135deg, ${GL} 0%, #F9FBF5 100%)`,
        borderRadius: '16px', padding: '24px',
        marginBottom: '28px', textAlign: 'center'
      }}>
        <Sparkles size={32} color={G} style={{ margin: '0 auto 12px' }} />
        <h2 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: 800, color: '#1B5E20' }}>
          Contabilidad simple para negocios reales
        </h2>
        <p style={{ margin: 0, fontSize: '14px', color: '#558B2F', lineHeight: 1.6 }}>
          EVA nació con una misión clara: ayudar a las pequeñas y medianas empresas
          colombianas a llevar sus finanzas con orden, claridad y sin complicaciones.
        </p>
      </div>

      <h2 style={s.h2}>¿Qué es EVA?</h2>
      <p>
        EVA Finanzas es una aplicación móvil y plataforma web pensada para microempresarios,
        emprendedores y pequeñas empresas que necesitan llevar el control de sus ingresos,
        gastos, facturación e inventario, sin tener que ser contadores ni invertir en
        software costoso.
      </p>

      <h2 style={s.h2}>Funciones principales</h2>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '12px', marginTop: '12px'
      }}>
        <Feature
          icon="💰"
          titulo="Balance diario"
          descripcion="Registra ingresos y gastos al instante con categorías personalizables"
        />
        <Feature
          icon="📄"
          titulo="Facturación"
          descripcion="Facturas, cotizaciones y remisiones en PDF profesional"
        />
        <Feature
          icon="📦"
          titulo="Inventario"
          descripcion="Control de productos con fotos, precios y stock automático"
        />
        <Feature
          icon="👥"
          titulo="Clientes"
          descripcion="Base de datos completa con NIT, contacto y dirección"
        />
        <Feature
          icon="📊"
          titulo="Estadísticas"
          descripcion="Gráficos diarios, semanales y mensuales con historial"
        />
        <Feature
          icon="📤"
          titulo="Exportación"
          descripcion="Descarga reportes en PDF o Excel cuando quieras"
        />
      </div>

      <h2 style={s.h2}>¿Para quién es EVA?</h2>
      <Bloque icon={<Target size={18} color={G} />} titulo="EVA es ideal para:">
        <ul style={s.ul}>
          <li>Tiendas de barrio, micro-mercados y minimarkets</li>
          <li>Talleres de reparación y servicios técnicos</li>
          <li>Vendedores independientes y emprendedores</li>
          <li>Pequeñas distribuidoras y comercializadoras</li>
          <li>Profesionales independientes (estilistas, plomeros, electricistas, etc.)</li>
          <li>Cualquier negocio que necesite control financiero sin complicaciones</li>
        </ul>
      </Bloque>

      <h2 style={s.h2}>Nuestra misión</h2>
      <Bloque icon={<Heart size={18} color={G} />} titulo="">
        <p style={{ margin: 0, fontStyle: 'italic', fontSize: '15px', lineHeight: 1.7 }}>
          "Democratizar las herramientas financieras profesionales para que cualquier
          microempresa colombiana pueda crecer con datos claros, decisiones informadas
          y sin barreras técnicas."
        </p>
      </Bloque>

      <h2 style={s.h2}>Disponible en</h2>
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '12px'
      }}>
        <Plataforma icon={<Smartphone size={20} color={G} />} label="Android (Play Store)" />
        <Plataforma icon={<Globe size={20} color={G} />} label="Web (cualquier navegador)" />
      </div>

      <h2 style={s.h2}>El equipo detrás de EVA</h2>
      <div style={{
        background: '#fff', borderRadius: '14px', padding: '20px',
        border: `1px solid #E8E8E8`, display: 'flex', gap: '16px', alignItems: 'center'
      }}>
        <div style={{
          width: '64px', height: '64px', borderRadius: '16px',
          background: G, color: '#fff', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          fontSize: '24px', fontWeight: 900, flexShrink: 0
        }}>
          BZ
        </div>
        <div>
          <h3 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 800 }}>
            Bayron Zamudio Santafe
          </h3>
          <p style={{ margin: '0 0 4px', fontSize: '12px', color: G, fontWeight: 700, letterSpacing: '0.5px' }}>
            DISEÑADOR & FULL STACK DEVELOPER
          </p>
          <p style={{ margin: 0, fontSize: '13px', color: '#757575' }}>
            Creador, desarrollador y soporte directo de EVA. Colombia 🇨🇴
          </p>
        </div>
      </div>

      <h2 style={s.h2}>Tecnología</h2>
      <p>EVA está construida con tecnologías modernas y robustas:</p>
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px'
      }}>
        {['Kotlin', 'Jetpack Compose', 'React', 'Node.js', 'MongoDB', 'Firebase', 'Material 3']
          .map(tech => (
            <span key={tech} style={{
              background: GL, color: '#1B5E20', padding: '6px 12px',
              borderRadius: '12px', fontSize: '12px', fontWeight: 600
            }}>
              {tech}
            </span>
          ))}
      </div>

      <h2 style={s.h2}>Contáctanos</h2>
      <Bloque icon={<Mail size={18} color={G} />} titulo="¿Tienes una idea o feedback?">
        <p style={{ margin: '0 0 8px' }}>Nos encantaría escucharte:</p>
        <p style={{ margin: '0 0 4px' }}>
          <strong>Email:</strong>{' '}
          <a href="mailto:soporte@evafinanzas.com" style={s.link}>
            soporte@evafinanzas.com
          </a>
        </p>
        <p style={{ margin: 0 }}>
          <strong>WhatsApp:</strong>{' '}
          <a href="https://wa.me/573226798678" style={s.link}>
            +57 322 679 8678
          </a>
        </p>
      </Bloque>
    </LegalLayout>
  );
};

/** Tarjeta de feature con emoji */
const Feature = ({ icon, titulo, descripcion }) => (
  <div style={{
    background: '#fff', borderRadius: '12px', padding: '14px',
    border: '1px solid #E8E8E8'
  }}>
    <div style={{ fontSize: '24px', marginBottom: '6px' }}>{icon}</div>
    <div style={{ fontSize: '13px', fontWeight: 700, color: '#1A1A1A', marginBottom: '2px' }}>
      {titulo}
    </div>
    <div style={{ fontSize: '11px', color: '#757575', lineHeight: 1.5 }}>
      {descripcion}
    </div>
  </div>
);

/** Pill de plataforma */
const Plataforma = ({ icon, label }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: '8px',
    background: '#fff', border: '1px solid #E8E8E8',
    borderRadius: '12px', padding: '10px 14px'
  }}>
    {icon}
    <span style={{ fontSize: '13px', fontWeight: 600, color: '#1A1A1A' }}>
      {label}
    </span>
  </div>
);

const Bloque = ({ icon, titulo, children }) => (
  <div style={{
    background: '#F9FBF5', borderRadius: '12px', padding: '16px 18px',
    marginBottom: '16px', borderLeft: `3px solid ${G}`
  }}>
    {titulo && (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        {icon}
        <strong style={{ fontSize: '14px', color: '#1B5E20' }}>{titulo}</strong>
      </div>
    )}
    {children}
  </div>
);

const s = {
  h2: { fontSize: '20px', fontWeight: 800, marginTop: '32px', marginBottom: '12px', color: '#1A1A1A' },
  ul: { margin: '8px 0', paddingLeft: '20px' },
  link: { color: G, fontWeight: 600, textDecoration: 'none' }
};

export default About;
