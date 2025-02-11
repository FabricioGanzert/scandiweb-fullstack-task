import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../components/CartContext';
import goCartIcon from '../assets/go-cart-icon.png';
import translations from '../lang/translations';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    inStock: boolean;
    brand: string;
    prices: { amount: number; currency: { label: string; symbol: string } }[];
    gallery: string[];
    category: string;
    attributes?: { id: string; name: string; items: { value: string }[] }[];
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [hover, setHover] = useState(false);
  const { addItem } = useCart();

  const handleQuickShop = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
  
    if (!product.inStock) return;
  
    // Select the first attribute option for each attribute as default
    const defaultAttributes: { [key: string]: string } = {};
    if (product.attributes) {
      product.attributes.forEach((attribute) => {
        defaultAttributes[attribute.id] = attribute.items[0].value;
      });
    }
  
    // Map attributes to fit the CartItem requirement
    const mappedAttributes =
      product.attributes?.map((attr) => ({
        id: attr.id,
        name: attr.name,
        type: 'text', // Assume 'text' or use appropriate logic if available
        items: attr.items.map((item) => ({
          id: item.value, // Use value as id if no unique id exists
          value: item.value,
          displayValue: item.value,
        })),
      })) || [];
  
    const newCartItem = {
      product: { ...product, attributes: mappedAttributes },
      selectedAttributes: defaultAttributes,
      quantity: 1,
    };
  
    addItem(newCartItem);
    //console.log('Quick shop: added product to cart', newCartItem);
  };

  // Convert the product name to kebab case for data-testid
  const productNameKebabCase = product.name.toLowerCase().replace(/\s+/g, '-');

  return (
    <div
      className="product-card"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ position: 'relative' }}
      data-testid={`product-${productNameKebabCase}`}  // Added data-testid here
    >
      <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="image-container" style={{ position: 'relative' }}>
          <img
            src={
              product.gallery && product.gallery.length > 0
                ? product.gallery[0]
                : 'https://via.placeholder.com/357x332'
            }
            alt={product.name}
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'contain',
              filter: product.inStock ? 'none' : 'grayscale(100%)',
              opacity: product.inStock ? 1 : 0.5,
            }}
          />

          {/* Out-of-stock overlay */}
          {!product.inStock && (
            <div className="out-of-stock-overlay">{translations.en.out_of_stock}</div>
          )}

          {/* Quick Shop Button (only for in-stock items) */}
          {product.inStock && hover && (
            <button
              className="quick-shop-btn"
              onClick={handleQuickShop}
            >
              <img style={{ width: '60px' }} src={goCartIcon} alt="Quick Shop" />
            </button>
          )}
        </div>
        <div className="product-name" style={{ marginTop: '10px' }}>
          {product.name}
        </div>
        <div className="product-price" style={{ marginTop: '5px', fontWeight: 'bold' }}>
          {product.prices && product.prices.length > 0
            ? `${product.prices[0].currency.symbol}${product.prices[0].amount.toFixed(2)}`
            : '$0.00'}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
