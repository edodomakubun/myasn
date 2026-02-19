import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { Card, Button, Form, Alert, Spinner, Badge, Row, Col } from 'react-bootstrap';
import FileUpload from '../components/FileUpload';

const Family = () => {
  const { session, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [canEdit, setCanEdit] = useState(false);
  const [familyData, setFamilyData] = useState({ kk_url: '', birth_cert_url: '' });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchSettingsAndData();
  }, [session]);

  const fetchSettingsAndData = async () => {
    setLoading(true);
    // Check setting
    const { data: settings } = await supabase
      .from('app_settings')
      .select('is_open')
      .eq('key', 'family_edit')
      .single();

    setCanEdit(settings?.is_open || profile?.role === 'admin');

    // Fetch Data
    const { data, error } = await supabase
      .from('family')
      .select('*')
      .eq('profile_id', session.user.id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "No rows found"
        console.error(error);
        setError(error.message);
    } else if (data) {
        setFamilyData(data);
    }

    setLoading(false);
  };

  const handleUploadKK = async (url) => {
    await saveUpdate({ kk_url: url });
  };

  const handleUploadAkte = async (url) => {
    await saveUpdate({ birth_cert_url: url });
  };

  const saveUpdate = async (updates) => {
    setError(null);
    setSuccess(null);

    const payload = {
        profile_id: session.user.id,
        ...familyData,
        ...updates
    };

    // Check if exists
    const { data: existing } = await supabase.from('family').select('id').eq('profile_id', session.user.id).single();

    let result;
    if (existing) {
        result = await supabase.from('family').update(updates).eq('id', existing.id);
    } else {
        result = await supabase.from('family').insert([payload]);
    }

    if (result.error) {
        setError(result.error.message);
    } else {
        setSuccess('File berhasil disimpan.');
        setFamilyData(prev => ({ ...prev, ...updates }));
    }
  };

  if (loading) return <Spinner animation="border" />;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Data Keluarga (Dokumen)</h2>
        <div>
          {!canEdit && <Badge bg="danger" className="me-2 p-2">Edit Ditutup</Badge>}
          {canEdit && <Badge bg="success" className="me-2 p-2">Edit Dibuka</Badge>}
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Row>
        <Col md={6} className="mb-4">
            <Card className="h-100 shadow-sm">
                <Card.Header className="bg-primary text-white">Kartu Keluarga (KK)</Card.Header>
                <Card.Body>
                    <p className="text-muted">Upload scan Kartu Keluarga terbaru.</p>
                    <FileUpload
                        bucketName="documents"
                        folderPath="family"
                        onUpload={handleUploadKK}
                        currentUrl={familyData.kk_url}
                        disabled={!canEdit}
                    />
                </Card.Body>
            </Card>
        </Col>
        <Col md={6} className="mb-4">
            <Card className="h-100 shadow-sm">
                <Card.Header className="bg-primary text-white">Akte Kelahiran</Card.Header>
                <Card.Body>
                    <p className="text-muted">Upload scan Akte Kelahiran Guru.</p>
                    <FileUpload
                        bucketName="documents"
                        folderPath="family"
                        onUpload={handleUploadAkte}
                        currentUrl={familyData.birth_cert_url}
                        disabled={!canEdit}
                    />
                </Card.Body>
            </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Family;
