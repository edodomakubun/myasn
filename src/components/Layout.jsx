import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar, Nav, Offcanvas, Button, Container, Dropdown } from 'react-bootstrap';
import { User, BookOpen, Briefcase, DollarSign, Award, Users, FileText, LogOut, Settings, Menu, LayoutDashboard, ChevronDown } from 'lucide-react';

const Layout = () => {
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const [showSidebar, setShowSidebar] = useState(false);

  const isActive = (path) => location.pathname === path;
  const linkClass = (path) => `nav-link ${isActive(path) ? 'active' : ''}`;

  const handleClose = () => setShowSidebar(false);
  const handleShow = () => setShowSidebar(true);

  return (
    <div className="d-flex app-container">
      {/* Desktop Sidebar (Hidden on Mobile) */}
      <div className="d-none d-lg-flex flex-column sidebar" style={{ width: '280px', flexShrink: 0 }}>
        <SidebarContent linkClass={linkClass} handleClose={handleClose} profile={profile} />
      </div>

      {/* Mobile Offcanvas Sidebar */}
      <Offcanvas show={showSidebar} onHide={handleClose} className="d-lg-none p-0 border-0" style={{ width: '280px' }}>
        <Offcanvas.Body className="p-0">
          <SidebarContent linkClass={linkClass} handleClose={handleClose} profile={profile} />
        </Offcanvas.Body>
      </Offcanvas>

      {/* Main Content Area */}
      <div className="flex-grow-1 d-flex flex-column h-100 w-100" style={{ overflowX: 'hidden' }}>
        <Navbar className="top-navbar px-3 px-lg-4">
            <Container fluid className="px-0">
                <div className="d-flex align-items-center w-100 justify-content-between">
                    <div className="d-flex align-items-center">
                        <Button variant="outline-secondary" className="d-lg-none me-3 border-0" onClick={handleShow}>
                            <Menu size={24} />
                        </Button>
                        <h5 className="m-0 fw-bold text-primary d-none d-md-block">Peremajaan Data Guru</h5>
                        <h5 className="m-0 fw-bold text-primary d-md-none">MyASN</h5>
                    </div>

                    {/* User Profile Dropdown */}
                    <Dropdown align="end">
                      <Dropdown.Toggle as="div" className="user-dropdown-toggle">
                        <div className="bg-primary bg-opacity-10 rounded-circle p-2 d-flex align-items-center justify-content-center text-primary" style={{width: 36, height: 36}}>
                          <User size={18} />
                        </div>
                        <div className="d-none d-md-block text-start">
                          <div className="fw-semibold small lh-1">{profile?.name || 'User'}</div>
                          <div className="text-muted small" style={{fontSize: '0.75rem'}}>{profile?.role === 'admin' ? 'Administrator' : 'Guru'}</div>
                        </div>
                        <ChevronDown size={14} className="text-muted ms-1" />
                      </Dropdown.Toggle>

                      <Dropdown.Menu className="border-0 shadow-lg rounded-lg mt-2 p-2" style={{minWidth: '200px'}}>
                        <Dropdown.Item as={Link} to="/profile" className="rounded mb-1">
                          <User size={16} className="me-2 text-muted" /> Profil Saya
                        </Dropdown.Item>
                         {profile?.role === 'admin' && (
                            <Dropdown.Item as={Link} to="/admin/settings" className="rounded mb-1">
                              <Settings size={16} className="me-2 text-muted" /> Pengaturan
                            </Dropdown.Item>
                         )}
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={signOut} className="text-danger rounded hover-danger">
                          <LogOut size={16} className="me-2" /> Keluar
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
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

const SidebarContent = ({ linkClass, handleClose, profile }) => (
  <div className="d-flex flex-column h-100 sidebar">
    <div className="sidebar-header">
      <h4 className="m-0 fw-bold text-primary tracking-tight">MYASN <span className="fw-light text-secondary">GURU</span></h4>
    </div>

    <div className="flex-grow-1 overflow-auto p-3">
        <div className="small fw-bold text-muted mb-3 px-2 text-uppercase" style={{fontSize: '0.75rem', letterSpacing: '0.05em'}}>Menu Utama</div>
        <Nav className="flex-column gap-1">
            <Link to="/" className={linkClass('/')} onClick={handleClose}>
                <LayoutDashboard size={18} className="me-3" /> Dashboard
            </Link>
            <Link to="/profile" className={linkClass('/profile')} onClick={handleClose}>
                <User size={18} className="me-3" /> Profil
            </Link>
            <Link to="/education" className={linkClass('/education')} onClick={handleClose}>
                <BookOpen size={18} className="me-3" /> Pendidikan
            </Link>
            <Link to="/rank" className={linkClass('/rank')} onClick={handleClose}>
                <Briefcase size={18} className="me-3" /> Pangkat
            </Link>
            <Link to="/salary" className={linkClass('/salary')} onClick={handleClose}>
                <DollarSign size={18} className="me-3" /> Berkala Gaji
            </Link>
            <Link to="/certification" className={linkClass('/certification')} onClick={handleClose}>
                <Award size={18} className="me-3" /> Sertifikasi
            </Link>
            <Link to="/family" className={linkClass('/family')} onClick={handleClose}>
                <Users size={18} className="me-3" /> Keluarga
            </Link>
            <Link to="/documents" className={linkClass('/documents')} onClick={handleClose}>
                <FileText size={18} className="me-3" /> Dokumen
            </Link>
        </Nav>

        {profile?.role === 'admin' && (
          <>
            <div className="small fw-bold text-muted mt-4 mb-3 px-2 text-uppercase" style={{fontSize: '0.75rem', letterSpacing: '0.05em'}}>Administrator</div>
            <Nav className="flex-column gap-1">
                <Link to="/admin/settings" className={linkClass('/admin/settings')} onClick={handleClose}>
                <Settings size={18} className="me-3" /> Pengaturan
                </Link>
                <Link to="/admin/users" className={linkClass('/admin/users')} onClick={handleClose}>
                <Users size={18} className="me-3" /> Kelola Guru
                </Link>
            </Nav>
          </>
        )}
    </div>

    <div className="p-3 border-top bg-light">
       <div className="d-flex align-items-center text-muted small">
          <span className="me-auto">© 2024 MYASN</span>
          <span>v1.0.0</span>
       </div>
    </div>
  </div>
);

export default Layout;
