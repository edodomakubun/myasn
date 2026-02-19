import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { User, BookOpen, Briefcase, DollarSign, Award, Users, FileText, LogOut, Settings } from 'lucide-react';

const Layout = () => {
  const { profile, signOut } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;
  const linkClass = (path) => `nav-link text-white ${isActive(path) ? 'bg-primary rounded' : ''}`;

  return (
    <div className="d-flex" style={{ height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar */}
      <div className="bg-dark text-white p-3 d-flex flex-column" style={{ width: '280px', flexShrink: 0 }}>
        <h4 className="mb-4 text-center fw-bold">MYASN Guru</h4>
        <Nav className="flex-column flex-grow-1 gap-1">
          <Link to="/" className={linkClass('/')}>
            <User size={18} className="me-2" /> Profil
          </Link>
          <Link to="/education" className={linkClass('/education')}>
            <BookOpen size={18} className="me-2" /> Riwayat Pendidikan
          </Link>
          <Link to="/rank" className={linkClass('/rank')}>
            <Briefcase size={18} className="me-2" /> Riwayat Pangkat
          </Link>
          <Link to="/salary" className={linkClass('/salary')}>
            <DollarSign size={18} className="me-2" /> Berkala Gaji
          </Link>
          <Link to="/certification" className={linkClass('/certification')}>
            <Award size={18} className="me-2" /> Riwayat Sertifikasi
          </Link>
          <Link to="/family" className={linkClass('/family')}>
            <Users size={18} className="me-2" /> Data Keluarga
          </Link>
          <Link to="/documents" className={linkClass('/documents')}>
            <FileText size={18} className="me-2" /> Dokumen Lain
          </Link>

          {profile?.role === 'admin' && (
            <>
              <hr className="my-3" />
              <div className="small text-muted mb-2 px-3">ADMIN AREA</div>
              <Link to="/admin/settings" className={linkClass('/admin/settings')}>
                <Settings size={18} className="me-2" /> Pengaturan
              </Link>
              <Link to="/admin/users" className={linkClass('/admin/users')}>
                <Users size={18} className="me-2" /> Kelola Guru
              </Link>
            </>
          )}
        </Nav>
        <div className="mt-auto border-top pt-3">
          <div className="d-flex align-items-center mb-3 px-2">
            <div className="bg-secondary rounded-circle p-2 me-2 d-flex align-items-center justify-content-center" style={{width: 40, height: 40}}>
              <User size={20} />
            </div>
            <div style={{overflow: 'hidden'}}>
              <div className="fw-bold text-truncate">{profile?.name || 'User'}</div>
              <div className="small text-muted text-truncate" style={{fontSize: '0.75rem'}}>{profile?.nip || 'No NIP'}</div>
            </div>
          </div>
          <button onClick={signOut} className="btn btn-outline-danger w-100 btn-sm">
            <LogOut size={16} className="me-2" /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 d-flex flex-column h-100 bg-light">
        <Navbar bg="white" className="border-bottom shadow-sm px-4 py-3 flex-shrink-0">
            <h5 className="m-0 fw-bold text-primary">Peremajaan Data Guru</h5>
        </Navbar>
        <div className="flex-grow-1 overflow-auto p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
