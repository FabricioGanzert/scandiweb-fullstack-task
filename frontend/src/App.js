import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import ProductList from './components/ProductList';
import ProductDetail from './pages/ProductDetail';
import { CartProvider } from './components/CartContext';
import CartOverlay from './components/CartOverlay';
const App = () => {
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [isCartOpen, setIsCartOpen] = useState(false);
    const handleCartClick = () => {
        setIsCartOpen((prev) => !prev);
    };
    return (React.createElement(CartProvider, null,
        React.createElement("div", { className: `app-container ${isCartOpen ? 'cart-open' : ''}` },
            React.createElement(Header, { selectedCategory: selectedCategory, setSelectedCategory: setSelectedCategory, onCartClick: handleCartClick }),
            isCartOpen && (React.createElement(React.Fragment, null,
                React.createElement("div", { className: "overlay-background", onClick: handleCartClick }),
                React.createElement("div", { className: "cart-overlay-wrapper", "data-testid": "cart-overlay" },
                    React.createElement(CartOverlay, null)))),
            React.createElement(Routes, null,
                React.createElement(Route, { path: "/", element: React.createElement(ProductList, { selectedCategory: selectedCategory }) }),
                React.createElement(Route, { path: '/:category', element: React.createElement(ProductList, { selectedCategory: selectedCategory }) }),
                React.createElement(Route, { path: "/product/:productId", element: React.createElement(ProductDetail, { onAddToCart: handleCartClick }) })))));
};
export default App;
