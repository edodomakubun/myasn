import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Form, Card, Spinner, Alert } from 'react-bootstrap';

const Settings = () => {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSettings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('app_settings')
      .select('*')
      .order('key');

    if (error) {
      setError(error.message);
    } else {
      setSettings(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleToggle = async (key, currentValue) => {
    const { error } = await supabase
      .from('app_settings')
      .update({ is_open: !currentValue })
      .eq('key', key);

    if (error) {
      alert('Error updating setting: ' + error.message);
    } else {
      setSettings(settings.map(s => (s.key === key ? { ...s, is_open: !currentValue } : s)));
    }
  };

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div>
      <h2 className="mb-4">Pengaturan Peremajaan Data</h2>
      <Card className="shadow-sm border-0">
        <Card.Body>
          <p className="text-muted mb-4">
            Aktifkan atau nonaktifkan fitur di bawah ini untuk mengizinkan atau membatasi guru dalam melakukan perubahan data.
          </p>
          {settings.map((setting) => (
            <div key={setting.key} className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-3 last:border-0">
              <div>
                <h5 className="mb-1">{setting.label || setting.key}</h5>
                <small className="text-muted">{setting.description}</small>
              </div>
              <Form.Check
                type="switch"
                id={`switch-${setting.key}`}
                checked={setting.is_open}
                onChange={() => handleToggle(setting.key, setting.is_open)}
                style={{ fontSize: '1.2rem', cursor: 'pointer' }}
              />
            </div>
          ))}
        </Card.Body>
      </Card>
    </div>
  );
};

export default Settings;
