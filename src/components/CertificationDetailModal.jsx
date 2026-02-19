import React from 'react';
import { Modal, ListGroup, Accordion, Button } from 'react-bootstrap';
import { Award, FileText, Calendar, User, Building, X, ChevronDown, ChevronUp, Download, Eye } from 'lucide-react';

const CertificationDetailModal = ({ show, onHide, data }) => {
  if (!data) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const isPdf = data.cert_url?.toLowerCase().includes('.pdf');
  const isImage = data.cert_url?.toLowerCase().match(/\.(jpeg|jpg|png|webp)$/);

  return (
    <Modal show={show} onHide={onHide} size="xl" contentClassName="border-0 shadow-lg">
      <Modal.Header className="bg-info text-white border-bottom-0 d-flex justify-content-between align-items-center">
        <Modal.Title className="fs-5 fw-bold">
          Detail Sertifikasi - {data.type?.toUpperCase()}
        </Modal.Title>
        <Button variant="link" onClick={onHide} className="text-white p-0">
            <X size={24} />
        </Button>
      </Modal.Header>
      <Modal.Body className="p-0 bg-light">
        <div className="bg-white p-0">
            <ListGroup variant="flush">
                <ListGroup.Item className="d-flex align-items-center py-3 border-bottom">
                    <div className="me-3 text-info">
                        <Award size={20} />
                    </div>
                    <div className="flex-grow-1">
                        <small className="text-muted d-block mb-1">Nama Sertifikasi</small>
                        <span className="fw-medium">{data.type || '-'}</span>
                    </div>
                </ListGroup.Item>

                <ListGroup.Item className="d-flex align-items-center py-3 border-bottom">
                    <div className="me-3 text-info">
                        <FileText size={20} />
                    </div>
                    <div className="flex-grow-1">
                        <small className="text-muted d-block mb-1">Nomor Sertifikat</small>
                        <span className="fw-medium">{data.cert_number || '-'}</span>
                    </div>
                </ListGroup.Item>

                <ListGroup.Item className="d-flex align-items-center py-3 border-bottom">
                    <div className="me-3 text-info">
                        <Calendar size={20} />
                    </div>
                    <div className="flex-grow-1">
                        <small className="text-muted d-block mb-1">Tanggal Sertifikat</small>
                        <span className="fw-medium">{formatDate(data.cert_date)}</span>
                    </div>
                </ListGroup.Item>

                <ListGroup.Item className="d-flex align-items-center py-3 border-bottom">
                    <div className="me-3 text-info">
                        <Calendar size={20} />
                    </div>
                    <div className="flex-grow-1">
                        <small className="text-muted d-block mb-1">Masa Berlaku Mulai</small>
                        <span className="fw-medium">{formatDate(data.cert_date)}</span>
                    </div>
                </ListGroup.Item>

                <ListGroup.Item className="d-flex align-items-center py-3 border-bottom">
                    <div className="me-3 text-info">
                        <Calendar size={20} />
                    </div>
                    <div className="flex-grow-1">
                        <small className="text-muted d-block mb-1">Masa Berlaku Selesai</small>
                        <span className="fw-medium">{data.valid_until ? formatDate(data.valid_until) : 'Seumur Hidup'}</span>
                    </div>
                </ListGroup.Item>

                <ListGroup.Item className="d-flex align-items-center py-3 border-bottom">
                    <div className="me-3 text-info">
                        <User size={20} />
                    </div>
                    <div className="flex-grow-1">
                        <small className="text-muted d-block mb-1">Gelar Depan Sertifikasi</small>
                        <span className="fw-medium">{data.front_title || '-'}</span>
                    </div>
                </ListGroup.Item>

                <ListGroup.Item className="d-flex align-items-center py-3 border-bottom">
                    <div className="me-3 text-info">
                        <User size={20} />
                    </div>
                    <div className="flex-grow-1">
                        <small className="text-muted d-block mb-1">Gelar Belakang Sertifikasi</small>
                        <span className="fw-medium">{data.back_title || '-'}</span>
                    </div>
                </ListGroup.Item>

                <ListGroup.Item className="d-flex align-items-center py-3 border-bottom">
                    <div className="me-3 text-info">
                        <Building size={20} />
                    </div>
                    <div className="flex-grow-1">
                        <small className="text-muted d-block mb-1">Lembaga Sertifikasi</small>
                        <span className="fw-medium">{data.institution || '-'}</span>
                    </div>
                </ListGroup.Item>
            </ListGroup>
        </div>

        <div className="mt-3 bg-white border-top">
            <Accordion defaultActiveKey="0" flush>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>
                        <span className="fw-bold text-dark">Dok Sertifikat Sertifikasi</span>
                    </Accordion.Header>
                    <Accordion.Body className="p-0 bg-dark text-white text-center" style={{ minHeight: '500px' }}>
                         {data.cert_url ? (
                            isPdf ? (
                                <iframe
                                    src={`${data.cert_url}#toolbar=0`}
                                    title="PDF Preview"
                                    width="100%"
                                    height="600px"
                                    style={{ border: 'none' }}
                                />
                            ) : isImage ? (
                                <div className="d-flex align-items-center justify-content-center py-4">
                                    <img src={data.cert_url} alt="Sertifikat" className="img-fluid" style={{ maxHeight: '600px' }} />
                                </div>
                            ) : (
                                <div className="d-flex flex-column align-items-center justify-content-center py-5">
                                    <p className="mb-3">Format file tidak mendukung preview langsung.</p>
                                    <a href={data.cert_url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                                        <Download size={18} className="me-2" /> Unduh File
                                    </a>
                                </div>
                            )
                        ) : (
                            <div className="py-5 text-muted">
                                Tidak ada dokumen yang diunggah.
                            </div>
                        )}
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default CertificationDetailModal;
