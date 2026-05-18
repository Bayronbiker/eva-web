import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ListaProveedores from './ListaProveedores';
import CrearProveedor from './CrearProveedor';
import config from '../../config';

const BASE_URL = config.apiUrl;
const axiosAuth = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

export default function Proveedores({ onBack }) {
  const [proveedores,          setProveedores]          = useState([]);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);
  const [vista,                setVista]                = useState('lista'); // 'lista' | 'crear'
  const [loading,              setLoading]              = useState(true);

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${BASE_URL}/proveedores`, axiosAuth());
      setProveedores(data);
    } catch {
      // silencioso
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const irALista = () => {
    setProveedorSeleccionado(null);
    setVista('lista');
  };

  const irACrear = () => {
    setProveedorSeleccionado(null);
    setVista('crear');
  };

  const irAEditar = (prov) => {
    setProveedorSeleccionado(prov);
    setVista('crear');
  };

  const handleGuardar = async (datos) => {
    try {
      const cfg = axiosAuth();
      const payload = {
        nombre:             datos.nombre,
        nit:                datos.nit,
        ciudad:             datos.ciudad,
        actividadEconomica: datos.actividadEconomica,
        telefono:           datos.telefono,
        email:              datos.email,
        direccion:          datos.direccion,
        notas:              datos.notas,
      };

      if (proveedorSeleccionado) {
        await axios.put(`${BASE_URL}/proveedores/${proveedorSeleccionado._id}`, payload, cfg);
        alert('Proveedor actualizado');
      } else {
        await axios.post(`${BASE_URL}/proveedores`, payload, cfg);
        alert('Proveedor guardado');
      }

      await cargar();
      irALista();
    } catch (e) {
      alert('Error: ' + (e.response?.data?.message || 'Servidor no responde'));
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Eliminar este proveedor?')) return;
    try {
      await axios.delete(`${BASE_URL}/proveedores/${id}`, axiosAuth());
      alert('Proveedor eliminado');
      await cargar();
      irALista();
    } catch {
      alert('Error al eliminar el proveedor');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
        <p style={{ color: '#9e9e9e', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Cargando proveedores...</p>
      </div>
    );
  }

  if (vista === 'crear') {
    return (
      <CrearProveedor
        proveedorAEditar={proveedorSeleccionado || null}
        onBack={irALista}
        onSave={handleGuardar}
        onDelete={handleEliminar}
      />
    );
  }

  return (
    <ListaProveedores
      proveedores={proveedores}
      onNuevo={irACrear}
      onEdit={irAEditar}
    />
  );
}
