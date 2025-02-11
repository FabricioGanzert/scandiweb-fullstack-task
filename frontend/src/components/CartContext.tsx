/* eslint-disable react-refresh/only-export-components */
import React from 'react'; // Add this line
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem } from '../types/types';
import translations from '../lang/translations';

interface CartContextProps {
  cartItems: CartItem[];
  addItem: (item: CartItem) => void;
  updateItemQuantity: (
    productId: string,
    selectedAttributes: { [key: string]: string },
    newQuantity: number
  ) => void;
  removeItem: (productId: string, selectedAttributes: { [key: string]: string }) => void;
  clearCart: () => void; 
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'cart';

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const storedCart = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedCart) setCartItems(JSON.parse(storedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addItem = (item: CartItem) => {
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (prevItem) =>
          prevItem.product.id === item.product.id &&
          JSON.stringify(prevItem.selectedAttributes) ===
            JSON.stringify(item.selectedAttributes)
      );
      if (existingIndex !== -1) {
        const newItems = [...prevItems];
        newItems[existingIndex].quantity += item.quantity;
        return newItems;
      }
      return [...prevItems, item];
    });
  };

  const updateItemQuantity = (
    productId: string,
    selectedAttributes: { [key: string]: string },
    newQuantity: number
  ) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.product.id === productId &&
          JSON.stringify(item.selectedAttributes) === JSON.stringify(selectedAttributes)
            ? { ...item, quantity: newQuantity }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (productId: string, selectedAttributes: { [key: string]: string }) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) =>
          !(
            item.product.id === productId &&
            JSON.stringify(item.selectedAttributes) === JSON.stringify(selectedAttributes)
          )
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addItem, updateItemQuantity, removeItem, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error(translations.en.cartError);
  }
  return context;
};
