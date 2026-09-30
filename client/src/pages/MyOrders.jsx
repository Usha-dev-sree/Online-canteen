import { useState, useEffect } from 'react';
import { getMyOrders } from '../services/api';
import OrderCard from '../components/OrderCard';
import { FiPackage, FiRefreshCw } from 'react-icons/fi';
import './MyOrders.css';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getMyOrders();
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load order history');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    // Auto refresh order statuses every 15 seconds
    const interval = setInterval(fetchOrders, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="orders-page" id="my-orders-page">
      <div className="orders-container">
        <div className="orders-header">
          <div>
            <h2>My Orders History</h2>
            <p>Real-time status updates from the canteen kitchen</p>
          </div>
          <button className="refresh-btn" onClick={fetchOrders} id="refresh-orders-btn">
            <FiRefreshCw className={loading ? 'spin' : ''} /> Refresh
          </button>
        </div>

        {loading && orders.length === 0 ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Fetching your orders...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p>⚠️ {error}</p>
            <button className="retry-btn" onClick={fetchOrders}>Retry</button>
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-orders">
            <FiPackage className="empty-orders-icon" />
            <h3>No Orders Placed Yet</h3>
            <p>When you place food orders, they will appear here with live tracking.</p>
          </div>
        ) : (
          <div className="orders-grid" id="my-orders-list">
            {orders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
