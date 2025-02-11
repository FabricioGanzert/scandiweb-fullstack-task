import React from 'react';
import { useCart } from './CartContext';
import '../CartOverlay.css';
import translations from '../lang/translations';
const CartOverlay = () => {
    const { cartItems, updateItemQuantity, removeItem, clearCart } = useCart();
    const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = cartItems.reduce((acc, item) => {
        const price = item.product.prices[0].amount;
        return acc + price * item.quantity;
    }, 0);
    const handlePlaceOrder = async () => {
        // Build an array of items in the format required by the backend.
        const items = cartItems.map((item) => ({
            product_id: item.product.id,
            quantity: item.quantity,
            price: item.product.prices[0].amount,
            // Convert the selectedAttributes object to a JSON string.
            // We then replace double quotes with escaped quotes for insertion into our query string.
            selectedAttributes: JSON.stringify(item.selectedAttributes).replace(/"/g, '\\"'),
        }));
        // Build the items string for the mutation.
        const itemsString = items
            .map((item) => `{ product_id: "${item.product_id}", quantity: ${item.quantity}, price: ${item.price}, selectedAttributes: "${item.selectedAttributes}" }`)
            .join(', ');
        // Build the full GraphQL mutation string.
        const mutationQuery = `
      mutation AddToCart {
        createOrder(order: { items: [ ${itemsString} ] }) {
          id
          total
          order_date
        }
      }
    `;
        const endpoint = import.meta.env.VITE_ENDPOINT_GRAPH_QL;
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: mutationQuery }),
            });
            const result = await response.json();
            if (result.errors) {
                console.error("Error creating order:", result.errors);
                alert(`${translations.en.order_placed}`);
            }
            else {
                console.log("Order created:", result.data.createOrder);
                alert(`${translations.en.order_placed}`);
                clearCart();
            }
        }
        catch (error) {
            console.error("Error placing order:", error);
            alert(`${translations.en.error_submit_order}`);
        }
    };
    return (React.createElement("div", { className: "overlay-container" },
        React.createElement("div", { className: "cart-overlay" },
            React.createElement("h2", { className: "cart-title" },
                translations.en.my_bag,
                ", ",
                totalItemsCount,
                " ",
                totalItemsCount === 1 ? 'Item' : 'Items'),
            React.createElement("div", { className: "cart-items" }, cartItems.map((item, index) => (React.createElement("div", { key: index, className: "cart-item" },
                React.createElement("div", { className: "cart-item-info" },
                    React.createElement("h3", null, item.product.name),
                    React.createElement("p", { className: "cart-item-price" },
                        item.product.prices[0].currency.symbol,
                        item.product.prices[0].amount.toFixed(2)),
                    React.createElement("div", { className: "cart-item-attributes" }, item.product.attributes.map((attribute) => (React.createElement("div", { key: attribute.id, className: "attribute-group", "data-testid": `cart-item-attribute-${attribute.name.toLowerCase().replace(' ', '-')}` },
                        React.createElement("p", null,
                            attribute.name,
                            ":"),
                        React.createElement("div", { className: "attribute-options" }, attribute.items.map((option) => (React.createElement("span", { key: option.id }, attribute.name === 'Color' ? (React.createElement("span", { className: `attribute-option-swatch${item.selectedAttributes[attribute.name] === option.value ? '-selected' : ''}`, "data-testid": `cart-item-attribute-${attribute.name.toLowerCase().replace(' ', '-')}-${option.value.toLowerCase().replace(' ', '-')}${item.selectedAttributes[attribute.name] === option.value ? '-selected' : ''}`, style: { backgroundColor: option.value } })) : (React.createElement("span", { className: `attribute-option${item.selectedAttributes[attribute.name] === option.value ? '-selected' : ''}`, "data-testid": `cart-item-attribute-${attribute.name.toLowerCase().replace(' ', '-')}-${option.value.toLowerCase().replace(' ', '-')}${item.selectedAttributes[attribute.name] === option.value ? '-selected' : ''}` }, option.value))))))))))),
                React.createElement("div", { className: "cart-item-quantity-controls" },
                    React.createElement("button", { className: "quantity-btn", "data-testid": "cart-item-amount-increase", onClick: () => updateItemQuantity(item.product.id, item.selectedAttributes, item.quantity + 1) }, "+"),
                    React.createElement("span", { className: "quantity-indicator", "data-testid": "cart-item-amount" }, item.quantity),
                    React.createElement("button", { className: "quantity-btn", "data-testid": "cart-item-amount-decrease", onClick: () => {
                            if (item.quantity === 1) {
                                removeItem(item.product.id, item.selectedAttributes);
                            }
                            else {
                                updateItemQuantity(item.product.id, item.selectedAttributes, item.quantity - 1);
                            }
                        } }, "-")),
                React.createElement("div", { className: "cart-item-image" },
                    React.createElement("img", { src: item.product.gallery[0], alt: item.product.name, className: "cart-product-image" })))))),
            React.createElement("div", { className: "cart-total", "data-testid": "cart-total" },
                React.createElement("h3", null,
                    translations.en.total_cart,
                    " ",
                    React.createElement("span", null,
                        "$",
                        totalPrice.toFixed(2)))),
            React.createElement("button", { onClick: handlePlaceOrder, disabled: cartItems.length === 0, className: cartItems.length > 0 ? 'place-order-button' : 'place-order-button-disabled' }, translations.en.place_order))));
};
export default CartOverlay;
