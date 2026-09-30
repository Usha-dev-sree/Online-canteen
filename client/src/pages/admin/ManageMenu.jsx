import { useState, useEffect } from 'react';
import { getMenuItems, addMenuItem, updateMenuItem, deleteMenuItem } from '../../services/api';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './Admin.css';

const categories = ['breakfast', 'lunch', 'snacks', 'beverages', 'desserts'];

const ManageMenu = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'lunch',
    image: '',
    available: true,
    preparationTime: 10,
  });

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await getMenuItems();
      setItems(res.data);
    } catch (err) {
      toast.error('Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '', description: '', price: '', category: 'lunch', image: '', available: true, preparationTime: 10,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price,
      category: item.category,
      image: item.image || '',
      available: item.available,
      preparationTime: item.preparationTime || 10,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        preparationTime: Number(formData.preparationTime),
      };

      if (editingItem) {
        await updateMenuItem(editingItem._id, payload);
        toast.success('Menu item updated!');
      } else {
        await addMenuItem(payload);
        toast.success('New menu item added!');
      }
      setShowModal(false);
      fetchItems();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving menu item');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await deleteMenuItem(id);
      toast.success(`Deleted "${name}"`);
      fetchItems();
    } catch (err) {
      toast.error('Failed to delete item');
    }
  };

  return (
    <div className="admin-page" id="manage-menu-page">
      <div className="admin-container">
        <div className="admin-header">
          <div>
            <h2>Manage Menu Items</h2>
            <p>Add, edit, or toggle availability of canteen dishes</p>
          </div>
          <button className="add-item-btn" onClick={handleOpenAdd} id="add-menu-item-btn">
            <FiPlus /> Add New Item
          </button>
        </div>

        {/* Menu Items Table */}
        <div className="menu-table-card">
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
            </div>
          ) : (
            <table className="admin-table" id="menu-management-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Prep Time</th>
                  <th>Available</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id} id={`menu-row-${item._id}`}>
                    <td className="item-name-cell">
                      <div className="item-thumb">
                        {item.image ? <img src={item.image} alt={item.name} /> : '🍽️'}
                      </div>
                      <div>
                        <strong>{item.name}</strong>
                        <p>{item.description}</p>
                      </div>
                    </td>
                    <td>
                      <span className="cat-badge">{item.category}</span>
                    </td>
                    <td className="price-cell">₹{item.price}</td>
                    <td>{item.preparationTime || 10} min</td>
                    <td>
                      <span className={`avail-badge ${item.available ? 'yes' : 'no'}`}>
                        {item.available ? <FiCheck /> : <FiX />}
                        {item.available ? 'In Stock' : 'Out'}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button className="action-btn edit" onClick={() => handleOpenEdit(item)} title="Edit">
                        <FiEdit2 />
                      </button>
                      <button className="action-btn delete" onClick={() => handleDelete(item._id, item.name)} title="Delete">
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal for Add / Edit */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</h3>
              <button className="close-modal-btn" onClick={() => setShowModal(false)}>
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Item Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Masala Dosa"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows="2"
                  placeholder="Crispy dosa served with chutney..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price (₹) *</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="60"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Prep Time (minutes)</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.preparationTime}
                    onChange={(e) => setFormData({ ...formData, preparationTime: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Image URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.available}
                    onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                  />
                  <span>Available for Ordering</span>
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  {editingItem ? 'Save Changes' : 'Create Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageMenu;
