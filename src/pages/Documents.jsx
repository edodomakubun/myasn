import React, { useState } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import Appointment from './documents/Appointment';
import TeachingLoad from './documents/TeachingLoad';

const Documents = () => {
  const [key, setKey] = useState('appointment');

  return (
    <div>
      <h2 className="mb-4">Dokumen Lainnya</h2>
      <Tabs
        id="document-tabs"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3"
      >
        <Tab eventKey="appointment" title="SK Pengangkatan">
          <div className="p-3 border rounded-bottom border-top-0 bg-white">
            <Appointment />
          </div>
        </Tab>
        <Tab eventKey="teaching" title="SK Beban Mengajar">
           <div className="p-3 border rounded-bottom border-top-0 bg-white">
            <TeachingLoad />
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default Documents;
