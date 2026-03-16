import { useState } from 'react';
import './emergencyContact.css';

function EmergencyContactBox() {
  const [contacts] = useState([
    { id: 1, name: 'Cứu hộ 115', phone: '115', type: 'emergency' },
    { id: 2, name: 'Cảnh sát 113', phone: '113', type: 'police' },
    { id: 3, name: 'Cứu hỏa 114', phone: '114', type: 'fire' },
    { id: 4, name: 'Trung tâm điều phối', phone: '1900-xxxx', type: 'center' }
  ]);

  const handleCall = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  return (
    <div className="emergency-contact-box">
      <h3>📞 Liên hệ khẩn cấp</h3>
      <div className="contact-list">
        {contacts.map((contact) => (
          <div key={contact.id} className={`contact-item ${contact.type}`}>
            <div className="contact-info">
              <span className="contact-name">{contact.name}</span>
              <span className="contact-phone">{contact.phone}</span>
            </div>
            <button 
              onClick={() => handleCall(contact.phone)}
              className="btn-call"
            >
              Gọi ngay
            </button>
          </div>
        ))}
      </div>
      <div className="emergency-tips">
        <p>💡 Mẹo: Hãy giữ bình tĩnh và cung cấp thông tin chính xác về vị trí của bạn</p>
      </div>
    </div>
  );
}

export default EmergencyContactBox;
