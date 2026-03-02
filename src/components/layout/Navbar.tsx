import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Search, Menu, X, User, Bell, MapPin } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Início', path: '/' },
    { name: 'Casos', path: '/casos' },
    { name: 'Mapa', path: '/mapa' },
    { name: 'Contactos', path: '/contactos' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-dark text-white px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center shadow-lg">
            <MapPin className="text-primary" size={24} />
          </div>
          <span className="font-display font-extrabold text-xl tracking-tight">KULONDA</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-secondary ${
                isActive(link.path) ? 'text-secondary' : 'text-gray-200'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="flex items-center gap-4 ml-4 border-l border-white/20 pl-6">
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <Search size={20} />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <Bell size={20} />
            </button>
            <Link to="/login" className="flex items-center gap-2 bg-secondary text-primary px-4 py-2 rounded-full font-bold text-sm hover:bg-opacity-90 transition-all">
              <User size={18} />
              <span>Entrar</span>
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          className="fixed inset-0 top-[64px] bg-primary z-40 md:hidden p-6 flex flex-col gap-6"
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`text-2xl font-bold ${isActive(link.path) ? 'text-secondary' : 'text-white'}`}
            >
              {link.name}
            </Link>
          ))}
          <hr className="border-white/10" />
          <Link
            to="/login"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center gap-2 bg-secondary text-primary p-4 rounded-xl font-bold text-lg"
          >
            <User size={24} />
            <span>Entrar na Conta</span>
          </Link>
        </motion.div>
      )}
    </nav>
  );
}
