import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { Table, Button, Modal, Form, Alert, Spinner, Badge } from 'react-bootstrap';
import FileUpload from '../components/FileUpload';
import { deleteFileFromUrl } from '../utils/storageUtils';
import { Edit, Trash2, Plus, FileText } from 'lucide-react';

const Education = () => {
  const { session, profile } = useAuth();
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canEdit, setCanEdit] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    school_name: '',
    graduation_year: '',
    certificate_url: ''
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSettingsAndData();
  }, [session]);

  const fetchSettingsAndData = async () => {
    setLoading(true);
    // Check setting
    const { data: settings } = await supabase
      .from('app_settings')
      .select('is_open')
      .eq('key', 'education_edit')
      .single();

    setCanEdit(settings?.is_open || profile?.role === 'admin');

    // Fetch Data
    const { data, error } = await supabase
      .from('education')
      .select('*')
      .eq('profile_id', session.user.id)
      .order('graduation_year', { ascending: false });

    if (error) setError(error.message);
    else setDataList(data);

    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileUpload = (url) => {
    setFormData(prev => ({ ...prev, certificate_url: url }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const payload = {
      profile_id: session.user.id,
      ...formData
    };

    let result;
    if (editingId) {
      result = await supabase
        .from('education')
        .update(payload)
        .eq('id', editingId);
    } else {
      result = await supabase
        .from('education')
        .insert([payload]);
    }

    if (result.error) {
      setError(result.error.message);
    } else {
      setShowModal(false);
      setFormData({ school_name: '', graduation_year: '', certificate_url: '' });
      setEditingId(null);
      fetchSettingsAndData();
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      school_name: item.school_name,
      graduation_year: item.graduation_year,
      certificate_url: item.certificate_url || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (item) => {
    if (!window.confirm('Yakin ingin menghapus data ini?')) return;

    if (item.certificate_url) {
      await deleteFileFromUrl(item.certificate_url, 'documents');
    }

    const { error } = await supabase
      .from('education')
      .delete()
      .eq('id', item.id);

    if (error) setError(error.message);
    else fetchSettingsAndData();
  };

  if (loading) return <Spinner animation="border" />;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Riwayat Pendidikan</h2>
        <div>
          {!canEdit && <Badge bg="danger" className="me-2 p-2">Edit Ditutup</Badge>}
          {canEdit && <Badge bg="success" className="me-2 p-2">Edit Dibuka</Badge>}
          <Button disabled={!canEdit} onClick={() => { setEditingId(null); setFormData({ school_name: '', graduation_year: '', certificate_url: '' }); setShowModal(true); }}>
            <Plus size={18} className="me-1" /> Tambah
          </Button>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover responsive className="bg-white shadow-sm">
        <thead>
          <tr>
            <th>Nama Sekolah / Universitas</th>
            <th>Tahun Lulus</th>
            <th>Ijasah</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {dataList.map((item) => (
            <tr key={item.id}>
              <td>{item.school_name}</td>
              <td>{item.graduation_year}</td>
              <td>
                {item.certificate_url ? (
                  <a href={item.certificate_url} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                    <FileText size={18} /> Lihat File
                  </a>
                ) : <span className="text-muted">-</span>}
              </td>
              <td>
                <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEdit(item)} disabled={!canEdit}>
                  <Edit size={16} />
                </Button>
                <Button variant="outline-danger" size="sm" onClick={() => handleDelete(item)} disabled={!canEdit}>
                  <Trash2 size={16} />
                </Button>
              </td>
            </tr>
          ))}
          {dataList.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center py-4 text-muted">Belum ada data pendidikan.</td>
            </tr>
          )}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? 'Edit Pendidikan' : 'Tambah Pendidikan'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nama Sekolah / Universitas</Form.Label>
              <Form.Control
                type="text"
                name="school_name"
                value={formData.school_name}
                onChange={handleInputChange}
                required
                placeholder="Contoh: Universitas Terbuka"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tahun Lulus</Form.Label>
              <Form.Control
                type="number"
                name="graduation_year"
                value={formData.graduation_year}
                onChange={handleInputChange}
                required
                placeholder="Contoh: 2015"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Upload Ijasah (PDF/JPG, Max 2MB)</Form.Label>
              <FileUpload
                bucketName="documents"
                folderPath="education"
                onUpload={handleFileUpload}
                currentUrl={formData.certificate_url}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Batal</Button>
            <Button variant="primary" type="submit">Simpan</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Education;
