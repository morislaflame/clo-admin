import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, Input, Checkbox } from '@heroui/react';
import { useState, useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Context, type IStoreContext } from '@/store/StoreProvider';
import type { Collection, Product } from '@/types/types';

interface AddProductToCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  collection: Collection | null;
  onSuccess: () => void;
}

const AddProductToCollectionModal = observer(({ isOpen, onClose, collection, onSuccess }: AddProductToCollectionModalProps) => {
  const { collection: collectionStore } = useContext(Context) as IStoreContext;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

  useEffect(() => {
    if (isOpen) {
      collectionStore.fetchAvailableProducts();
    }
  }, [isOpen, collectionStore]);

  const handleClose = () => {
    setSearchTerm('');
    setSelectedProducts([]);
    onClose();
  };

  const handleAddProducts = async () => {
    if (!collection || selectedProducts.length === 0) return;

    try {
      for (const productId of selectedProducts) {
        await collectionStore.addProductToCollection(collection.id, productId);
      }
      onSuccess();
      handleClose();
    } catch (error) {
      console.error('Error adding products to collection:', error);
    }
  };

  const handleProductSelect = (productId: number) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const filteredProducts = collectionStore.collectionProducts.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Modal isOpen={isOpen} onOpenChange={handleClose} size="4xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Добавить продукты в коллекцию "{collection?.name}"
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <Input
              placeholder="Поиск продуктов..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              variant="bordered"
            />

            {collectionStore.loading ? (
              <div className="flex justify-center items-center py-8">
                <Spinner size="lg" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Доступные продукты не найдены</p>
              </div>
            ) : (
              <Table aria-label="Доступные продукты">
                <TableHeader>
                  <TableColumn>Выбрать</TableColumn>
                  <TableColumn>Фото</TableColumn>
                  <TableColumn>Название</TableColumn>
                  <TableColumn>Цена</TableColumn>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product: Product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <Checkbox
                          isSelected={selectedProducts.includes(product.id)}
                          onValueChange={() => handleProductSelect(product.id)}
                        />
                      </TableCell>
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={handleClose}>
            Отмена
          </Button>
          <Button 
            color="primary" 
            onPress={handleAddProducts}
            isDisabled={selectedProducts.length === 0}
            isLoading={collectionStore.loading}
          >
            Подтвердить ({selectedProducts.length})
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
});

export default AddProductToCollectionModal;
