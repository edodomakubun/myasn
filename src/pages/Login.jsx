import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Container, Button, Card, Spinner } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';

const Login = () => {
  const { signInWithGoogle, session, loading } = useAuth();

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (session) {
    return <Navigate to="/" replace />;
  }

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Card style={{ width: '400px' }} className="shadow-lg border-0">
        <Card.Body className="text-center p-5">
          <h2 className="mb-4 text-primary fw-bold">MYASN Guru</h2>
          <p className="text-muted mb-4">Silahkan login menggunakan akun Google yang terdaftar.</p>
          <Button className="w-100 d-flex align-items-center justify-content-center py-2 btn-primary" onClick={signInWithGoogle}>
            <svg className="me-2" width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
              <path d="M21.35 11.1H12v3.8h5.6c-.6 3.2-3.4 5.5-6.6 5.5-3.9 0-7-3.1-7-7s3.1-7 7-7c1.7 0 3.2.6 4.4 1.7l3-3C16.8 2.6 14.5 1.5 12 1.5 6.2 1.5 1.5 6.2 1.5 12S6.2 22.5 12 22.5c5.8 0 10.5-4.7 10.5-10.5 0-.7-.1-1.3-.2-1.9z"/>
            </svg>
            Login dengan Google
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;
