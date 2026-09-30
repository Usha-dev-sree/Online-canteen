import { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus } from '../../services/api';
import OrderCard from '../../components/OrderCard';
import { FiRefreshCw, FiDollarSign, FiShoppingBag, FiClock, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './Admin.css';

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getAllOrders();
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast.error('Failed to load canteen orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 8000); // Live poll every 8s
    return () => clearInterval(interval);
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      if (newStatus === 'confirmed') {
        toast.success(`Order accepted! Pickup Code generated for customer.`);
      } else {
        toast.success(`Order #${orderId.slice(-6).toUpperCase()} status updated to ${newStatus}`);
      }
      fetchOrders();
    } catch (err) {
      toast.error('Failed to update order status');
    }
  };

  const safeOrders = Array.isArray(orders) ? orders : [];

  const filteredOrders = filterStatus
    ? safeOrders.filter((o) => o.status === filterStatus)
    : safeOrders;

  // Analytics metrics
  const totalRevenue = safeOrders.reduce(
    (sum, o) => (o.status !== 'cancelled' ? sum + (o.totalAmount || 0) : sum), 0
  );
  const pendingCount   = safeOrders.filter((o) => o.status === 'pending').length;
  const activeCount    = safeOrders.filter((o) => ['confirmed', 'preparing', 'ready'].includes(o.status)).length;
  const completedCount = safeOrders.filter((o) => o.status === 'delivered').length;

  return (
    <div className="admin-page" id="admin-dashboard">
      <div className="admin-container">
        <div className="admin-header">
          <div>
            <h2>Canteen Operations Dashboard</h2>
            <p>Review incoming customer orders & accept requests</p>
          </div>
          <button className="refresh-btn" onClick={fetchOrders} id="admin-refresh-btn">
            <FiRefreshCw className={loading ? 'spin' : ''} /> Refresh Queue
          </button>
        </div>

        {/* Analytics Grid */}
        <div className="analytics-grid">
          <div className="stat-card">
            <div className="stat-icon revenue"><FiDollarSign /></div>
            <div>
              <span className="stat-value">₹{totalRevenue}</span>
              <span className="stat-label">Total Revenue</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon pending"><FiClock /></div>
            <div>
              <span className="stat-value">{pendingCount}</span>
              <span className="stat-label">Pending Approval</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon active"><FiShoppingBag /></div>
            <div>
              <span className="stat-value">{activeCount}</span>
              <span className="stat-label">In Kitchen</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon completed"><FiCheckCircle /></div>
            <div>
              <span className="stat-value">{completedCount}</span>
              <span className="stat-label">Completed</span>
            </div>
          </div>
        </div>

        {/* Status Filters */}
        <div className="status-filter-bar">
          {['', 'pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'].map((st) => (
            <button
              key={st}
              className={`filter-badge ${filterStatus === st ? 'active' : ''}`}
              id={`filter-${st || 'all'}`}
              onClick={() => setFilterStatus(st)}
            >
              {st === '' ? 'All Orders' : st}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {loading && safeOrders.length === 0 ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading kitchen queue...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="empty-orders">
            <p>No orders found matching filter "{filterStatus || 'all'}"</p>
          </div>
        ) : (
          <div className="admin-orders-list" id="admin-orders-list">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                showUser={true}
                onStatusUpdate={handleStatusUpdate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
