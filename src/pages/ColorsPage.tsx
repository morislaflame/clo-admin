import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Spinner, Alert } from '@heroui/react';
import { Context, type IStoreContext } from '@/store/StoreProvider';
import {
  ColorsHeader,
  ColorsTable,
  CreateColorModal,
  EditColorModal
} from '@/components/ColorsPageComponents';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';

const ColorsPage = observer(() => {
  const { user, color } = useContext(Context) as IStoreContext;
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [newColorName, setNewColorName] = React.useState('');
  const [newColorHex, setNewColorHex] = React.useState('');
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [editingColor, setEditingColor] = React.useState<{ id: number; name: string; hexCode?: string; createdAt: string } | null>(null);
  const [editedName, setEditedName] = React.useState('');
  const [editedHex, setEditedHex] = React.useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [deletingColor, setDeletingColor] = React.useState<{ id: number; name: string; hexCode?: string; createdAt: string } | null>(null);

  useEffect(() => {
    if (user.isAuth) {
      color.fetchColors();
    }
  }, [user.isAuth, color]);

  const handleCreateColor = async () => {
    if (!newColorName.trim()) return;
    
    try {
      await color.createColor({ 
        name: newColorName.trim(),
        hexCode: newColorHex.trim() || undefined
      });
      setNewColorName('');
      setNewColorHex('');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating color:', error);
    }
  };

  const handleCreateDefaults = async () => {
    try {
      await color.createDefaultColors();
    } catch (error) {
      console.error('Error creating default colors:', error);
    }
  };

  const handleEditColor = (colorItem: { id: number; name: string; hexCode?: string; createdAt: string }) => {
    setEditingColor(colorItem);
    setEditedName(colorItem.name);
    setEditedHex(colorItem.hexCode || '');
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingColor || !editedName.trim()) return;
    
    try {
      await color.updateColor(editingColor.id, { 
        name: editedName.trim(),
        hexCode: editedHex.trim() || undefined
      });
      setIsEditModalOpen(false);
      setEditingColor(null);
      setEditedName('');
      setEditedHex('');
    } catch (error) {
      console.error('Error updating color:', error);
    }
  };

  const handleDeleteColor = (colorItem: { id: number; name: string; hexCode?: string; createdAt: string }) => {
    setDeletingColor(colorItem);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingColor) return;
    
    try {
      await color.deleteColor(deletingColor.id);
      setIsDeleteModalOpen(false);
      setDeletingColor(null);
    } catch (error) {
      console.error('Error deleting color:', error);
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
      <ColorsHeader
        onCreateDefaults={handleCreateDefaults}
        onCreateColor={() => setIsModalOpen(true)}
        isLoading={color.loading}
      />

      {color.loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      ) : color.isServerError ? (
        <Alert color="danger" variant="flat">
          {color.error || 'Ошибка загрузки цветов'}
        </Alert>
      ) : (
        <ColorsTable
          colors={color.colors}
          onEdit={handleEditColor}
          onDelete={handleDeleteColor}
        />
      )}

      <CreateColorModal
        isOpen={isModalOpen}
        onOpenChange={() => setIsModalOpen(!isModalOpen)}
        newColorName={newColorName}
        setNewColorName={setNewColorName}
        newColorHex={newColorHex}
        setNewColorHex={setNewColorHex}
        onCreateColor={handleCreateColor}
      />

      <EditColorModal
        isOpen={isEditModalOpen}
        onOpenChange={() => setIsEditModalOpen(!isEditModalOpen)}
        color={editingColor}
        editedName={editedName}
        setEditedName={setEditedName}
        editedHex={editedHex}
        setEditedHex={setEditedHex}
        onSave={handleSaveEdit}
        isLoading={color.loading}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onOpenChange={() => setIsDeleteModalOpen(!isDeleteModalOpen)}
        title="Удалить цвет"
        itemName={deletingColor?.name || ''}
        itemDetails={deletingColor ? `ID: ${deletingColor.id} | Создан: ${new Date(deletingColor.createdAt).toLocaleDateString('ru-RU')}` : ''}
        warningMessage="Если этот цвет используется в продуктах, удаление будет невозможно."
        onConfirmDelete={handleConfirmDelete}
        isLoading={color.loading}
      />
    </div>
  );
});

export default ColorsPage;
