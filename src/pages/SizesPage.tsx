import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Spinner, Alert } from '@heroui/react';
import { Context, type IStoreContext } from '@/store/StoreProvider';
import {
  SizesHeader,
  SizesTable,
  CreateSizeModal
} from '@/components/SizesPageComponents';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';

const SizesPage = observer(() => {
  const { user, size } = useContext(Context) as IStoreContext;
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [newSizeName, setNewSizeName] = React.useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [deletingSize, setDeletingSize] = React.useState<{ id: number; name: string; createdAt: string } | null>(null);

  useEffect(() => {
    if (user.isAuth) {
      size.fetchSizes();
    }
  }, [user.isAuth, size]);

  const handleCreateSize = async () => {
    if (!newSizeName.trim()) return;
    
    try {
      await size.createSize({ name: newSizeName.trim() });
      setNewSizeName('');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating size:', error);
    }
  };

  const handleCreateDefaults = async () => {
    try {
      await size.createDefaultSizes();
    } catch (error) {
      console.error('Error creating default sizes:', error);
    }
  };

  const handleDeleteSize = (sizeItem: { id: number; name: string; createdAt: string }) => {
    setDeletingSize(sizeItem);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingSize) return;
    
    try {
      await size.deleteSize(deletingSize.id);
      setIsDeleteModalOpen(false);
      setDeletingSize(null);
    } catch (error) {
      console.error('Error deleting size:', error);
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
      <SizesHeader
        onCreateDefaults={handleCreateDefaults}
        onCreateSize={() => setIsModalOpen(true)}
        isLoading={size.loading}
      />

      {size.loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      ) : size.isServerError ? (
        <Alert color="danger" variant="flat">
          {size.error || 'Ошибка загрузки размеров'}
        </Alert>
      ) : (
        <SizesTable
          sizes={size.sizes}
          onDelete={handleDeleteSize}
        />
      )}

      <CreateSizeModal
        isOpen={isModalOpen}
        onOpenChange={() => setIsModalOpen(!isModalOpen)}
        newSizeName={newSizeName}
        setNewSizeName={setNewSizeName}
        onCreateSize={handleCreateSize}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onOpenChange={() => setIsDeleteModalOpen(!isDeleteModalOpen)}
        title="Удалить размер"
        itemName={deletingSize?.name || ''}
        itemDetails={deletingSize ? `ID: ${deletingSize.id} | Создан: ${new Date(deletingSize.createdAt).toLocaleDateString('ru-RU')}` : ''}
        warningMessage="Если этот размер используется в продуктах, удаление будет невозможно."
        onConfirmDelete={handleConfirmDelete}
        isLoading={size.loading}
      />
    </div>
  );
});

export default SizesPage;
