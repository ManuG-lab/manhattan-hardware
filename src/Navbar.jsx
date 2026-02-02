import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Hardware Inventory</Link>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Desktop menu */}
        <div className="hidden md:flex space-x-4">
          {user ? (
            <>
              <Link to="/" className="hover:underline">Inventory</Link>
              <Link to="/add" className="hover:underline">Add Product</Link>
              <Link to="/sales" className="hover:underline">Sales</Link>
              <button onClick={handleLogout} className="hover:underline">Logout</button>
            </>
          ) : (
            <Link to="/login" className="hover:underline">Login</Link>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 space-y-2">
          {user ? (
            <>
              <Link to="/" className="block hover:underline py-2" onClick={() => setIsMenuOpen(false)}>Inventory</Link>
              <Link to="/add" className="block hover:underline py-2" onClick={() => setIsMenuOpen(false)}>Add Product</Link>
              <Link to="/sales" className="block hover:underline py-2" onClick={() => setIsMenuOpen(false)}>Sales</Link>
              <button onClick={handleLogout} className="block hover:underline py-2 text-left w-full">Logout</button>
            </>
          ) : (
            <Link to="/login" className="block hover:underline py-2" onClick={() => setIsMenuOpen(false)}>Login</Link>
          )}
        </div>
      )}
    </nav>
  );
}
