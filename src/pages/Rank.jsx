import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { Table, Button, Modal, Form, Alert, Spinner, Badge } from 'react-bootstrap';
import FileUpload from '../components/FileUpload';
import { deleteFileFromUrl } from '../utils/storageUtils';
import { Edit, Trash2, Plus, FileText } from 'lucide-react';

const Rank = () => {
  const { session, profile } = useAuth();
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canEdit, setCanEdit] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    golongan: '',
    pangkat: '',
    masa_kerja_thn: '',
    masa_kerja_bln: '',
    tmt_golongan: '',
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
      .eq('key', 'rank_edit')
      .single();

    setCanEdit(settings?.is_open || profile?.role === 'admin');

    // Fetch Data
    const { data, error } = await supabase
      .from('rank_history')
      .select('*')
      .eq('profile_id', session.user.id)
      .order('tmt_golongan', { ascending: false });

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
        const { error } = await supabase.from('rank_history').update(payload).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('rank_history').insert([payload]);
        if (error) throw error;
      }

      setShowModal(false);
      setFormData({
        golongan: '',
        pangkat: '',
        masa_kerja_thn: '',
        masa_kerja_bln: '',
        tmt_golongan: '',
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
      golongan: item.golongan,
      pangkat: item.pangkat,
      masa_kerja_thn: item.masa_kerja_thn,
      masa_kerja_bln: item.masa_kerja_bln,
      tmt_golongan: item.tmt_golongan,
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

    const { error } = await supabase.from('rank_history').delete().eq('id', item.id);

    if (error) setError(error.message);
    else fetchSettingsAndData();
  };

  if (loading) return <Spinner animation="border" />;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Riwayat Pangkat/Golongan</h2>
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
            <th>Golongan</th>
            <th>Pangkat</th>
            <th>Masa Kerja</th>
            <th>TMT</th>
            <th>No. SK / Tgl SK</th>
            <th>File SK</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {dataList.map((item) => (
            <tr key={item.id}>
              <td>{item.golongan}</td>
              <td>{item.pangkat}</td>
              <td>{item.masa_kerja_thn} Thn {item.masa_kerja_bln} Bln</td>
              <td>{item.tmt_golongan}</td>
              <td>
                <div>{item.sk_number}</div>
                <small className="text-muted">{item.sk_date}</small>
              </td>
              <td>
                {item.sk_url ? (
                  <a href={item.sk_url} target="_blank" rel="noopener noreferrer">
                    <FileText size={18} /> SK
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
              <td colSpan="7" className="text-center py-4 text-muted">Belum ada data pangkat.</td>
            </tr>
          )}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)} backdrop="static" size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? 'Edit Pangkat' : 'Tambah Pangkat'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <div className="row">
              <div className="col-md-6 mb-3">
                <Form.Label>Golongan</Form.Label>
                <Form.Select name="golongan" value={formData.golongan || ''} onChange={handleInputChange} required>
                    <option value="">Pilih Golongan</option>
                    <option value="III/a">III/a</option>
                    <option value="III/b">III/b</option>
                    <option value="III/c">III/c</option>
                    <option value="III/d">III/d</option>
                    <option value="IV/a">IV/a</option>
                    <option value="IV/b">IV/b</option>
                    <option value="IV/c">IV/c</option>
                    <option value="IV/d">IV/d</option>
                    <option value="IV/e">IV/e</option>
                </Form.Select>
              </div>
              <div className="col-md-6 mb-3">
                <Form.Label>Pangkat</Form.Label>
                <Form.Control type="text" name="pangkat" value={formData.pangkat || ''} onChange={handleInputChange} required placeholder="Contoh: Penata Muda" />
              </div>
            </div>

            <div className="row">
               <div className="col-md-6 mb-3">
                 <Form.Label>Masa Kerja Golongan (Tahun)</Form.Label>
                 <Form.Control type="number" name="masa_kerja_thn" value={formData.masa_kerja_thn || ''} onChange={handleInputChange} />
               </div>
               <div className="col-md-6 mb-3">
                 <Form.Label>Masa Kerja Golongan (Bulan)</Form.Label>
                 <Form.Control type="number" name="masa_kerja_bln" value={formData.masa_kerja_bln || ''} onChange={handleInputChange} />
               </div>
            </div>

            <div className="mb-3">
                <Form.Label>TMT Golongan</Form.Label>
                <Form.Control type="date" name="tmt_golongan" value={formData.tmt_golongan || ''} onChange={handleInputChange} required />
            </div>

            <div className="row">
               <div className="col-md-6 mb-3">
                 <Form.Label>Nomor SK</Form.Label>
                 <Form.Control type="text" name="sk_number" value={formData.sk_number || ''} onChange={handleInputChange} required />
               </div>
               <div className="col-md-6 mb-3">
                 <Form.Label>Tanggal SK</Form.Label>
                 <Form.Control type="date" name="sk_date" value={formData.sk_date || ''} onChange={handleInputChange} required />
               </div>
            </div>

            <div className="mb-3">
              <Form.Label>Upload SK (PDF/JPG, Max 2MB)</Form.Label>
              <FileUpload
                bucketName="documents"
                folderPath="rank"
                onUpload={handleFileUpload}
                currentUrl={formData.sk_url}
              />
            </div>
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

export default Rank;
