import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../components/CartContext'; // Update the import path as necessary
import centeredIcon from '../assets/center_logo_icon.png';
import shoppingCartIcon from '../assets/shopping-cart.png';
const Header = ({ selectedCategory, setSelectedCategory, onCartClick }) => {
    const [categories, setCategories] = useState([]);
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
                const cats = data.data.categories.map((cat) => ({
                    ...cat,
                    name: cat.name.toUpperCase()
                }));
                setCategories(cats);
            }
        })
            .catch((err) => console.error(err));
    }, [endpoint]);
    const handleCategoryClick = (cat) => {
        setSelectedCategory(cat);
        setMobileMenuOpen(false);
        navigate(`/${cat.toLowerCase()}`); // Navigate to main product list
    };
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "header desktop-nav", style: { position: 'relative', zIndex: 1000 } },
            React.createElement("div", { style: { display: 'flex' } }, categories.map((cat) => (React.createElement(Link, { id: cat.id, key: cat.id, "data-testid": activeCategory === cat.name.toLowerCase() ? 'active-category-link' : 'category-link', className: `header-nav-item ${activeCategory === cat.name.toLowerCase() ? 'selected' : ''}`, to: cat.name.toLowerCase() }, cat.name)))),
            React.createElement("div", { className: "header-center" },
                React.createElement("img", { className: "img-header-center", src: centeredIcon, alt: "I am a Logotype!" })),
            React.createElement("button", { className: "header-right", onClick: onCartClick, "data-testid": "cart-btn", style: { position: 'relative', zIndex: 1000, cursor: 'pointer' } },
                totalItemsCount > 0 && (React.createElement("div", { className: "item-count-bubble" }, totalItemsCount)),
                React.createElement("img", { className: 'img-shopping-cart', src: shoppingCartIcon, alt: "Shopping Cart" }))),
        React.createElement("div", { className: "mobile-nav", style: { position: 'relative', zIndex: 1000 } },
            React.createElement("div", { className: "mobile-burger", onClick: () => setMobileMenuOpen(!mobileMenuOpen) }, "\u2630"),
            React.createElement("div", { className: "header-center" },
                React.createElement("img", { className: "img-header-center", src: centeredIcon, alt: "Centered Icon" })),
            React.createElement("div", { className: "header-right", onClick: onCartClick, style: { position: 'relative', cursor: 'pointer' } },
                React.createElement("img", { className: "img-shopping-cart", src: shoppingCartIcon, alt: "Shopping Cart" }),
                totalItemsCount > 0 && (React.createElement("div", { className: "item-count-bubble" }, totalItemsCount)))),
        React.createElement("div", { className: `mobile-menu-dropdown ${mobileMenuOpen ? 'open' : ''}` }, categories.map((cat) => (React.createElement("span", { key: cat.id, className: `mobile-menu-item ${activeCategory === cat.name.toLowerCase() ? 'selected' : ''}`, onClick: () => handleCategoryClick(cat.name) }, cat.name))))));
};
export default Header;
