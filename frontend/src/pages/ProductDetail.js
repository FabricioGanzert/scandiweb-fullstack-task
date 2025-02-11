import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../components/CartContext';
import translations from '../lang/translations';
const stripHtmlTags = (html) => {
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
const ProductDetails = ({ onAddToCart }) => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [selectedAttributes, setSelectedAttributes] = useState({});
    const [selectedImage, setSelectedImage] = useState('');
    const [canAddToCart, setCanAddToCart] = useState(false);
    const { addItem } = useCart();
    const fetchProduct = async (id) => {
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
        if (productId)
            fetchProduct(productId);
    }, [productId]);
    useEffect(() => {
        if (product) {
            const allAttributesSelected = product.attributes.every((attr) => selectedAttributes[attr.name]);
            setCanAddToCart(product.inStock && allAttributesSelected);
        }
    }, [product, selectedAttributes]);
    const handleAttributeSelection = (attributeName, value) => {
        setSelectedAttributes((prev) => ({ ...prev, [attributeName]: value }));
    };
    const handleAddToCart = () => {
        if (canAddToCart && product) {
            const newCartItem = {
                product,
                selectedAttributes,
                quantity: 1,
            };
            addItem(newCartItem);
            onAddToCart(); // Open cart overlay
        }
    };
    if (!product)
        return React.createElement("p", { className: "loading-product-detail" }, "Loading...");
    const handlePreviousImage = () => {
        const currentIndex = product.gallery.findIndex((image) => image === selectedImage);
        const newIndex = currentIndex === 0
            ? product.gallery.length - 1
            : currentIndex - 1;
        setSelectedImage(product.gallery[newIndex]);
    };
    const handleNextImage = () => {
        const currentIndex = product.gallery.findIndex((image) => image === selectedImage);
        const newIndex = currentIndex === product.gallery.length - 1
            ? 0
            : currentIndex + 1;
        setSelectedImage(product.gallery[newIndex]);
    };
    return (React.createElement("div", { className: "product-details" },
        React.createElement("div", { className: "gallery-section", "data-testid": 'product-gallery' },
            React.createElement("div", { className: "thumbnail-gallery-container" },
                React.createElement("div", { className: "thumbnail-gallery" }, product.gallery.map((image, index) => (React.createElement("div", { className: "img-detail-container", key: index },
                    React.createElement("img", { src: image, alt: `Product thumbnail ${index + 1}`, onClick: () => setSelectedImage(image), className: `thumbnail ${selectedImage === image ? 'active' : ''}`, "data-testid": `product-thumbnail-${index}` })))))),
            React.createElement("div", { className: "main-image2" }, product.gallery.map((image, index) => (React.createElement("img", { key: index, src: image, className: "main-img-product-detail", alt: "Main product", "data-testid": "product-main-image" })))),
            React.createElement("div", { className: "main-image" },
                React.createElement("button", { className: "btn-img-prod-l", onClick: handlePreviousImage }, '<'),
                React.createElement("img", { src: selectedImage, className: "main-img-product-detail", alt: "Main product" }),
                React.createElement("button", { className: "btn-img-prod-r", onClick: handleNextImage }, '>'))),
        React.createElement("div", { className: "product-info" },
            React.createElement("h1", { "data-testid": "product-name" }, product.name),
            product.attributes.map((attribute) => (React.createElement("div", { key: attribute.id, className: "product-attribute", "data-testid": `product-attribute-${attribute.name.toLowerCase().replace(/\s+/g, '-')}` },
                React.createElement("br", null),
                React.createElement("p", null,
                    attribute.name,
                    ":"),
                React.createElement("div", { className: "attribute-options" }, attribute.items.map((item) => (React.createElement("button", { key: item.id, className: attribute.name !== 'Color'
                        ? `attribute-button ${selectedAttributes[attribute.name] === item.value
                            ? 'selected'
                            : ''}`
                        : `attribute-button-swatch ${selectedAttributes[attribute.name] === item.value
                            ? 'selected'
                            : ''}`, onClick: () => handleAttributeSelection(attribute.name, item.value), "data-testid": `product-attribute-${attribute.name.toLowerCase().replace(/\s+/g, '-')}-${item.value.replace(/\s+/g, '-')}` }, attribute.type === 'swatch' ? (React.createElement("span", { style: {
                        backgroundColor: item.value,
                        display: 'inline-block',
                        width: '30px',
                        height: '30px',
                        padding: '0',
                        margin: '0',
                    } })) : (item.displayValue)))))))),
            React.createElement("p", { className: "price", "data-testid": "product-price" },
                React.createElement("span", null, translations.en.priceLabel),
                React.createElement("br", null),
                product.prices[0].currency.symbol,
                product.prices[0].amount.toFixed(2)),
            React.createElement("button", { className: `add-to-cart-button ${!canAddToCart
                    ? 'cant-add-to-cart-product'
                    : 'can-add-to-cart-product'}`, disabled: !canAddToCart, onClick: handleAddToCart, "data-testid": "add-to-cart" }, "Add to Cart"),
            React.createElement("span", { className: "out-of-stock-span-label" }, product.inStock ? '' : ' out of stock'),
            React.createElement("div", { className: "product-description", "data-testid": "product-description" },
                React.createElement("p", null, stripHtmlTags(product.description))))));
};
export default ProductDetails;
