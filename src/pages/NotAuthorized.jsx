import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const NotAuthorized = () => {
  const { signOut, session } = useAuth();

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Card className="text-center p-5 shadow-lg border-0" style={{ maxWidth: '500px' }}>
        <h2 className="text-danger mb-3">Akses Ditolak</h2>
        <p className="text-muted mb-4">
          Akun Google Anda ({session?.user?.email}) belum terdaftar sebagai Guru di sistem ini.
          Silahkan hubungi Administrator untuk mendaftarkan akun Anda.
        </p>
        <Button variant="outline-danger" onClick={signOut}>Logout</Button>
      </Card>
    </Container>
  );
};

export default NotAuthorized;
