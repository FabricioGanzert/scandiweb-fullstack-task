import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../components/CartContext';
import { Product, CartItem } from '../types/types';
import translations from '../lang/translations';

const stripHtmlTags = (html: string): string => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || '';
};

const PRODUCT_QUERY = `
  query GetProduct($id: String!) {
    product(id: $id) {
      id
      name
      description
      inStock
      prices {
        amount
        currency {
          label
          symbol
        }
      }
      gallery
      attributes {
        id
        name
        type
        items {
          displayValue
          value
          id
        }
      }
    }
  }
`;

interface ProductDetailsProps {
  onAddToCart: () => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ onAddToCart }) => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedAttributes, setSelectedAttributes] = useState<{
    [key: string]: string;
  }>({});
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [canAddToCart, setCanAddToCart] = useState<boolean>(false);
  const { addItem } = useCart();

  const fetchProduct = async (id: string) => {
    const endpoint = import.meta.env.VITE_ENDPOINT_GRAPH_QL;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: PRODUCT_QUERY,
        variables: { id },
      }),
    });

    const { data } = await response.json();
    setProduct(data.product);
    setSelectedImage(data.product.gallery[0]);
  };

  useEffect(() => {
    if (productId) fetchProduct(productId);
  }, [productId]);

  useEffect(() => {
    if (product) {
      const allAttributesSelected = product.attributes.every(
        (attr) => selectedAttributes[attr.name]
      );
      setCanAddToCart(product.inStock && allAttributesSelected);
    }
  }, [product, selectedAttributes]);

  const handleAttributeSelection = (attributeName: string, value: string) => {
    setSelectedAttributes((prev) => ({ ...prev, [attributeName]: value }));
  };

  const handleAddToCart = () => {
    if (canAddToCart && product) {
      const newCartItem: CartItem = {
        product,
        selectedAttributes,
        quantity: 1,
      };
      addItem(newCartItem);
      onAddToCart(); // Open cart overlay
    }
  };

  if (!product)
    return <p className="loading-product-detail">Loading...</p>;

  const handlePreviousImage = () => {
    const currentIndex = product.gallery.findIndex(
      (image) => image === selectedImage
    );
    const newIndex =
      currentIndex === 0
        ? product.gallery.length - 1
        : currentIndex - 1;
    setSelectedImage(product.gallery[newIndex]);
  };

  const handleNextImage = () => {
    const currentIndex = product.gallery.findIndex(
      (image) => image === selectedImage
    );
    const newIndex =
      currentIndex === product.gallery.length - 1
        ? 0
        : currentIndex + 1;
    setSelectedImage(product.gallery[newIndex]);
  };

  return (
    <div className="product-details">
      <div className="gallery-section" data-testid='product-gallery'>
        <div className="thumbnail-gallery-container">
          <div className="thumbnail-gallery">
            {product.gallery.map((image, index) => (
              <div className="img-detail-container" key={index}>
                <img
                  src={image}
                  alt={`Product thumbnail ${index + 1}`}
                  onClick={() => setSelectedImage(image)}
                  className={`thumbnail ${
                    selectedImage === image ? 'active' : ''
                  }`}
                  data-testid={`product-thumbnail-${index}`}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="main-image2">
          {product.gallery.map((image, index) => (
            <img
              key={index}
              src={image}
              className="main-img-product-detail"
              alt="Main product"
              data-testid="product-main-image"
            />
          ))}
        </div>

        <div className="main-image">
          <button
            className="btn-img-prod-l"
            onClick={handlePreviousImage}
          >
            {'<'}
          </button>
          <img
            src={selectedImage}
            className="main-img-product-detail"
            alt="Main product"
          />
          <button
            className="btn-img-prod-r"
            onClick={handleNextImage}
          >
            {'>'}
          </button>
        </div>
      </div>

      <div className="product-info">
        <h1 data-testid="product-name">{product.name}</h1>
        {product.attributes.map((attribute) => (
          <div key={attribute.id} className="product-attribute" data-testid={`product-attribute-${attribute.name.toLowerCase().replace(/\s+/g, '-')}`}>
            <br />
            <p>{attribute.name}:</p>
            <div className="attribute-options">
            {attribute.items.map((item) => (
            <button
              key={item.id}
              className={
                attribute.name !== 'Color'
                  ? `attribute-button ${
                      selectedAttributes[attribute.name] === item.value
                        ? 'selected'
                        : ''
                    }`
                  : `attribute-button-swatch ${
                      selectedAttributes[attribute.name] === item.value
                        ? 'selected'
                        : ''
                    }`
              }
              onClick={() =>
                handleAttributeSelection(attribute.name, item.value)
              }
              data-testid={`product-attribute-${attribute.name.toLowerCase().replace(/\s+/g, '-')}-${item.value.replace(/\s+/g, '-')}`}
            >
              {attribute.type === 'swatch' ? (
                <span
                  style={{
                    backgroundColor: item.value,
                    display: 'inline-block',
                    width: '30px',
                    height: '30px',
                    padding: '0',
                    margin: '0',
                  }}
                />
              ) : (
                item.displayValue
              )}
            </button>
          ))}
            </div>
          </div>
        ))}

        <p className="price" data-testid="product-price">
          <span>{translations.en.priceLabel}</span>
          <br />
          {product.prices[0].currency.symbol}
          {product.prices[0].amount.toFixed(2)}
        </p>

        <button
          className={`add-to-cart-button ${
            !canAddToCart
              ? 'cant-add-to-cart-product'
              : 'can-add-to-cart-product'
          }`}
          disabled={!canAddToCart}
          onClick={handleAddToCart}
          data-testid="add-to-cart"
        >
          Add to Cart
        </button>
        <span className="out-of-stock-span-label">
          {product.inStock ? '' : ' out of stock'}
        </span>

        <div className="product-description" data-testid="product-description">
          <p>{stripHtmlTags(product.description)}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
