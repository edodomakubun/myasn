import React, { useState } from 'react';
import { Nav, Offcanvas, ListGroup } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, User, Menu, BookOpen, Briefcase, DollarSign, Award, Users, FileText, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const BottomNav = () => {
  const location = useLocation();
  const { profile, signOut } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const isActive = (path) => location.pathname === path;
  const activeClass = (path) => isActive(path) ? 'text-primary fw-bold' : 'text-muted';

  const handleClose = () => setShowMenu(false);
  const handleShow = () => setShowMenu(true);

  return (
    <>
      <div className="d-lg-none fixed-bottom bg-white border-top shadow-lg d-flex justify-content-around py-2" style={{ zIndex: 1040, paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <Link to="/" className={`d-flex flex-column align-items-center text-decoration-none small ${activeClass('/')}`}>
          <LayoutDashboard size={24} className="mb-1" />
          <span style={{ fontSize: '0.7rem' }}>Home</span>
        </Link>

        <Link to="/profile" className={`d-flex flex-column align-items-center text-decoration-none small ${activeClass('/profile')}`}>
          <User size={24} className="mb-1" />
          <span style={{ fontSize: '0.7rem' }}>Profil</span>
        </Link>

        <div onClick={handleShow} className={`d-flex flex-column align-items-center text-decoration-none small text-muted`} style={{ cursor: 'pointer' }}>
          <Menu size={24} className="mb-1" />
          <span style={{ fontSize: '0.7rem' }}>Menu</span>
        </div>
      </div>

      {/* Mobile Menu Offcanvas (replaces sidebar for "More" options) */}
      <Offcanvas show={showMenu} onHide={handleClose} placement="bottom" className="d-lg-none rounded-top-xl h-auto" style={{ maxHeight: '85vh' }}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="fw-bold">Menu Lainnya</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-0 pb-5">
          <ListGroup variant="flush">
            <ListGroup.Item as={Link} to="/education" onClick={handleClose} action className="d-flex align-items-center py-3 border-0">
              <div className="bg-primary bg-opacity-10 p-2 rounded-circle me-3"><BookOpen size={20} className="text-primary"/></div>
              <div>
                <div className="fw-semibold">Pendidikan</div>
                <small className="text-muted">Riwayat Sekolah & Kuliah</small>
              </div>
            </ListGroup.Item>
            <ListGroup.Item as={Link} to="/rank" onClick={handleClose} action className="d-flex align-items-center py-3 border-0">
              <div className="bg-success bg-opacity-10 p-2 rounded-circle me-3"><Briefcase size={20} className="text-success"/></div>
              <div>
                <div className="fw-semibold">Pangkat & Golongan</div>
                <small className="text-muted">Riwayat Jabatan</small>
              </div>
            </ListGroup.Item>
            <ListGroup.Item as={Link} to="/salary" onClick={handleClose} action className="d-flex align-items-center py-3 border-0">
               <div className="bg-warning bg-opacity-10 p-2 rounded-circle me-3"><DollarSign size={20} className="text-warning"/></div>
               <div>
                 <div className="fw-semibold">Berkala Gaji</div>
                 <small className="text-muted">Riwayat Kenaikan Gaji</small>
               </div>
            </ListGroup.Item>
            <ListGroup.Item as={Link} to="/certification" onClick={handleClose} action className="d-flex align-items-center py-3 border-0">
               <div className="bg-info bg-opacity-10 p-2 rounded-circle me-3"><Award size={20} className="text-info"/></div>
               <div>
                 <div className="fw-semibold">Sertifikasi</div>
                 <small className="text-muted">Sertifikat Pendidik</small>
               </div>
            </ListGroup.Item>
             <ListGroup.Item as={Link} to="/family" onClick={handleClose} action className="d-flex align-items-center py-3 border-0">
               <div className="bg-danger bg-opacity-10 p-2 rounded-circle me-3"><Users size={20} className="text-danger"/></div>
               <div>
                 <div className="fw-semibold">Keluarga</div>
                 <small className="text-muted">Suami/Istri & Anak</small>
               </div>
            </ListGroup.Item>
             <ListGroup.Item as={Link} to="/documents" onClick={handleClose} action className="d-flex align-items-center py-3 border-0">
               <div className="bg-secondary bg-opacity-10 p-2 rounded-circle me-3"><FileText size={20} className="text-secondary"/></div>
               <div>
                 <div className="fw-semibold">Dokumen</div>
                 <small className="text-muted">SK & Berkas Penting</small>
               </div>
            </ListGroup.Item>

            {profile?.role === 'admin' && (
              <>
                <div className="px-3 py-2 bg-light small fw-bold text-muted mt-2">ADMINISTRATOR</div>
                <ListGroup.Item as={Link} to="/admin/settings" onClick={handleClose} action className="d-flex align-items-center py-3 border-0">
                  <Settings size={20} className="me-3 text-dark"/> Pengaturan Aplikasi
                </ListGroup.Item>
                <ListGroup.Item as={Link} to="/admin/users" onClick={handleClose} action className="d-flex align-items-center py-3 border-0">
                  <Users size={20} className="me-3 text-dark"/> Kelola Pengguna
                </ListGroup.Item>
              </>
            )}

            <ListGroup.Item action onClick={() => { handleClose(); signOut(); }} className="d-flex align-items-center py-3 mt-2 text-danger border-0">
                <LogOut size={20} className="me-3" /> Keluar Aplikasi
            </ListGroup.Item>
          </ListGroup>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default BottomNav;
