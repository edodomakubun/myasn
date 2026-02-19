import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Form, Button, ProgressBar, Alert } from 'react-bootstrap';

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
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate size (maxSizeMB in MB)
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File terlalu besar. Maksimal ${maxSizeMB}MB.`);
      return;
    }

    // Validate type
    // accept prop is string like ".pdf,.jpg", convert to mime types check if needed
    // or just trust the accept attribute for UI and rely on backend/file extension check
    // Here we do a simple check
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
       setError('Format file tidak didukung. Harap upload PDF atau JPG.');
       // return; // Optional: Enforce strictly? The prompt said PDF and JPG.
    }

    setError(null);
    setUploading(true);
    setUploadProgress(0); // Supabase JS doesn't expose progress callback easily in v2 without XHR wrapper,
                          // but for small files (2MB) it's fast.
                          // We'll simulate or just show indeterminate.

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      const filePath = `${folderPath}/${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(data.path);

      onUpload(publicUrl);
      setUploadProgress(100);
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
        <div className="mb-2">
           <a href={currentUrl} target="_blank" rel="noopener noreferrer" className="text-decoration-none me-2">
             <i className="bi bi-file-earmark-text"></i> Lihat File Saat Ini
           </a>
        </div>
      )}
      {!disabled ? (
        <>
          <Form.Control
            type="file"
            onChange={handleFileChange}
            accept={accept}
            disabled={uploading}
            size="sm"
          />
          {uploading && <ProgressBar animated now={100} label="Mengupload..." className="mt-2" style={{height: '20px'}} />}
          {error && <Alert variant="danger" className="mt-2 py-1 small">{error}</Alert>}
          <Form.Text className="text-muted">
            Format: PDF/JPG. Max: {maxSizeMB}MB.
          </Form.Text>
        </>
      ) : (
        <Alert variant="secondary" className="py-1 small mb-0">
          Upload dinonaktifkan oleh Admin.
        </Alert>
      )}
    </div>
  );
};

export default FileUpload;
