import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Table, Button, Modal, Form, Alert, Spinner } from 'react-bootstrap';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nip: '',
    name: '',
    email: '',
    unit_kerja: ''
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('permitted_users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching permitted_users:", error);
        setError(error.message);
    } else {
        setUsers(data);
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from('permitted_users')
      .insert([formData]);

    if (error) {
      alert('Error adding user: ' + error.message);
    } else {
      setShowModal(false);
      setFormData({ nip: '', name: '', email: '', unit_kerja: '' });
      fetchUsers();
    }
  };

  const handleDelete = async (email) => {
    if (window.confirm('Are you sure you want to remove this user from the whitelist?')) {
      const { error } = await supabase
        .from('permitted_users')
        .delete()
        .eq('email', email);

      if (error) alert('Error deleting: ' + error.message);
      else fetchUsers();
    }
  };

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Kelola Guru</h2>
        <Button onClick={() => setShowModal(true)}>+ Tambah Guru</Button>
      </div>

      <Table striped bordered hover responsive className="bg-white shadow-sm">
        <thead>
          <tr>
            <th>NIP</th>
            <th>Nama</th>
            <th>Email</th>
            <th>Unit Kerja</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.email}>
              <td>{user.nip}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.unit_kerja}</td>
              <td>
                <Button variant="danger" size="sm" onClick={() => handleDelete(user.email)}>Hapus</Button>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center">Belum ada data guru.</td>
            </tr>
          )}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Tambah Guru</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>NIP</Form.Label>
              <Form.Control type="text" name="nip" value={formData.nip} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nama Lengkap</Form.Label>
              <Form.Control type="text" name="name" value={formData.name} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email Google</Form.Label>
              <Form.Control type="email" name="email" value={formData.email} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Unit Kerja</Form.Label>
              <Form.Control type="text" name="unit_kerja" value={formData.unit_kerja} onChange={handleInputChange} />
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

export default Users;
