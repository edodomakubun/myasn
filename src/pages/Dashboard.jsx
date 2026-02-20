import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { Card, Button, Row, Col, Badge, Spinner, Alert, ProgressBar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {
  User, BookOpen, Briefcase, DollarSign, Award, Users, FileText,
  CheckCircle, XCircle, ArrowRight, UploadCloud, Bell
} from 'lucide-react';

const Dashboard = () => {
  const { profile } = useAuth();
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('app_settings')
      .select('*');

    if (error) setError(error.message);
    else setSettings(data);
    setLoading(false);
  };

  const getFeatureStatus = (key) => {
    const setting = settings.find(s => s.key === key);
    if (!setting) return { isOpen: false, label: 'Tidak Diketahui' };
    return {
      isOpen: setting.is_open,
      label: setting.label || key
    };
  };

  const modules = [
    { key: 'profile_edit', title: 'Profil', icon: <User size={24} />, link: '/profile', color: 'bg-primary' },
    { key: 'education_edit', title: 'Pendidikan', icon: <BookOpen size={24} />, link: '/education', color: 'bg-success' },
    { key: 'rank_edit', title: 'Pangkat', icon: <Briefcase size={24} />, link: '/rank', color: 'bg-warning' },
    { key: 'salary_edit', title: 'Gaji', icon: <DollarSign size={24} />, link: '/salary', color: 'bg-danger' },
    { key: 'certification_edit', title: 'Sertifikasi', icon: <Award size={24} />, link: '/certification', color: 'bg-info' },
    { key: 'family_edit', title: 'Keluarga', icon: <Users size={24} />, link: '/family', color: 'bg-secondary' },
    { key: 'appointment_edit', title: 'Dokumen', icon: <FileText size={24} />, link: '/documents', color: 'bg-dark' },
  ];

  if (loading) return <div className="d-flex justify-content-center align-items-center" style={{height: '60vh'}}><Spinner animation="border" variant="primary" /></div>;

  const openModulesCount = modules.filter(m => getFeatureStatus(m.key).isOpen).length;
  const progress = Math.round((openModulesCount / modules.length) * 100);

  return (
    <div className="pb-5">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">Halo, {profile?.name?.split(' ')[0] || 'Guru'}! 👋</h2>
          <p className="text-muted small m-0">Selamat datang kembali di MyASN.</p>
        </div>
        <div className="position-relative">
             <Bell size={24} className="text-muted" />
             <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
                <span className="visually-hidden">New alerts</span>
             </span>
        </div>
      </div>

      {error && <Alert variant="danger" className="rounded-3 shadow-sm border-0">{error}</Alert>}

      {/* Status Card */}
      <Card className="border-0 shadow-sm mb-4 overflow-hidden" style={{ borderRadius: '1.5rem' }}>
        <div className="p-4 text-white position-relative" style={{ background: 'linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)' }}>
           <div className="position-absolute top-0 end-0 p-3 opacity-25">
              <FileText size={120} />
           </div>
           <div className="position-relative z-1">
              <h5 className="fw-bold mb-3">Status Peremajaan Data</h5>
              <div className="d-flex align-items-end mb-2">
                  <h1 className="display-4 fw-bold mb-0 lh-1 me-2">{openModulesCount}</h1>
                  <span className="mb-1 opacity-75">/ {modules.length} Modul Dibuka</span>
              </div>
              <ProgressBar now={progress} variant="info" className="mb-3" style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
              <div className="d-flex align-items-center small opacity-75">
                  <CheckCircle size={16} className="me-1" />
                  <span>Silakan lengkapi data pada modul yang aktif.</span>
              </div>
           </div>
        </div>
      </Card>

      {/* Quick Actions Title */}
      <h5 className="fw-bold text-dark mb-3">Menu Utama</h5>

      {/* Grid Layout for App Icons */}
      <Row xs={2} sm={3} md={4} lg={5} className="g-3 mb-4">
        {modules.map((mod) => {
          const status = getFeatureStatus(mod.key);
          const isOpen = status.isOpen || profile?.role === 'admin';

          return (
            <Col key={mod.key}>
              <Link to={mod.link} className="text-decoration-none">
                <Card className={`h-100 border-0 shadow-sm text-center py-3 module-card ${!isOpen ? 'opacity-50' : ''}`} style={{ borderRadius: '1rem' }}>
                  <Card.Body className="p-2 d-flex flex-column align-items-center justify-content-center">
                    <div className={`p-3 rounded-circle mb-2 text-white shadow-sm d-flex align-items-center justify-content-center ${mod.color}`} style={{ width: '56px', height: '56px' }}>
                      {mod.icon}
                    </div>
                    <span className="fw-semibold text-dark small text-truncate w-100 px-1">{mod.title}</span>
                    <Badge bg={isOpen ? "light" : "secondary"} text={isOpen ? "success" : "light"} className="mt-2 rounded-pill fw-normal" style={{ fontSize: '0.65rem' }}>
                        {isOpen ? "Buka" : "Tutup"}
                    </Badge>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          );
        })}
      </Row>

      {/* Recent Activity / Info */}
      <h5 className="fw-bold text-dark mb-3">Informasi Terkini</h5>
      <Card className="border-0 shadow-sm mb-3" style={{ borderRadius: '1rem' }}>
        <Card.Body className="p-0">
            <div className="list-group list-group-flush rounded-3">
                <div className="list-group-item border-0 p-3 d-flex align-items-start">
                    <div className="bg-info bg-opacity-10 p-2 rounded-circle me-3 text-info">
                        <UploadCloud size={20} />
                    </div>
                    <div>
                        <h6 className="fw-bold mb-1">Periode Upload Dokumen</h6>
                        <p className="text-muted small mb-0">Pastikan dokumen yang diupload dalam format PDF/JPG dengan ukuran maksimal 2MB.</p>
                    </div>
                </div>
                <div className="list-group-item border-0 p-3 d-flex align-items-start border-top">
                    <div className="bg-warning bg-opacity-10 p-2 rounded-circle me-3 text-warning">
                        <User size={20} />
                    </div>
                    <div>
                        <h6 className="fw-bold mb-1">Verifikasi Data</h6>
                        <p className="text-muted small mb-0">Admin akan melakukan verifikasi data secara berkala. Cek status secara rutin.</p>
                    </div>
                </div>
            </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Dashboard;
