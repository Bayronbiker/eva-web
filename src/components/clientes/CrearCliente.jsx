import React, { useState, useEffect } from 'react';
import { ArrowLeft, UserPlus, Save, Mail, Phone, MapPin, Building2, IdCard, Trash2 } from 'lucide-react';

const CrearCliente = ({ onBack, onSave, onDelete, clienteAEditar, primaryGreen }) => {
    const isEditMode = !!clienteAEditar;

    const [nombre, setNombre] = useState(clienteAEditar?.nombre || "");
    const [ciudad, setCiudad] = useState(clienteAEditar?.ciudad || "");
    const [actividadEconomica, setActividadEconomica] = useState(clienteAEditar?.actividadEconomica || "");
    const [cedulaOrNit, setCedulaOrNit] = useState(clienteAEditar?.cedulaOrNit?.toString() || "");
    const [direccion, setDireccion] = useState(clienteAEditar?.direccion || "");
    const [telefono, setTelefono] = useState(clienteAEditar?.telefono || "");
    const [email, setEmail] = useState(clienteAEditar?.email || "");

    // 1. Actualiza la lógica de validación (Línea ~15)
    const isFormularioValido =
        nombre.trim() !== "" &&
        cedulaOrNit.trim() !== "" &&
        email.trim() !== "" &&
        ciudad.trim() !== "" &&
        actividadEconomica.trim() !== ""
        ;

    const handleGuardar = () => {
        const data = { nombre, ciudad, actividadEconomica, cedulaOrNit, direccion, telefono, email };
        if (isEditMode) data._id = clienteAEditar._id;
        onSave(data);
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '50px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                <button onClick={onBack} style={btnBackStyle}><ArrowLeft size={24} /></button>
                <h1 style={{ fontSize: '28px', fontWeight: '900', margin: 0 }}>
                    {isEditMode ? 'Editar Cliente' : 'Nuevo Cliente'}
                </h1>
            </div>

            <div style={cardStyle}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <FormItem label="Nombre del cliente*" icon={<UserPlus size={18}/>}>
                        <input type="text" style={inputStyle} value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre completo" />
                    </FormItem>
                    <FormItem label="Ciudad*" icon={<Building2 size={18}/>}>
                        <input type="text" style={inputStyle} value={ciudad} onChange={(e) => setCiudad(e.target.value)} placeholder="Ej. Bogotá" />
                    </FormItem>
                    <FormItem label="Actividad económica*" icon={<Building2 size={18}/>}>
                        <input type="text" style={inputStyle} value={actividadEconomica} onChange={(e) => setActividadEconomica(e.target.value)} placeholder="Ej. Comercio" />
                    </FormItem>
                    <FormItem label="Cédula o NIT*" icon={<IdCard size={18}/>}>
                        <input type="text" style={inputStyle} value={cedulaOrNit} onChange={(e) => setCedulaOrNit(e.target.value.replace(/\D/g, ""))} placeholder="Sin puntos ni comas" />
                    </FormItem>
                    <FormItem label="Dirección (Opcional)" icon={<MapPin size={18}/>}>
                        <input type="text" style={inputStyle} value={direccion} onChange={(e) => setDireccion(e.target.value)} placeholder="Dirección física" />
                    </FormItem>
                    <FormItem label="Teléfono (Opcional)" icon={<Phone size={18}/>}>
                        <input type="tel" style={inputStyle} value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="Número de contacto" />
                    </FormItem>
                    <div style={{ gridColumn: 'span 2' }}>
                        <FormItem label="E-mail*" icon={<Mail size={18}/>}>
                            <input type="email" style={inputStyle} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="correo@ejemplo.com" />
                        </FormItem>
                    </div>
                </div>

                {/* --- NUEVA FILA DE BOTONES --- */}
                <div style={{ display: 'flex', gap: '20px', marginTop: '40px' }}>
                    {isEditMode && (
                        <button
                            type="button"
                            onClick={() => onDelete(clienteAEditar._id)}
                            style={{ ...btnBase, backgroundColor: '#FF3B30', flex: 1, cursor: 'pointer' }}
                        >
                            <Trash2 size={20} /> ELIMINAR
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={handleGuardar}
                        disabled={!isFormularioValido}
                        style={{
                            ...btnBase,
                            backgroundColor: isFormularioValido ? '#22C55E' : '#E2E8F0', // Verde muy vivo vs Gris pálido
                            flex: isEditMode ? 2 : 1,
                            cursor: isFormularioValido ? 'pointer' : 'not-allowed',
                            boxShadow: isFormularioValido ? '0 4px 14px 0 rgba(34, 199, 89, 0.39)' : 'none'
                        }}
                    >
                        <Save size={20} /> {isEditMode ? "GUARDAR CAMBIOS" : "GUARDAR CLIENTE"}
                    </button>
                </div>
            </div>
        </div>
    );
};

const FormItem = ({ label, icon, children }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#475569', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {icon} {label}
        </label>
        {children}
    </div>
);

const cardStyle = { backgroundColor: 'white', padding: '40px', borderRadius: '32px', border: '1px solid #E2E8F0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' };
const inputStyle = { width: '100%', padding: '12px 15px', borderRadius: '12px', border: '1.5px solid #E2E8F0', fontSize: '16px', outline: 'none', boxSizing: 'border-box' };
const btnBackStyle = { padding: '10px', borderRadius: '12px', border: 'none', backgroundColor: 'white', cursor: 'pointer', color: '#64748B' };
const btnBase = {
    padding: '18px',
    borderRadius: '18px',
    color: 'white',
    border: 'none',
    fontWeight: '900',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
    transition: '0.3s',
    fontSize: '14px',
    cursor: 'pointer' // <--- Esto asegura que el botón de eliminar siempre funcione visualmente
};

export default CrearCliente;