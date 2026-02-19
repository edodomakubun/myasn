import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { Table, Button, Modal, Form, Alert, Spinner, Badge } from 'react-bootstrap';
import FileUpload from '../../components/FileUpload';
import { deleteFileFromUrl } from '../../utils/storageUtils';
import { Edit, Trash2, Plus, FileText } from 'lucide-react';

const TeachingLoad = () => {
  const { session, profile } = useAuth();
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canEdit, setCanEdit] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    sk_number: '',
    sk_date: '',
    sk_url: ''
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
      .eq('key', 'teaching_load_edit')
      .single();

    setCanEdit(settings?.is_open || profile?.role === 'admin');

    // Fetch Data
    const { data, error } = await supabase
      .from('teaching_load')
      .select('*')
      .eq('profile_id', session.user.id)
      .order('sk_date', { ascending: false });

    if (error) setError(error.message);
    else setDataList(data);

    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileUpload = (url) => {
    setFormData(prev => ({ ...prev, sk_url: url }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const payload = {
      profile_id: session.user.id,
      ...formData
    };

    try {
      if (editingId) {
        const { error } = await supabase.from('teaching_load').update(payload).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('teaching_load').insert([payload]);
        if (error) throw error;
      }

      setShowModal(false);
      setFormData({
        sk_number: '',
        sk_date: '',
        sk_url: ''
      });
      setEditingId(null);
      fetchSettingsAndData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      sk_number: item.sk_number,
      sk_date: item.sk_date,
      sk_url: item.sk_url || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (item) => {
    if (!window.confirm('Yakin ingin menghapus data ini?')) return;

    if (item.sk_url) {
      await deleteFileFromUrl(item.sk_url, 'documents');
    }

    const { error } = await supabase.from('teaching_load').delete().eq('id', item.id);
    if (error) setError(error.message);
    else fetchSettingsAndData();
  };

  if (loading) return <Spinner animation="border" />;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5>Daftar SK Beban Mengajar</h5>
        <div>
          {!canEdit && <Badge bg="danger" className="me-2 p-2">Edit Ditutup</Badge>}
          {canEdit && <Badge bg="success" className="me-2 p-2">Edit Dibuka</Badge>}
          <Button disabled={!canEdit} onClick={() => { setEditingId(null); setFormData({}); setShowModal(true); }} size="sm">
            <Plus size={16} className="me-1" /> Tambah SK
          </Button>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover responsive className="bg-white shadow-sm">
        <thead>
          <tr>
            <th>Nomor SK</th>
            <th>Tanggal SK</th>
            <th>File SK</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {dataList.map((item) => (
            <tr key={item.id}>
              <td>{item.sk_number}</td>
              <td>{item.sk_date}</td>
              <td>
                {item.sk_url ? (
                  <a href={item.sk_url} target="_blank" rel="noopener noreferrer">
                    <FileText size={18} /> Lihat File
                  </a>
                ) : '-'}
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
              <td colSpan="4" className="text-center py-4 text-muted">Belum ada data SK Beban Mengajar.</td>
            </tr>
          )}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? 'Edit SK Beban Mengajar' : 'Tambah SK Beban Mengajar'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nomor SK</Form.Label>
              <Form.Control type="text" name="sk_number" value={formData.sk_number || ''} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tanggal SK</Form.Label>
              <Form.Control type="date" name="sk_date" value={formData.sk_date || ''} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Upload SK (PDF/JPG, Max 2MB)</Form.Label>
              <FileUpload
                bucketName="documents"
                folderPath="teaching"
                onUpload={handleFileUpload}
                currentUrl={formData.sk_url}
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

export default TeachingLoad;
