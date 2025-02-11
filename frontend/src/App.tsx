import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import ProductList from './components/ProductList';
import ProductDetail from './pages/ProductDetail';
import { CartProvider } from './components/CartContext';
import CartOverlay from './components/CartOverlay';

const App: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleCartClick = () => {
    setIsCartOpen((prev) => !prev);
  };

  return (
    <CartProvider>
      <div className={`app-container ${isCartOpen ? 'cart-open' : ''}`}>
        <Header
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          onCartClick={handleCartClick}
        />

        {isCartOpen && (
          <>
            {/* Overlay background to grey out the page */}
            <div className="overlay-background" onClick={handleCartClick} />
            <div className="cart-overlay-wrapper" data-testid="cart-overlay">
              <CartOverlay />
            </div>
          </>
        )}

        <Routes>
          <Route path="/" element={<ProductList selectedCategory={selectedCategory} />} />
          <Route path='/:category' element={<ProductList selectedCategory={selectedCategory} />} />
          <Route
            path="/product/:productId"
            element={<ProductDetail onAddToCart={handleCartClick} />}
          />
        </Routes>
      </div>
    </CartProvider>
  );
};

export default App;
