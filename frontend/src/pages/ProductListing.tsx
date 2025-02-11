import React from 'react';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';

const ProductListing: React.FC = () => {
  // Define a placeholder function for handling the shopping cart click.
  const handleCartClick = () => {
    //console.log('Cart icon clicked!');
  };

  return (
    <div>
      {/* Header */}
      <div className="container-responsive">
        <Header 
          selectedCategory={''} 
          setSelectedCategory={() => {}} 
          onCartClick={handleCartClick} 
        />
      </div>

      {/* Main Content Container */}
      <div className="container-responsive">
        {/* Category Title */}
        <h1 className="category-title">CATEGORY NAME PLACEHOLDER</h1>

        {/* Product Grid */}
        <div className="product-grid">
          {Array.from({ length: 12 }).map((_, index) => (
            <ProductCard 
              key={index} 
              product={{
                id: '',
                name: '',
                description: '',
                inStock: false,
                brand: '',
                prices: [],
                gallery: [],
                category: ''
              }} 
            />
          ))}
        </div>

        {/* Blank footer for extra space */}
        <footer className="footer"></footer>
      </div>
    </div>
  );
};

export default ProductListing;
