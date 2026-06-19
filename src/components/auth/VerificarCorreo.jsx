import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ShieldCheck, RotateCcw, Loader2, ArrowLeft } from 'lucide-react';
import api from '../../api/client';
import config from '../../config';

const VerificarCorreo = () => {
  const navigate = useNavigate();
  const pendingToken = localStorage.getItem('pendingToken');
  const pendingEmailInicial = localStorage.getItem('pendingEmail') || '';

  // ── Estado ─────────────────────────────────────────────────────────────────
  const [email, setEmail]               = useState(pendingEmailInicial);
  const [emailInput, setEmailInput]     = useState(pendingEmailInicial);
  const [needsEmail, setNeedsEmail]     = useState(!pendingEmailInicial);
  const [codeSent, setCodeSent]         = useState(!!pendingEmailInicial);
  const [code, setCode]                 = useState('');
  const [isLoading, setIsLoading]       = useState(false);
  const [isVerifying, setIsVerifying]   = useState(false);
  const [cooldownSec, setCooldownSec]   = useState(pendingEmailInicial ? 60 : 0);
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage]   = useState('');

  const cooldownRef = useRef(null);

  // Si no hay pendingToken, no hay flujo posible: vuelve al login.
  useEffect(() => {
    if (!pendingToken) navigate('/login', { replace: true });
  }, [pendingToken, navigate]);

  // Cooldown reactivo
  useEffect(() => {
    if (cooldownSec <= 0) return;
    cooldownRef.current = setTimeout(
      () => setCooldownSec((s) => Math.max(0, s - 1)),
      1000
    );
    return () => clearTimeout(cooldownRef.current);
  }, [cooldownSec]);

  const iniciarCooldown = (segs) => setCooldownSec(segs);

  // ── Enviar/reenviar código ────────────────────────────────────────────────
  const enviarCodigo = async () => {
    if (cooldownSec > 0 || isLoading) return;
    setErrorMessage('');
    setInfoMessage('');

    if (needsEmail) {
      const v = emailInput.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
        setErrorMessage('Ingresa un correo válido');
        return;
      }
    }
    setIsLoading(true);
    try {
      const body = needsEmail ? { email: emailInput.trim() } : {};
      const res = await api.post(config.endpoints.sendCode, body);
      const emailFinal = res.data?.email || emailInput.trim() || email;
      setEmail(emailFinal);
      localStorage.setItem('pendingEmail', emailFinal);
      setNeedsEmail(false);
      setCodeSent(true);
      setInfoMessage(`Te enviamos un código a ${emailFinal}. Revisa tu bandeja (y spam).`);
      iniciarCooldown(60);
    } catch (err) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message || 'No se pudo enviar el código.';
      if (status === 429) {
        // Rate-limit: usamos retryAfter si vino, si no 45s por defecto.
        const espera = err?.response?.data?.retryAfter || 45;
        iniciarCooldown(espera);
      }
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Verificar código ──────────────────────────────────────────────────────
  const verificarCodigo = async () => {
    if (code.length !== 6 || isVerifying) return;
    setErrorMessage('');
    setInfoMessage('');
    setIsVerifying(true);
    try {
      const res = await api.post(config.endpoints.verifyCode, { code });
      const token = res.data?.token;
      const user  = res.data?.user;
      if (!token) {
        setErrorMessage('Respuesta inesperada del servidor');
        return;
      }
      // Verificación OK: intercambiamos pendingToken por el authToken real.
      localStorage.setItem('token', token);
      if (user) localStorage.setItem('user', JSON.stringify(user));
      localStorage.removeItem('pendingToken');
      localStorage.removeItem('pendingEmail');
      localStorage.removeItem('pendingUserId');
      navigate('/home', { replace: true });
    } catch (err) {
      const msg = err?.response?.data?.message || 'Código incorrecto';
      setErrorMessage(msg);
      setCode('');
    } finally {
      setIsVerifying(false);
    }
  };

  const cancelar = () => {
    localStorage.removeItem('pendingToken');
    localStorage.removeItem('pendingEmail');
    localStorage.removeItem('pendingUserId');
    navigate('/login', { replace: true });
  };

  // Solo dígitos, máximo 6
  const onCodeChange = (v) => {
    const limpio = v.replace(/\D/g, '').slice(0, 6);
    setCode(limpio);
    setErrorMessage('');
  };

  return (
    <div
      className="flex min-h-screen w-screen items-center justify-center p-4 box-border"
      style={{ background: 'var(--eva-bg)' }}
    >
      <div
        className="eva-card w-full max-w-[440px] p-10 box-border"
        style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)' }}
      >
        {/* Icono central */}
        <div className="mb-6 flex flex-col items-center">
          <div
            className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{ background: 'var(--eva-primary-light)' }}
          >
            <Mail size={32} style={{ color: 'var(--eva-primary)' }} />
          </div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--eva-text)' }}>
            Verifica tu correo
          </h1>
          <p className="mt-2 px-2 text-center text-sm" style={{ color: 'var(--eva-text-muted)' }}>
            {needsEmail
              ? 'Necesitamos confirmar un correo electrónico para tu cuenta.'
              : email
                ? `Te enviamos un código de 6 dígitos a ${email}. Revisa tu bandeja (incluido spam).`
                : 'Te enviamos un código de 6 dígitos a tu correo. Revisa tu bandeja (incluido spam).'}
          </p>
        </div>

        {/* Mensajes */}
        {errorMessage && (
          <div
            className="mb-4 rounded-xl border px-4 py-3 text-center text-sm font-semibold"
            style={{
              background: 'var(--eva-danger-light)',
              borderColor: 'var(--eva-danger)',
              color: 'var(--eva-danger)',
            }}
          >
            {errorMessage}
          </div>
        )}
        {infoMessage && !errorMessage && (
          <div
            className="mb-4 rounded-xl border px-4 py-3 text-center text-sm font-semibold"
            style={{
              background: 'var(--eva-primary-light)',
              borderColor: 'var(--eva-primary)',
              color: 'var(--eva-primary)',
            }}
          >
            {infoMessage}
          </div>
        )}

        {/* Input email (solo si needsEmail) */}
        {needsEmail ? (
          <>
            <div className="mb-4 w-full">
              <label
                className="mb-1.5 block text-sm font-semibold"
                style={{ color: 'var(--eva-text)' }}
              >
                Tu correo electrónico
              </label>
              <div className="relative w-full">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  size={18}
                  style={{ color: 'var(--eva-text-muted)' }}
                />
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className="eva-input w-full pl-11 pr-4 py-3 box-border"
                  autoComplete="email"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={enviarCodigo}
              disabled={
                isLoading ||
                cooldownSec > 0 ||
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.trim())
              }
              className="eva-btn-primary flex w-full items-center justify-center gap-2 py-4 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <Mail size={18} /> Enviar código
                </>
              )}
            </button>
          </>
        ) : (
          <>
            {/* Input código */}
            <div className="mb-4 w-full">
              <label
                className="mb-1.5 block text-sm font-semibold"
                style={{ color: 'var(--eva-text)' }}
              >
                Código de verificación
              </label>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={code}
                onChange={(e) => onCodeChange(e.target.value)}
                placeholder="123456"
                maxLength={6}
                className="eva-input w-full px-4 py-3 box-border text-center"
                style={{
                  fontSize: '28px',
                  fontWeight: 800,
                  letterSpacing: '8px',
                }}
              />
            </div>
            <button
              type="button"
              onClick={verificarCodigo}
              disabled={isVerifying || code.length !== 6}
              className="eva-btn-primary flex w-full items-center justify-center gap-2 py-4 disabled:opacity-50"
            >
              {isVerifying ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <ShieldCheck size={18} /> Verificar
                </>
              )}
            </button>

            {/* Reenviar */}
            <button
              type="button"
              onClick={enviarCodigo}
              disabled={cooldownSec > 0 || isLoading}
              className="mt-3 flex w-full items-center justify-center gap-2 py-2 text-sm font-semibold disabled:opacity-50"
              style={{
                background: 'none',
                border: 'none',
                color:
                  cooldownSec > 0
                    ? 'var(--eva-text-muted)'
                    : 'var(--eva-primary)',
                cursor: cooldownSec > 0 ? 'not-allowed' : 'pointer',
              }}
            >
              <RotateCcw size={14} />
              {cooldownSec > 0
                ? `Reenviar código en ${cooldownSec}s`
                : 'Reenviar código'}
            </button>
          </>
        )}

        {/* Cancelar */}
        <button
          type="button"
          onClick={cancelar}
          className="mt-6 flex w-full items-center justify-center gap-2 py-2 text-xs"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--eva-text-muted)',
            cursor: 'pointer',
          }}
        >
          <ArrowLeft size={12} /> Cancelar y volver al login
        </button>
      </div>
    </div>
  );
};

export default VerificarCorreo;
