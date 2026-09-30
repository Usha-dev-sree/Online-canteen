import { useCart } from '../context/CartContext';
import { FiPlus, FiClock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './MenuCard.css';

const MenuCard = ({ item }) => {
  const { addToCart } = useCart();

  const handleAdd = () => {
    addToCart(item);
    toast.success(`${item.name} added to cart!`, {
      icon: '🛒',
      style: {
        background: '#1a1a2e',
        color: '#fff',
        border: '1px solid rgba(249, 115, 22, 0.3)',
      },
    });
  };

  const categoryEmoji = {
    breakfast: '🌅',
    lunch: '🍛',
    snacks: '🍿',
    beverages: '☕',
    desserts: '🍰',
  };

  return (
    <div className="menu-card" id={`menu-card-${item._id}`}>
      <div className="menu-card-image">
        {item.image ? (
          <img src={item.image} alt={item.name} loading="lazy" />
        ) : (
          <div className="menu-card-placeholder">
            <span>{categoryEmoji[item.category] || '🍽️'}</span>
          </div>
        )}
        <span className="menu-card-category">
          {categoryEmoji[item.category]} {item.category}
        </span>
      </div>

      <div className="menu-card-body">
        <h3 className="menu-card-title">{item.name}</h3>
        {item.description && (
          <p className="menu-card-desc">{item.description}</p>
        )}

        <div className="menu-card-meta">
          <span className="menu-card-time">
            <FiClock /> {item.preparationTime || 10} min
          </span>
        </div>

        <div className="menu-card-footer">
          <span className="menu-card-price">₹{item.price}</span>
          <button className="add-to-cart-btn" id={`add-btn-${item._id}`} onClick={handleAdd}>
            <FiPlus /> Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
