jsx
import { LayoutDashboard, Package, Users, FileText, Settings } from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { title: 'Inicio', icon: <LayoutDashboard />, route: '/' },
    { title: 'Inventario', icon: <Package />, route: '/inventario' },
    { title: 'Facturas', icon: <FileText />, route: '/facturas' },
    { title: 'Clientes', icon: <Users />, route: '/clientes' },
    { title: 'Configuración', icon: <Settings />, route: '/perfil' },
  ];

  return (
    <div className="w-64 h-screen bg-eva-navy text-white p-4 border-r border-eva-surface">
      <h1 className="text-2xl font-bold text-eva-vino mb-8 px-2">EVA Web</h1>
      <nav>
        {menuItems.map((item, index) => (
          <div key={index} className="flex items-center gap-4 p-3 hover:bg-eva-surface rounded-lg cursor-pointer transition-all">
            <span className="text-eva-vino">{item.icon}</span>
            <span className="font-medium">{item.title}</span>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;