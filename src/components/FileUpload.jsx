import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Form, Button, ProgressBar, Alert } from 'react-bootstrap';
import { FileText, Eye } from 'lucide-react';
import DocumentPreviewModal from './DocumentPreviewModal';
import { deleteFileFromUrl } from '../utils/storageUtils';

const FileUpload = ({
  bucketName = 'documents',
  folderPath = 'uploads',
  onUpload,
  disabled = false,
  accept = '.pdf,.jpg,.jpeg',
  maxSizeMB = 2,
  currentUrl
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File terlalu besar. Maksimal ${maxSizeMB}MB.`);
      return;
    }

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
       setError('Format file tidak didukung. Harap upload PDF atau JPG.');
       return;
    }

    setError(null);
    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      const filePath = `${folderPath}/${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, { upsert: false });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(data.path);

      // Attempt to delete the old file if it exists
      if (currentUrl) {
        await deleteFileFromUrl(currentUrl, bucketName);
      }

      onUpload(publicUrl);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Gagal mengupload file.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mb-3">
      {currentUrl && (
        <div className="mb-2 d-flex align-items-center">
           <Button variant="outline-info" size="sm" className="me-2 d-flex align-items-center" onClick={() => setPreviewOpen(true)}>
             <Eye size={16} className="me-1" /> Lihat File
           </Button>
           <DocumentPreviewModal show={previewOpen} onHide={() => setPreviewOpen(false)} url={currentUrl} />
        </div>
      )}
      {!disabled ? (
        <div className="border rounded p-3 bg-white shadow-sm">
          <Form.Control
            type="file"
            onChange={handleFileChange}
            accept={accept}
            disabled={uploading}
            size="sm"
            className="mb-2"
          />
          {uploading && <ProgressBar animated now={100} label="Mengupload..." className="mb-2" style={{height: '20px'}} />}
          {error && <Alert variant="danger" className="py-1 small mb-0">{error}</Alert>}
          <Form.Text className="text-muted d-block small">
            Format: PDF/JPG. Max: {maxSizeMB}MB.
          </Form.Text>
        </div>
      ) : (
        <div className="alert alert-secondary py-2 small mb-0 d-flex align-items-center">
          <FileText size={16} className="me-2"/> Upload dinonaktifkan oleh Admin.
        </div>
      )}
    </div>
  );
};

export default FileUpload;
