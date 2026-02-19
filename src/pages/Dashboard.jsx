import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { Card, Button, Row, Col, Badge, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {
  User, BookOpen, Briefcase, DollarSign, Award, Users, FileText, CheckCircle, XCircle
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
    { key: 'profile_edit', title: 'Profil', icon: <User size={32} />, link: '/profile', desc: 'Data Diri & Kontak' },
    { key: 'education_edit', title: 'Pendidikan', icon: <BookOpen size={32} />, link: '/education', desc: 'Riwayat Sekolah & Kuliah' },
    { key: 'rank_edit', title: 'Pangkat', icon: <Briefcase size={32} />, link: '/rank', desc: 'Riwayat Golongan & Jabatan' },
    { key: 'salary_edit', title: 'Gaji Berkala', icon: <DollarSign size={32} />, link: '/salary', desc: 'Riwayat Kenaikan Gaji' },
    { key: 'certification_edit', title: 'Sertifikasi', icon: <Award size={32} />, link: '/certification', desc: 'Sertifikat Pendidik & Keahlian' },
    { key: 'family_edit', title: 'Keluarga', icon: <Users size={32} />, link: '/family', desc: 'Data Suami/Istri & Anak' },
    { key: 'appointment_edit', title: 'Dokumen', icon: <FileText size={32} />, link: '/documents', desc: 'SK Pengangkatan & Mengajar' },
  ];

  if (loading) return <div className="text-center p-5"><Spinner animation="border" /></div>;

  return (
    <div>
      <div className="mb-4">
        <h2 className="fw-bold text-primary">Selamat Datang, {profile?.name || 'Guru'}!</h2>
        <p className="text-muted">
          Selamat datang di Aplikasi Peremajaan Data Guru (MyASN Clone).
          Silakan perbarui data Anda pada menu yang tersedia di bawah ini.
        </p>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row xs={1} md={2} lg={3} xl={4} className="g-4">
        {modules.map((mod) => {
          const status = getFeatureStatus(mod.key);
          const isOpen = status.isOpen || profile?.role === 'admin';

          return (
            <Col key={mod.key}>
              <Card className="h-100 shadow-sm border-0 hover-card">
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="p-3 bg-light rounded-circle text-primary">
                      {mod.icon}
                    </div>
                    <Badge bg={isOpen ? "success" : "secondary"} pill>
                      {isOpen ? "Dibuka" : "Ditutup"}
                    </Badge>
                  </div>

                  <Card.Title className="fw-bold">{mod.title}</Card.Title>
                  <Card.Text className="text-muted small flex-grow-1">
                    {mod.desc}
                  </Card.Text>

                  <div className="mt-3">
                    <Button as={Link} to={mod.link} variant="outline-primary" className="w-100">
                      Buka Menu
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>

      <div className="mt-5 p-4 bg-white rounded shadow-sm border">
        <h5 className="mb-3 fw-bold">Informasi Status Peremajaan Data</h5>
        <div className="table-responsive">
          <table className="table table-borderless">
            <thead>
              <tr className="text-muted border-bottom">
                <th>Modul Data</th>
                <th>Status Edit</th>
                <th>Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {modules.map((mod) => {
                 const status = getFeatureStatus(mod.key);
                 return (
                  <tr key={mod.key}>
                    <td className="fw-medium">{mod.title}</td>
                    <td>
                      {status.isOpen ? (
                        <span className="text-success"><CheckCircle size={16} className="me-1"/> Buka</span>
                      ) : (
                        <span className="text-secondary"><XCircle size={16} className="me-1"/> Tutup</span>
                      )}
                    </td>
                    <td className="text-muted small">
                      {status.isOpen ? "Anda dapat menambah, mengubah, atau menghapus data." : "Menu hanya dapat dilihat (Read-only)."}
                    </td>
                  </tr>
                 );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
