import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Spinner } from '@heroui/react';
import { useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Context, type IStoreContext } from '@/store/StoreProvider';
import type { Collection, Product } from '@/types/types';

interface CollectionProductsModalProps {
  isOpen: boolean;
  onClose: () => void;
  collection: Collection | null;
  onAddProduct?: () => void;
}

const CollectionProductsModal = observer(({ isOpen, onClose, collection, onAddProduct }: CollectionProductsModalProps) => {
  const { collection: collectionStore } = useContext(Context) as IStoreContext;

  useEffect(() => {
    if (isOpen && collection) {
      collectionStore.fetchCollectionProducts(collection.id);
    }
  }, [isOpen, collection, collectionStore]);

  const handleRemoveProduct = async (productId: number) => {
    if (!collection) return;
    
    try {
      await collectionStore.removeProductFromCollection(collection.id, productId);
    } catch (error) {
      console.error('Error removing product from collection:', error);
    }
  };

  const handleAddProduct = () => {
    if (onAddProduct) {
      onAddProduct();
    }
  };

  if (!collection) return null;

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onClose} size="4xl">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Продукты в коллекции "{collection.name}"
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  Всего продуктов: {collectionStore.collectionProducts.length}
                </p>
                <Button
                  color="primary"
                  size="sm"
                  onPress={handleAddProduct}
                >
                  Добавить продукт
                </Button>
              </div>

              {collectionStore.loading ? (
                <div className="flex justify-center items-center py-8">
                  <Spinner size="lg" />
                </div>
              ) : collectionStore.collectionProducts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">В коллекции нет продуктов</p>
                </div>
              ) : (
                <Table aria-label="Продукты коллекции">
                  <TableHeader>
                    <TableColumn>Фото</TableColumn>
                    <TableColumn>Название</TableColumn>
                    <TableColumn>Цена</TableColumn>
                    <TableColumn>Статус</TableColumn>
                    <TableColumn>Действия</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {collectionStore.collectionProducts.map((product: Product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <img src={product.mediaFiles?.[0]?.url} alt={product.name} width={50} height={50} />
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{product.name}</div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="text-sm">{product.priceKZT} ₸</div>
                            <div className="text-xs text-gray-500">{product.priceUSD} $</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            size="sm" 
                            variant="flat" 
                            color={product.status === 'AVAILABLE' ? 'success' : product.status === 'SOLD' ? 'warning' : 'danger'}
                          >
                            {product.status === 'AVAILABLE' ? 'Доступен' : product.status === 'SOLD' ? 'Продан' : 'Удален'}
                          </Chip>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="light"
                            color="danger"
                            onPress={() => handleRemoveProduct(product.id)}
                          >
                            Удалить
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onPress={onClose}>
              Закрыть
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
});

export default CollectionProductsModal;
