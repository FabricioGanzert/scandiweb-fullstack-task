import React, { useState, useEffect  } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../components/CartContext'; // Update the import path as necessary
import centeredIcon from '../assets/center_logo_icon.png';
import shoppingCartIcon from '../assets/shopping-cart.png';

interface Category {
  id: string;
  name: string;
}

interface HeaderProps {
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  onCartClick: () => void; // New prop to handle cart icon clicks
}

const Header: React.FC<HeaderProps> = ({ selectedCategory, setSelectedCategory, onCartClick }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const endpoint = import.meta.env.VITE_ENDPOINT_GRAPH_QL;
  const navigate = useNavigate();
  const location = useLocation();

  // Compute urlLocation from the current pathname.
  // If the pathname is '/', urlLocation will be an empty string.
  const urlLocation = location.pathname === '/' ? '' : location.pathname.replace('/', '');

  // If urlLocation is empty, default to the first category (once categories are loaded)
  const activeCategory = urlLocation || (categories.length > 0 ? categories[0].name.toLowerCase() : selectedCategory);

  // Get cart items from the cart context and calculate the total quantity.
  const { cartItems } = useCart();
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  if (!endpoint) {
    throw new Error('REACT_APP_ENDPOINT_GRAPH_QL is not defined in the environment variables.');
  }

  useEffect(() => {
    // Fetch categories from GraphQL endpoint
    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: '{ categories { id name } }' })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.data && data.data.categories) {
          const cats = data.data.categories.map((cat: Category) => ({
            ...cat,
            name: cat.name.toUpperCase()
          }));
          setCategories(cats);
        }
      })
      .catch((err) => console.error(err));
  }, [endpoint]);

  const handleCategoryClick = (cat: string) => {
    setSelectedCategory(cat);
    setMobileMenuOpen(false);
    navigate(`/${cat.toLowerCase()}`); // Navigate to main product list
  };

  return (
    <>
      {/* Desktop Header */}
      <div className="header desktop-nav" style={{ position: 'relative', zIndex: 1000 }}>
        <div style={{ display: 'flex' }}>
          {categories.map((cat) => (
            <Link 
              id={cat.id}
              key={cat.id}
              // Compare against activeCategory so that one link gets 'active-category-link'
              data-testid={activeCategory === cat.name.toLowerCase() ? 'active-category-link' : 'category-link'}
              className={`header-nav-item ${activeCategory === cat.name.toLowerCase() ? 'selected' : ''}`}
              to={cat.name.toLowerCase()}
            >
              {cat.name}
            </Link>
          ))}
        </div>
        <div className="header-center">
          <img className="img-header-center" src={centeredIcon} alt="I am a Logotype!" />
        </div>
        <button 
          className="header-right" 
          onClick={onCartClick} 
          data-testid="cart-btn"
          style={{ position: 'relative', zIndex: 1000, cursor: 'pointer' }}
        >
          {totalItemsCount > 0 && (
            <div className="item-count-bubble">
              {totalItemsCount}
            </div>
          )}
          <img className='img-shopping-cart' src={shoppingCartIcon} alt="Shopping Cart" />          
        </button>
      </div>

      {/* Mobile Header */}
      <div className="mobile-nav" style={{ position: 'relative', zIndex: 1000 }}>
        <div className="mobile-burger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          ☰
        </div>
        <div className="header-center">
          <img className="img-header-center" src={centeredIcon} alt="Centered Icon" />
        </div>
        <div 
          className="header-right" 
          onClick={onCartClick} 
          style={{ position: 'relative', cursor: 'pointer' }}
        >
          <img className="img-shopping-cart" src={shoppingCartIcon} alt="Shopping Cart" />
          {totalItemsCount > 0 && (
            <div className="item-count-bubble">
              {totalItemsCount}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`mobile-menu-dropdown ${mobileMenuOpen ? 'open' : ''}`}>
        {categories.map((cat) => (
          <span
            key={cat.id}
            className={`mobile-menu-item ${activeCategory === cat.name.toLowerCase() ? 'selected' : ''}`}
            onClick={() => handleCategoryClick(cat.name)}
          >
            {cat.name}
          </span>
        ))}
      </div>
    </>
  );
};

export default Header;
