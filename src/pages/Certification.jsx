import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { Table, Button, Modal, Form, Alert, Spinner, Badge } from 'react-bootstrap';
import FileUpload from '../components/FileUpload';
import { Edit, Trash2, Plus, FileText } from 'lucide-react';

const Certification = () => {
  const { session, profile } = useAuth();
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canEdit, setCanEdit] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    type: '',
    cert_number: '',
    cert_date: '',
    valid_until: '',
    institution: '',
    cert_url: ''
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
      .eq('key', 'certification_edit')
      .single();

    setCanEdit(settings?.is_open || profile?.role === 'admin');

    // Fetch Data
    const { data, error } = await supabase
      .from('certification')
      .select('*')
      .eq('profile_id', session.user.id)
      .order('cert_date', { ascending: false });

    if (error) setError(error.message);
    else setDataList(data);

    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileUpload = (url) => {
    setFormData(prev => ({ ...prev, cert_url: url }));
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
        const { error } = await supabase.from('certification').update(payload).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('certification').insert([payload]);
        if (error) throw error;
      }

      setShowModal(false);
      setFormData({
        type: '',
        cert_number: '',
        cert_date: '',
        valid_until: '',
        institution: '',
        cert_url: ''
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
      type: item.type,
      cert_number: item.cert_number,
      cert_date: item.cert_date,
      valid_until: item.valid_until || '',
      institution: item.institution || '',
      cert_url: item.cert_url || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus data ini?')) return;

    const { error } = await supabase.from('certification').delete().eq('id', id);
    if (error) setError(error.message);
    else fetchSettingsAndData();
  };

  if (loading) return <Spinner animation="border" />;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Riwayat Sertifikasi</h2>
        <div>
          {!canEdit && <Badge bg="danger" className="me-2 p-2">Edit Ditutup</Badge>}
          {canEdit && <Badge bg="success" className="me-2 p-2">Edit Dibuka</Badge>}
          <Button disabled={!canEdit} onClick={() => { setEditingId(null); setFormData({}); setShowModal(true); }}>
            <Plus size={18} className="me-1" /> Tambah
          </Button>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover responsive className="bg-white shadow-sm">
        <thead>
          <tr>
            <th>Jenis Sertifikasi</th>
            <th>Nomor Sertifikat</th>
            <th>Tgl Sertifikat</th>
            <th>Masa Berlaku</th>
            <th>Lembaga</th>
            <th>File</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {dataList.map((item) => (
            <tr key={item.id}>
              <td>{item.type}</td>
              <td>{item.cert_number}</td>
              <td>{item.cert_date}</td>
              <td>{item.valid_until || 'Seumur Hidup'}</td>
              <td>{item.institution}</td>
              <td>
                {item.cert_url ? (
                  <a href={item.cert_url} target="_blank" rel="noopener noreferrer">
                    <FileText size={18} /> Lihat File
                  </a>
                ) : '-'}
              </td>
              <td>
                <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEdit(item)} disabled={!canEdit}>
                  <Edit size={16} />
                </Button>
                <Button variant="outline-danger" size="sm" onClick={() => handleDelete(item.id)} disabled={!canEdit}>
                  <Trash2 size={16} />
                </Button>
              </td>
            </tr>
          ))}
          {dataList.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center py-4 text-muted">Belum ada data sertifikasi.</td>
            </tr>
          )}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)} backdrop="static" size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? 'Edit Sertifikasi' : 'Tambah Sertifikasi'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Jenis Sertifikasi</Form.Label>
              <Form.Select name="type" value={formData.type || ''} onChange={handleInputChange} required>
                  <option value="">Pilih Jenis</option>
                  <option value="Sertifikat Pendidik">Sertifikat Pendidik</option>
                  <option value="Sertifikat Keahlian">Sertifikat Keahlian</option>
                  <option value="Sertifikat Pelatihan">Sertifikat Pelatihan</option>
                  <option value="Lainnya">Lainnya</option>
              </Form.Select>
            </Form.Group>

            <div className="row">
                <div className="col-md-6 mb-3">
                    <Form.Label>Nomor Sertifikat</Form.Label>
                    <Form.Control type="text" name="cert_number" value={formData.cert_number || ''} onChange={handleInputChange} required />
                </div>
                <div className="col-md-6 mb-3">
                    <Form.Label>Lembaga Penerbit</Form.Label>
                    <Form.Control type="text" name="institution" value={formData.institution || ''} onChange={handleInputChange} placeholder="Kemendikbud, dll" />
                </div>
            </div>

            <div className="row">
                <div className="col-md-6 mb-3">
                    <Form.Label>Tanggal Sertifikat</Form.Label>
                    <Form.Control type="date" name="cert_date" value={formData.cert_date || ''} onChange={handleInputChange} required />
                </div>
                <div className="col-md-6 mb-3">
                    <Form.Label>Masa Berlaku Sampai (Kosongkan jika seumur hidup)</Form.Label>
                    <Form.Control type="date" name="valid_until" value={formData.valid_until || ''} onChange={handleInputChange} />
                </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Upload Sertifikat (PDF/JPG, Max 2MB)</Form.Label>
              <FileUpload
                bucketName="documents"
                folderPath="certification"
                onUpload={handleFileUpload}
                currentUrl={formData.cert_url}
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

export default Certification;
