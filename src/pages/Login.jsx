import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Container, Button, Spinner, Row, Col } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import { GraduationCap, BookOpen, UserCheck } from 'lucide-react';

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
    <div className="d-flex vh-100 overflow-hidden bg-light">
      {/* Left Side: Educational Branding */}
      <div className="d-none d-md-flex col-md-6 col-lg-7 bg-primary position-relative align-items-center justify-content-center text-white overflow-hidden">
        {/* Background Overlay with Gradient */}
        <div
          className="position-absolute w-100 h-100"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.2
          }}
        />
        <div className="position-absolute w-100 h-100 bg-gradient-primary" style={{ background: 'linear-gradient(135deg, rgba(13,110,253,0.9) 0%, rgba(13,202,240,0.8) 100%)' }}></div>

        {/* Content */}
        <div className="position-relative p-5 text-center" style={{ maxWidth: '600px', zIndex: 1 }}>
          <div className="mb-4 d-inline-block bg-white text-primary rounded-circle p-4 shadow-lg">
             <GraduationCap size={64} strokeWidth={1.5} />
          </div>
          <h1 className="display-4 fw-bold mb-3">Portal Peremajaan Data Guru</h1>
          <p className="lead mb-5 opacity-75">
            Kelola data kepegawaian, riwayat pendidikan, dan dokumen profesi Anda dengan mudah, aman, dan terintegrasi.
          </p>

          <div className="row g-4 justify-content-center text-start">
             <div className="col-auto d-flex align-items-center">
                <div className="bg-white bg-opacity-25 p-2 rounded me-3">
                   <UserCheck size={24} />
                </div>
                <div>
                   <h6 className="mb-0 fw-bold">Data Tervalidasi</h6>
                   <small className="opacity-75">Verifikasi Admin</small>
                </div>
             </div>
             <div className="col-auto d-flex align-items-center">
                <div className="bg-white bg-opacity-25 p-2 rounded me-3">
                   <BookOpen size={24} />
                </div>
                <div>
                   <h6 className="mb-0 fw-bold">Arsip Digital</h6>
                   <small className="opacity-75">Aman & Terpusat</small>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="col-12 col-md-6 col-lg-5 d-flex align-items-center justify-content-center p-4">
        <div className="w-100" style={{ maxWidth: '420px' }}>
          <div className="text-center mb-5">
            <h2 className="fw-bold text-primary mb-2">Selamat Datang!</h2>
            <p className="text-muted">Silahkan masuk untuk mengakses dashboard guru.</p>
          </div>

          <div className="d-grid gap-3">
            <Button
              variant="light"
              size="lg"
              className="d-flex align-items-center justify-content-center border shadow-sm py-3 position-relative"
              onClick={signInWithGoogle}
              style={{ transition: 'all 0.2s' }}
              onMouseOver={(e) => e.currentTarget.classList.add('shadow')}
              onMouseOut={(e) => e.currentTarget.classList.remove('shadow')}
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="position-absolute start-0 ms-3"
                style={{ width: '24px', height: '24px' }}
              />
              <span className="fw-semibold text-secondary">Masuk dengan Akun Belajar.id / Google</span>
            </Button>
          </div>

          <div className="mt-5 text-center text-muted small">
            <p className="mb-1">&copy; {new Date().getFullYear()} MYASN Guru System</p>
            <p>Dikembangkan untuk kemudahan administrasi pendidikan.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
