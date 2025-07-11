import { CartItems, EmptyCart, PageTemplate } from '../components';
import type { NextPage } from 'next';
import withCommonHeader from '../hoc/withCommonHeader';
import { useEffect, useState } from 'react';
import { IProductList } from '../types/product';
import { useCart } from '../context/cart';

const Cart: NextPage = () => {
  const { cart } = useCart();
  const [product, setProduct] = useState<IProductList[]>([]);

  useEffect(() => {
    if (cart.length) setProduct(cart);
  }, [cart]);

  return (
    <PageTemplate
      title="customer.pageTitles.cart"
      description="customer.pageDescriptions.cart"
    >
      {product.length ? (
        <div className="sticky-footer">
          <CartItems productList={product} setProductList={setProduct} />
        </div>
      ) : (
        <EmptyCart />
      )}
    </PageTemplate>
  );
};

const cart = withCommonHeader(Cart);

export default cart;
