import { useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Button,
  Alert,
  useDisclosure
} from '@heroui/react';
import { Context, type IStoreContext } from '@/store/StoreProvider';
import { AddProductModal, ProductsTable } from '@/components/ProductsPageComponents';
import type { Product } from '@/types/types';

const ProductsPage = observer(() => {
  const { user, product } = useContext(Context) as IStoreContext;
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    if (user.isAuth) {
      product.fetchProducts();
    }
  }, [user.isAuth, product]);

  const handleProductAction = (action: string, productItem: Product) => {
    switch (action) {
      case 'edit':
        console.log('Редактировать продукт:', productItem.id);
        // TODO: Реализовать редактирование
        break;
      case 'view':
        console.log('Просмотр продукта:', productItem.id);
        // TODO: Реализовать просмотр
        break;
      case 'media':
        console.log('Управление медиафайлами:', productItem.id);
        // TODO: Реализовать управление медиафайлами
        break;
      case 'delete':
        if (confirm(`Вы уверены, что хотите удалить продукт "${productItem.name}"?`)) {
          product.deleteProduct(productItem.id);
        }
        break;
      default:
        console.log('Неизвестное действие:', action);
    }
  };

  const handleProductCreated = () => {
    // Обновляем список продуктов после создания
    product.fetchProducts();
  };

  if (!user.isAuth) {
    return (
      <div className="p-6">
        <Alert color="warning" variant="flat">
          Необходима авторизация для доступа к этой странице
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Управление продуктами</h1>
        <Button color="primary" size="lg" onPress={onOpen}>
          Создать продукт
        </Button>
      </div>

      <ProductsTable
        products={product.products}
        totalCount={product.totalCount}
        loading={product.loading}
        error={product.error}
        isServerError={product.isServerError}
        onProductAction={handleProductAction}
      />

      <AddProductModal
        isOpen={isOpen}
        onClose={onOpenChange}
        onSuccess={handleProductCreated}
      />
    </div>
  );
});

export default ProductsPage;
