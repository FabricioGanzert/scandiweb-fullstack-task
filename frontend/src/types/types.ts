  export interface Product {
    id: string;
    name: string;
    description: string;
    inStock: boolean;
    prices: { amount: number; currency: { label: string; symbol: string } }[];
    gallery: string[];
    attributes: {
      id: string;
      name: string;
      type: string;
      items: { displayValue: string; value: string; id: string }[];
    }[];
  }
  
  export interface CartItem {
    product: Product;
    selectedAttributes: { [key: string]: string };
    quantity: number;
  }
  