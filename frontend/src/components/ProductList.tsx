// ProductList.tsx
import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import translations from '../lang/translations';
import { useParams } from 'react-router-dom';

interface Price {
  amount: number;
  currency: {
    label: string;
    symbol: string;
  };
}

interface Product {
  id: string;
  name: string;
  description: string;
  inStock: boolean;
  brand: string;
  prices: Price[];
  gallery: string[];
  category: string;
}

interface ProductListProps {
  selectedCategory: string;
}

const ProductList: React.FC<ProductListProps> = ({ selectedCategory }) => {
  const { category } = useParams<{ category: string }>() ?? { category: selectedCategory };
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const endpoint = import.meta.env.VITE_ENDPOINT_GRAPH_QL;

  if (!endpoint) {
    throw new Error('REACT_APP_ENDPOINT_GRAPH_QL is not defined in the environment variables.');
  }

  useEffect(() => {
    // Build the query: if category is ALL, fetch all products; otherwise filter by category
    let query;
    const currentCategorySlug = category ?? selectedCategory;

    if (category === import.meta.env.REACT_APP_DEFAULT_CATEGORY_SLUG) {
      query = `{ products { id name description inStock brand prices { amount currency { label symbol } } gallery category attributes { id name type items { displayValue value id } } } }`;
    } else {
      // Use lowercase for the filter if your backend expects it
      query = `{ products(category: "${currentCategorySlug.toLowerCase()}") { id name description inStock brand prices { amount currency { label symbol } } gallery category attributes { id name type items { displayValue value id } } } }`;

    }
    setLoading(true);
    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.data && data.data.products) {
          setProducts(data.data.products);
        } else {
          setProducts([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [category, selectedCategory, endpoint]);

  return (
    <div className="container-fluid">
      <div className="row category_top_spacing">
        {/* Display the selected category as the title */}
        <div className="col-12">
          <h1 className='category_header'>
            {selectedCategory}
          </h1>
        </div>

        {/* Enclosure Div */}
        <div className='container-product-list'>
        <div className="d-flex flex-wrap justify-content-start red">
          {loading ? (
            <div>{translations.en.loading}</div>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center mb-5"
              >
                <ProductCard product={product} />
              </div>
            ))
          )}
        </div>
        </div>

      </div>
    </div>
  );
};

export default ProductList;
