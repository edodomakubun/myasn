import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar, Nav, Offcanvas, Button, Container } from 'react-bootstrap';
import { User, BookOpen, Briefcase, DollarSign, Award, Users, FileText, LogOut, Settings, Menu, LayoutDashboard } from 'lucide-react';

const Layout = () => {
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const [showSidebar, setShowSidebar] = useState(false);

  const isActive = (path) => location.pathname === path;
  const linkClass = (path) => `nav-link text-white ${isActive(path) ? 'bg-primary rounded' : ''}`;

  const handleClose = () => setShowSidebar(false);
  const handleShow = () => setShowSidebar(true);

  return (
    <div className="d-flex" style={{ height: '100vh', overflow: 'hidden', backgroundColor: '#f8f9fa' }}>
      {/* Desktop Sidebar (Hidden on Mobile) */}
      <div className="d-none d-lg-flex flex-column" style={{ width: '280px', flexShrink: 0 }}>
        <SidebarContent linkClass={linkClass} handleClose={handleClose} profile={profile} signOut={signOut} />
      </div>

      {/* Mobile Offcanvas Sidebar */}
      <Offcanvas show={showSidebar} onHide={handleClose} className="d-lg-none p-0 border-0" style={{ width: '280px' }}>
        <Offcanvas.Body className="p-0">
          <SidebarContent linkClass={linkClass} handleClose={handleClose} profile={profile} signOut={signOut} />
        </Offcanvas.Body>
      </Offcanvas>

      {/* Main Content Area */}
      <div className="flex-grow-1 d-flex flex-column h-100 bg-light w-100">
        <Navbar bg="white" className="border-bottom shadow-sm px-3 py-3 flex-shrink-0 sticky-top">
            <Container fluid className="px-0">
                <div className="d-flex align-items-center">
                    <Button variant="outline-secondary" className="d-lg-none me-3 border-0" onClick={handleShow}>
                        <Menu size={24} />
                    </Button>
                    <h5 className="m-0 fw-bold text-primary text-truncate">Peremajaan Data Guru</h5>
                </div>
            </Container>
        </Navbar>

        <div className="flex-grow-1 overflow-auto p-3 p-md-4">
           <Outlet />
        </div>
      </div>
    </div>
  );
};

const SidebarContent = ({ linkClass, handleClose, profile, signOut }) => (
  <div className="d-flex flex-column h-100 p-3 sidebar-gradient">
    <h4 className="mb-4 text-center fw-bold d-none d-lg-block text-white">MYASN Guru</h4>
    <Nav className="flex-column flex-grow-1 gap-2 mt-2 mt-lg-0">
      <Link to="/" className={linkClass('/')} onClick={handleClose}>
          <LayoutDashboard size={18} className="me-2" /> Dashboard
        </Link>
      <Link to="/profile" className={linkClass('/profile')} onClick={handleClose}>
          <User size={18} className="me-2" /> Profil
        </Link>
        <Link to="/education" className={linkClass('/education')} onClick={handleClose}>
          <BookOpen size={18} className="me-2" /> Riwayat Pendidikan
        </Link>
        <Link to="/rank" className={linkClass('/rank')} onClick={handleClose}>
          <Briefcase size={18} className="me-2" /> Riwayat Pangkat
        </Link>
        <Link to="/salary" className={linkClass('/salary')} onClick={handleClose}>
          <DollarSign size={18} className="me-2" /> Berkala Gaji
        </Link>
        <Link to="/certification" className={linkClass('/certification')} onClick={handleClose}>
          <Award size={18} className="me-2" /> Riwayat Sertifikasi
        </Link>
        <Link to="/family" className={linkClass('/family')} onClick={handleClose}>
          <Users size={18} className="me-2" /> Data Keluarga
        </Link>
        <Link to="/documents" className={linkClass('/documents')} onClick={handleClose}>
          <FileText size={18} className="me-2" /> Dokumen Lain
        </Link>

        {profile?.role === 'admin' && (
          <>
            <hr className="my-3 text-white-50" />
            <div className="small text-white-50 mb-2 px-3">ADMIN AREA</div>
            <Link to="/admin/settings" className={linkClass('/admin/settings')} onClick={handleClose}>
              <Settings size={18} className="me-2" /> Pengaturan
            </Link>
            <Link to="/admin/users" className={linkClass('/admin/users')} onClick={handleClose}>
              <Users size={18} className="me-2" /> Kelola Guru
            </Link>
          </>
        )}
      </Nav>
      <div className="mt-auto border-top border-secondary pt-3">
        <div className="d-flex align-items-center mb-3 px-2">
          <div className="bg-secondary rounded-circle p-2 me-2 d-flex align-items-center justify-content-center" style={{width: 40, height: 40}}>
            <User size={20} />
          </div>
          <div style={{overflow: 'hidden'}}>
            <div className="fw-bold text-truncate">{profile?.name || 'User'}</div>
            <div className="small text-white-50 text-truncate" style={{fontSize: '0.75rem'}}>{profile?.nip || 'No NIP'}</div>
          </div>
        </div>
        <button onClick={signOut} className="btn btn-outline-danger w-100 btn-sm">
          <LogOut size={16} className="me-2" /> Logout
        </button>
      </div>
  </div>
);

export default Layout;
