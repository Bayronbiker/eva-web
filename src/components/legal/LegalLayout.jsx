import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, ExternalLink } from 'lucide-react';

// Paleta verde EVA
const G   = '#2E7D32';
const G2  = '#1B5E20';
const GL  = '#E8F5E9';
const GBg = '#F1F8E9';

/**
 * Layout compartido para páginas legales (Privacy, Terms, About).
 * Estructura:
 *   - Header verde con gradiente, logo, título y botón "Volver"
 *   - Container central con el contenido (children)
 *   - Footer con email de contacto y links
 *
 * @param {string} titulo       Título principal de la página
 * @param {string} subtitulo    Subtítulo o fecha de última actualización
 * @param {ReactNode} children  Contenido de la página
 */
const LegalLayout = ({ titulo, subtitulo, children }) => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: GBg,
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      color: '#1A1A1A'
    }}>
      {/* ── HEADER ────────────────────────────────────────────────────────── */}
      <header style={{
        background: `linear-gradient(135deg, ${G2} 0%, ${G} 100%)`,
        padding: '24px 20px 48px',
        color: '#fff',
        position: 'relative'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          {/* Top bar: logo + botón volver */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '32px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 900, fontSize: '18px', color: '#fff'
              }}>
                E
              </div>
              <span style={{ fontWeight: 900, fontSize: '22px', letterSpacing: '-0.5px' }}>
                EVA.
              </span>
            </div>
            <button
              type="button"
              onClick={() => navigate(-1)}
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.25)',
                color: '#fff',
                padding: '8px 14px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontFamily: 'inherit'
              }}
            >
              <ArrowLeft size={14} />
              Volver
            </button>
          </div>

          {/* Título y subtítulo */}
          <h1 style={{
            margin: 0,
            fontSize: '32px',
            fontWeight: 900,
            letterSpacing: '-1px',
            lineHeight: 1.15
          }}>
            {titulo}
          </h1>
          {subtitulo && (
            <p style={{
              margin: '8px 0 0',
              fontSize: '13px',
              color: 'rgba(255,255,255,0.8)',
              fontWeight: 500
            }}>
              {subtitulo}
            </p>
          )}
        </div>
      </header>

      {/* ── CONTENIDO ─────────────────────────────────────────────────────── */}
      <main style={{
        maxWidth: '800px',
        margin: '-32px auto 0',
        padding: '0 20px 40px',
        position: 'relative'
      }}>
        <div style={{
          background: '#fff',
          borderRadius: '20px',
          padding: '32px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          lineHeight: 1.7,
          fontSize: '15px',
          color: '#333'
        }}>
          {children}
        </div>
      </main>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '0 20px 40px',
        textAlign: 'center'
      }}>
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px'
        }}>
          <p style={{ margin: 0, fontSize: '13px', color: '#757575' }}>
            ¿Tienes preguntas? Escríbenos:
          </p>
          <a
            href="mailto:soporte@evafinanzas.com"
            style={{
              color: G,
              fontWeight: 700,
              fontSize: '14px',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Mail size={14} />
            soporte@evafinanzas.com
          </a>
        </div>
        <p style={{
          margin: '20px 0 0',
          fontSize: '11px',
          color: '#9E9E9E'
        }}>
          © 2026 EVA Finanzas. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
};

// Exporta también la paleta para que la usen las páginas hijas
export { G, G2, GL, GBg };
export default LegalLayout;
