import { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Alert,
  useDisclosure
} from '@heroui/react';
import { Context, type IStoreContext } from '@/store/StoreProvider';
import { 
  CollectionsHeader, 
  CollectionsTable, 
  CreateCollectionModal, 
  EditCollectionModal, 
  ViewCollectionModal,
  CollectionProductsModal,
  AddProductToCollectionModal
} from '@/components/CollectionsPageComponents';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';
import type { Collection } from '@/types/types';

const CollectionsPage = observer(() => {
  const { user, collection } = useContext(Context) as IStoreContext;
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onOpenChange: onEditOpenChange } = useDisclosure();
  const { isOpen: isViewOpen, onOpen: onViewOpen, onOpenChange: onViewOpenChange } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onOpenChange: onDeleteOpenChange } = useDisclosure();
  const { isOpen: isProductsOpen, onOpen: onProductsOpen, onOpenChange: onProductsOpenChange } = useDisclosure();
  const { isOpen: isAddProductOpen, onOpen: onAddProductOpen, onOpenChange: onAddProductOpenChange } = useDisclosure();
  
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [deletingCollection, setDeletingCollection] = useState<Collection | null>(null);

  useEffect(() => {
    if (user.isAuth) {
      collection.fetchCollections();
    }
  }, [user.isAuth, collection]);

  const handleCollectionAction = (action: string, collectionItem: Collection) => {
    switch (action) {
      case 'edit':
        setSelectedCollection(collectionItem);
        onEditOpen();
        break;
      case 'view':
        setSelectedCollection(collectionItem);
        onViewOpen();
        break;
      case 'delete':
        setDeletingCollection(collectionItem);
        onDeleteOpen();
        break;
      case 'products':
        setSelectedCollection(collectionItem);
        onProductsOpen();
        break;
      default:
        console.log('Неизвестное действие:', action);
    }
  };

  const handleCollectionCreated = () => {
    // Обновляем список коллекций после создания
    collection.fetchCollections();
  };

  const handleCollectionUpdated = () => {
    // Обновляем список коллекций после редактирования
    collection.fetchCollections();
    setSelectedCollection(null);
  };

  const handleProductsUpdated = () => {
    // Обновляем список коллекций после изменения продуктов
    collection.fetchCollections();
    if (selectedCollection) {
      collection.fetchCollectionById(selectedCollection.id);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingCollection) return;
    
    try {
      await collection.deleteCollection(deletingCollection.id);
      onDeleteOpenChange();
      setDeletingCollection(null);
    } catch (error) {
      console.error('Error deleting collection:', error);
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
      <CollectionsHeader onCreateCollection={onOpen} />

      <CollectionsTable
        collections={collection.collections}
        totalCount={collection.totalCount}
        loading={collection.loading}
        error={collection.error}
        isServerError={collection.isServerError}
        onCollectionAction={handleCollectionAction}
      />

      <CreateCollectionModal
        isOpen={isOpen}
        onClose={onOpenChange}
        onSuccess={handleCollectionCreated}
      />

      <EditCollectionModal
        isOpen={isEditOpen}
        onClose={onEditOpenChange}
        collection={selectedCollection}
        onSuccess={handleCollectionUpdated}
      />

      <ViewCollectionModal
        isOpen={isViewOpen}
        onClose={onViewOpenChange}
        collection={selectedCollection}
      />

      <CollectionProductsModal
        isOpen={isProductsOpen}
        onClose={onProductsOpenChange}
        collection={selectedCollection}
        onAddProduct={onAddProductOpen}
      />

      <AddProductToCollectionModal
        isOpen={isAddProductOpen}
        onClose={onAddProductOpenChange}
        collection={selectedCollection}
        onSuccess={handleProductsUpdated}
      />

      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onOpenChange={onDeleteOpenChange}
        title="Удалить коллекцию"
        itemName={deletingCollection?.name || ''}
        itemDetails={deletingCollection ? `ID: ${deletingCollection.id} | Продуктов: ${deletingCollection.products?.length || 0}` : ''}
        warningMessage="Коллекция будет полностью удалена из системы."
        onConfirmDelete={handleConfirmDelete}
        isLoading={collection.loading}
      />
    </div>
  );
});

export default CollectionsPage;
