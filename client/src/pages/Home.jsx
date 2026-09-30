import { useState, useEffect } from 'react';
import { getMenuItems } from '../services/api';
import MenuCard from '../components/MenuCard';
import CategoryFilter from '../components/CategoryFilter';
import { FiSearch, FiRefreshCw } from 'react-icons/fi';
import './Home.css';

const Home = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);

  const fetchMenu = async (category = '') => {
    try {
      setLoading(true);
      setError(null);
      const res = await getMenuItems(category);
      setItems(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch menu items. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu(activeCategory);
  }, [activeCategory]);

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="home-page" id="home-page">
      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-content">
          <span className="hero-badge">🚀 Fast & Fresh Campus Food</span>
          <h1>Delicious Food,<br /><span className="highlight-text">Delivered Fast</span> to Your Desk</h1>
          <p>Skip the canteen line! Order your favorite meals, snacks, and drinks online with instant status tracking.</p>
          
          <div className="search-bar">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search pizza, dosa, coffee, snacks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id="menu-search-input"
            />
            {searchQuery && (
              <button className="clear-search" onClick={() => setSearchQuery('')}>×</button>
            )}
          </div>
        </div>
      </section>

      {/* Main Section */}
      <section className="menu-section">
        <div className="menu-header">
          <h2>Explore Menu</h2>
          <CategoryFilter
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading fresh items...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p className="error-msg">⚠️ {error}</p>
            <button className="retry-btn" onClick={() => fetchMenu(activeCategory)}>
              <FiRefreshCw /> Retry Connection
            </button>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="empty-menu">
            <span className="empty-emoji">🍽️</span>
            <h3>No items found</h3>
            <p>{searchQuery ? `No results for "${searchQuery}"` : 'No menu items available in this category yet.'}</p>
          </div>
        ) : (
          <div className="menu-grid" id="menu-grid">
            {filteredItems.map((item) => (
              <MenuCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
