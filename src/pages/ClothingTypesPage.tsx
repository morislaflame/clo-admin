import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Spinner, Alert } from '@heroui/react';
import { Context, type IStoreContext } from '@/store/StoreProvider';
import {
  ClothingTypesHeader,
  ClothingTypesTable,
  CreateClothingTypeModal,
  EditClothingTypeModal
} from '@/components/ClothingTypesPageComponents';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';

const ClothingTypesPage = observer(() => {
  const { user, clothingType } = useContext(Context) as IStoreContext;
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [newTypeName, setNewTypeName] = React.useState('');
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [editingType, setEditingType] = React.useState<{ id: number; name: string; createdAt: string } | null>(null);
  const [editedName, setEditedName] = React.useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [deletingType, setDeletingType] = React.useState<{ id: number; name: string; createdAt: string } | null>(null);

  useEffect(() => {
    if (user.isAuth) {
      clothingType.fetchClothingTypes();
      clothingType.fetchStatistics();
    }
  }, [user.isAuth, clothingType]);

  const handleCreateType = async () => {
    if (!newTypeName.trim()) return;
    
    try {
      await clothingType.createClothingType({ name: newTypeName.trim() });
      setNewTypeName('');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating clothing type:', error);
    }
  };

  const handleCreateDefaults = async () => {
    try {
      await clothingType.createDefaultClothingTypes();
    } catch (error) {
      console.error('Error creating default types:', error);
    }
  };

  const handleEditType = (type: { id: number; name: string; createdAt: string }) => {
    setEditingType(type);
    setEditedName(type.name);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingType || !editedName.trim()) return;
    
    try {
      await clothingType.updateClothingType(editingType.id, { name: editedName.trim() });
      setIsEditModalOpen(false);
      setEditingType(null);
      setEditedName('');
    } catch (error) {
      console.error('Error updating clothing type:', error);
    }
  };

  const handleDeleteType = (type: { id: number; name: string; createdAt: string }) => {
    setDeletingType(type);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingType) return;
    
    try {
      await clothingType.deleteClothingType(deletingType.id);
      setIsDeleteModalOpen(false);
      setDeletingType(null);
      // Обновляем статистику после удаления
      clothingType.fetchStatistics();
    } catch (error) {
      console.error('Error deleting clothing type:', error);
      // Ошибка уже обработана в store, можно показать уведомление
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
      <ClothingTypesHeader
        onCreateDefaults={handleCreateDefaults}
        onCreateType={() => setIsModalOpen(true)}
        isLoading={clothingType.loading}
      />

      {clothingType.loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      ) : clothingType.isServerError ? (
        <Alert color="danger" variant="flat">
          {clothingType.error || 'Ошибка загрузки типов одежды'}
        </Alert>
      ) : (
        <div className="space-y-6">
          {/* <ClothingTypesStatistics statistics={clothingType.statistics} /> */}
          <ClothingTypesTable
            clothingTypes={clothingType.clothingTypes}
            onEdit={handleEditType}
            onDelete={handleDeleteType}
          />
        </div>
      )}

      <CreateClothingTypeModal
        isOpen={isModalOpen}
        onOpenChange={() => setIsModalOpen(!isModalOpen)}
        newTypeName={newTypeName}
        setNewTypeName={setNewTypeName}
        onCreateType={handleCreateType}
      />

      <EditClothingTypeModal
        isOpen={isEditModalOpen}
        onOpenChange={() => setIsEditModalOpen(!isEditModalOpen)}
        clothingType={editingType}
        editedName={editedName}
        setEditedName={setEditedName}
        onSave={handleSaveEdit}
        isLoading={clothingType.loading}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onOpenChange={() => setIsDeleteModalOpen(!isDeleteModalOpen)}
        title="Удалить тип одежды"
        itemName={deletingType?.name || ''}
        itemDetails={deletingType ? `ID: ${deletingType.id} | Создан: ${new Date(deletingType.createdAt).toLocaleDateString('ru-RU')}` : ''}
        warningMessage="Если этот тип используется в продуктах, удаление будет невозможно."
        onConfirmDelete={handleConfirmDelete}
        isLoading={clothingType.loading}
      />
    </div>
  );
});

export default ClothingTypesPage;
