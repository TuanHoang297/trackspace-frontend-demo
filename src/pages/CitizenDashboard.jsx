import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Layout from '../components/common/Layout';
import Map from '../components/common/Map';
import EmergencyContactBox from '../components/citizen/EmergencyContactBox';
import api from '../services/api';
import { API_ENDPOINTS } from '../config/api';

function CitizenDashboard() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    location: '',
    latitude: '',
    longitude: '',
    description: '',
    urgencyLevel: 'MEDIUM',
    numberOfPeople: 1
  });

  const queryClient = useQueryClient();

  const { data: requests = [] } = useQuery({
    queryKey: ['myRequests'],
    queryFn: async () => {
      const response = await api.get(API_ENDPOINTS.RESCUE_REQUESTS.LIST);
      return response.data;
    }
  });

  const createMutation = useMutation({
    mutationFn: (data) => api.post(API_ENDPOINTS.RESCUE_REQUESTS.CREATE, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['myRequests']);
      setShowForm(false);
      setFormData({
        location: '',
        latitude: '',
        longitude: '',
        description: '',
        urgencyLevel: 'MEDIUM',
        numberOfPeople: 1
      });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const getUrgencyBadge = (level) => {
    const badges = {
      URGENT: 'badge-urgent',
      HIGH: 'badge-high',
      MEDIUM: 'badge-medium',
      LOW: 'badge-low'
    };
    return badges[level] || 'badge-medium';
  };

  const getStatusBadge = (status) => {
    const badges = {
      PENDING: 'badge-pending',
      VERIFIED: 'badge-pending',
      ASSIGNED: 'badge-in-progress',
      IN_PROGRESS: 'badge-in-progress',
      COMPLETED: 'badge-completed',
      CANCELLED: 'badge-danger'
    };
    return badges[status] || 'badge-pending';
  };

  const markers = requests
    .filter(r => r.latitude && r.longitude)
    .map(r => ({
      lat: r.latitude,
      lng: r.longitude,
      title: r.location,
      description: r.description
    }));

  return (
    <Layout title="Yêu cầu cứu hộ của tôi">
      <EmergencyContactBox />
      
      <div className="card">
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="btn btn-primary"
        >
          {showForm ? 'Đóng form' : 'Tạo yêu cầu cứu hộ mới'}
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
            <div className="form-group">
              <label>Địa điểm *</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="form-group">
                <label>Vĩ độ (Latitude)</label>
                <input
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Kinh độ (Longitude)</label>
                <input
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Mô tả tình huống *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="form-group">
                <label>Mức độ khẩn cấp *</label>
                <select
                  value={formData.urgencyLevel}
                  onChange={(e) => setFormData({ ...formData, urgencyLevel: e.target.value })}
                  required
                >
                  <option value="LOW">Thấp</option>
                  <option value="MEDIUM">Trung bình</option>
                  <option value="HIGH">Cao</option>
                  <option value="URGENT">Khẩn cấp</option>
                </select>
              </div>

              <div className="form-group">
                <label>Số người cần cứu hộ *</label>
                <input
                  type="number"
                  min="1"
                  value={formData.numberOfPeople}
                  onChange={(e) => setFormData({ ...formData, numberOfPeople: e.target.value })}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-success" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Đang gửi...' : 'Gửi yêu cầu'}
            </button>
          </form>
        )}
      </div>

      <div className="card">
        <h3>Bản đồ yêu cầu cứu hộ</h3>
        <div className="map-container">
          <Map markers={markers} />
        </div>
      </div>

      <div className="card">
        <h3>Danh sách yêu cầu</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Địa điểm</th>
              <th>Mức độ</th>
              <th>Số người</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id}>
                <td>{req.location}</td>
                <td>
                  <span className={`badge ${getUrgencyBadge(req.urgencyLevel)}`}>
                    {req.urgencyLevel}
                  </span>
                </td>
                <td>{req.numberOfPeople}</td>
                <td>
                  <span className={`badge ${getStatusBadge(req.status)}`}>
                    {req.status}
                  </span>
                </td>
                <td>{new Date(req.createdAt).toLocaleString('vi-VN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

export default CitizenDashboard;
