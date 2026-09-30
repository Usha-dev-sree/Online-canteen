import './CategoryFilter.css';

const categories = [
  { key: '', label: 'All', emoji: '🍽️' },
  { key: 'breakfast', label: 'Breakfast', emoji: '🌅' },
  { key: 'lunch', label: 'Lunch', emoji: '🍛' },
  { key: 'snacks', label: 'Snacks', emoji: '🍿' },
  { key: 'beverages', label: 'Beverages', emoji: '☕' },
  { key: 'desserts', label: 'Desserts', emoji: '🍰' },
];

const CategoryFilter = ({ activeCategory, onCategoryChange }) => {
  return (
    <div className="category-filter" id="category-filter">
      {categories.map((cat) => (
        <button
          key={cat.key}
          className={`category-tab ${activeCategory === cat.key ? 'active' : ''}`}
          id={`category-${cat.key || 'all'}`}
          onClick={() => onCategoryChange(cat.key)}
        >
          <span className="category-emoji">{cat.emoji}</span>
          <span>{cat.label}</span>
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
