import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { X, Download } from 'lucide-react';

const DocumentPreviewModal = ({ show, onHide, url, title = "Dokumen" }) => {
  if (!url) return null;

  const isPdf = url.toLowerCase().includes('.pdf');
  const isImage = url.toLowerCase().match(/\.(jpeg|jpg|png|webp)$/);

  return (
    <Modal show={show} onHide={onHide} size="xl" centered contentClassName="border-0 shadow-lg">
      <Modal.Header className="border-bottom-0 bg-light d-flex align-items-center">
        <Modal.Title className="fw-bold text-primary">{title}</Modal.Title>
        <div className="ms-auto d-flex gap-2">
            <a href={url} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary btn-sm d-flex align-items-center">
                <Download size={16} className="me-1" /> Unduh
            </a>
            <Button variant="light" size="sm" onClick={onHide} className="rounded-circle p-2">
                <X size={20} />
            </Button>
        </div>
      </Modal.Header>
      <Modal.Body className="p-0 bg-light text-center" style={{ minHeight: '500px', maxHeight: '80vh', overflow: 'hidden' }}>
        {isPdf ? (
           <iframe
             src={`${url}#toolbar=0`}
             title="PDF Preview"
             width="100%"
             height="100%"
             style={{ minHeight: '70vh', border: 'none' }}
           />
        ) : isImage ? (
           <div className="d-flex align-items-center justify-content-center h-100 p-4" style={{ minHeight: '70vh' }}>
             <img src={url} alt="Preview" className="img-fluid rounded shadow-sm" style={{ maxHeight: '70vh' }} />
           </div>
        ) : (
           <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted p-5">
             <p>Format file tidak didukung untuk preview.</p>
             <a href={url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Buka File</a>
           </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default DocumentPreviewModal;
