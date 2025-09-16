import { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Button,
  Alert,
  useDisclosure
} from '@heroui/react';
import { Context, type IStoreContext } from '@/store/StoreProvider';
import { AddProductModal, ProductsTable, EditProductModal, ViewProductModal } from '@/components/ProductsPageComponents';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';
import type { Product } from '@/types/types';

const ProductsPage = observer(() => {
  const { user, product } = useContext(Context) as IStoreContext;
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onOpenChange: onEditOpenChange } = useDisclosure();
  const { isOpen: isViewOpen, onOpen: onViewOpen, onOpenChange: onViewOpenChange } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onOpenChange: onDeleteOpenChange } = useDisclosure();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (user.isAuth) {
      product.fetchProducts();
    }
  }, [user.isAuth, product]);

  const handleProductAction = (action: string, productItem: Product) => {
    switch (action) {
      case 'edit':
        setSelectedProduct(productItem);
        onEditOpen();
        break;
      case 'view':
        setSelectedProduct(productItem);
        onViewOpen();
        break;
      case 'delete':
        setDeletingProduct(productItem);
        onDeleteOpen();
        break;
      default:
        console.log('Неизвестное действие:', action);
    }
  };

  const handleProductCreated = () => {
    // Обновляем список продуктов после создания
    product.fetchProducts();
  };

  const handleProductUpdated = () => {
    // Обновляем список продуктов после редактирования
    product.fetchProducts();
    setSelectedProduct(null);
  };

  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;
    
    try {
      await product.deleteProduct(deletingProduct.id);
      onDeleteOpenChange();
      setDeletingProduct(null);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
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

      <EditProductModal
        isOpen={isEditOpen}
        onClose={onEditOpenChange}
        product={selectedProduct}
        onSuccess={handleProductUpdated}
      />

      <ViewProductModal
        isOpen={isViewOpen}
        onClose={onViewOpenChange}
        product={selectedProduct}
      />

      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onOpenChange={onDeleteOpenChange}
        title="Удалить продукт"
        itemName={deletingProduct?.name || ''}
        itemDetails={deletingProduct ? `ID: ${deletingProduct.id} | Цена: ${deletingProduct.priceKZT} ₸` : ''}
        warningMessage="Товар будет полностью удален из системы."
        onConfirmDelete={handleConfirmDelete}
        isLoading={product.loading}
      />
    </div>
  );
});

export default ProductsPage;
