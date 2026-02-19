import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { Form, Button, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';
import FileUpload from '../components/FileUpload';

const Profile = () => {
  const { session, profile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(profile || {});
  const [settings, setSettings] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (profile) {
        setProfileData(profile);
    }
    fetchSettings();
  }, [profile, session]);

  const fetchSettings = async () => {
    const { data: settingsData, error: settingsError } = await supabase
      .from('app_settings')
      .select('key, is_open');

    if (settingsError) {
      console.error('Error fetching settings:', settingsError);
    } else {
      const settingsMap = settingsData.reduce((acc, curr) => {
        acc[curr.key] = curr.is_open;
        return acc;
      }, {});
      setSettings(settingsMap);
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handlePhotoUpload = (url) => {
    setProfileData(prev => ({ ...prev, photo_url: url }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);

    const { error } = await supabase
      .from('profiles')
      .update({
        phone: profileData.phone,
        address: profileData.address,
        photo_url: profileData.photo_url
      })
      .eq('id', session.user.id);

    if (error) {
      setError(error.message);
    } else {
      setSuccess('Profil berhasil diperbarui.');
      if (refreshProfile) refreshProfile(); // Refresh global profile state
    }
  };

  if (loading) return <Spinner animation="border" />;

  const canEditProfile = settings['profile_edit'] || profile?.role === 'admin';
  const canEditPhoto = settings['photo_edit'] || profile?.role === 'admin';

  return (
    <div>
      <h2 className="mb-4">Profil Saya</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Row>
        <Col md={4} className="mb-4">
          <Card className="shadow-sm border-0">
            <Card.Body className="text-center">
              <div className="mb-3 d-flex justify-content-center">
                {profileData.photo_url ? (
                  <img
                    src={profileData.photo_url}
                    alt="Foto Profil"
                    className="img-fluid rounded-circle shadow-sm"
                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                  />
                ) : (
                  <div className="bg-secondary rounded-circle d-flex align-items-center justify-content-center text-white display-4 shadow-sm" style={{ width: '150px', height: '150px' }}>
                    {profileData.name ? profileData.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
              </div>
              <h5 className="card-title fw-bold">{profileData.name}</h5>
              <p className="card-text text-muted">{profileData.nip}</p>
              <div className="badge bg-info mb-3">{profileData.role === 'admin' ? 'Administrator' : 'Guru'}</div>

              <div className="mt-3 text-start border-top pt-3">
                  <Form.Label className="small fw-bold">Update Pas Foto</Form.Label>
                  <FileUpload
                    bucketName="documents"
                    folderPath="photos"
                    onUpload={handlePhotoUpload}
                    disabled={!canEditPhoto}
                    accept=".jpg,.jpeg,.png"
                    maxSizeMB={2}
                  />
                  {!canEditPhoto && <small className="text-danger d-block mt-1">Perubahan foto saat ini ditutup oleh admin.</small>}
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <h5 className="mb-3 text-muted">Informasi Dasar (Read-Only)</h5>
                <Row className="mb-3">
                  <Form.Group as={Col} md={6}>
                    <Form.Label>NIP</Form.Label>
                    <Form.Control type="text" value={profileData.nip || ''} readOnly disabled className="bg-light" />
                  </Form.Group>
                  <Form.Group as={Col} md={6}>
                    <Form.Label>NUPTK</Form.Label>
                    <Form.Control type="text" value={profileData.nuptk || '-'} readOnly disabled className="bg-light" />
                  </Form.Group>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Nama Lengkap</Form.Label>
                  <Form.Control type="text" value={profileData.name || ''} readOnly disabled className="bg-light" />
                </Form.Group>

                <Row className="mb-3">
                  <Form.Group as={Col} md={6}>
                    <Form.Label>Unit Kerja</Form.Label>
                    <Form.Control type="text" value={profileData.unit_kerja || ''} readOnly disabled className="bg-light" />
                  </Form.Group>
                  <Form.Group as={Col} md={6}>
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" value={profileData.email || ''} readOnly disabled className="bg-light" />
                  </Form.Group>
                </Row>

                <hr className="my-4" />
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="text-primary m-0">Data Kontak</h5>
                    {!canEditProfile && <span className="badge bg-danger">Edit Ditutup</span>}
                    {canEditProfile && <span className="badge bg-success">Edit Dibuka</span>}
                </div>

                <Form.Group className="mb-3">
                  <Form.Label>No. Handphone</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    value={profileData.phone || ''}
                    onChange={handleInputChange}
                    disabled={!canEditProfile}
                    placeholder="08xxxxxxxx"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Alamat Domisili</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="address"
                    value={profileData.address || ''}
                    onChange={handleInputChange}
                    disabled={!canEditProfile}
                    placeholder="Alamat Lengkap"
                  />
                </Form.Group>

                <div className="d-grid gap-2 mt-4">
                  <Button variant="primary" type="submit" disabled={!canEditProfile && !canEditPhoto} size="lg">
                    Simpan Perubahan
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Profile;
