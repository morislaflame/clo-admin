import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Spinner, Alert } from '@heroui/react';
import { Context, type IStoreContext } from '@/store/StoreProvider';
import {
  NewsTypesHeader,
  NewsTypesTable,
  CreateNewsTypeModal,
  EditNewsTypeModal
} from '@/components/NewsTypesPageComponents';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';
import type { NewsType } from '@/types/types';

const NewsTypesPage = observer(() => {
  const { user, newsType } = useContext(Context) as IStoreContext;
  
  // Состояния для модалок
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  
  // Состояния для выбранного типа новости
  const [selectedNewsType, setSelectedNewsType] = React.useState<NewsType | null>(null);
  const [deletingNewsType, setDeletingNewsType] = React.useState<NewsType | null>(null);
  
  // Состояния для формы создания/редактирования
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');

  useEffect(() => {
    if (user.isAuth) {
      newsType.fetchNewsTypes();
    }
  }, [user.isAuth, newsType]);

  // Обработчики действий
  const handleCreateNewsType = () => {
    setIsCreateModalOpen(true);
  };

  const handleEditNewsType = (newsTypeItem: NewsType) => {
    setSelectedNewsType(newsTypeItem);
    setName(newsTypeItem.name);
    setDescription(newsTypeItem.description || '');
    setIsEditModalOpen(true);
  };

  const handleDeleteNewsType = (newsTypeItem: NewsType) => {
    setDeletingNewsType(newsTypeItem);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingNewsType) return;
    
    try {
      await newsType.deleteNewsType(deletingNewsType.id);
      setIsDeleteModalOpen(false);
      setDeletingNewsType(null);
    } catch (error) {
      console.error('Error deleting news type:', error);
    }
  };

  const handleCreateNewsTypeSubmit = async () => {
    try {
      await newsType.createNewsType({ 
        name: name.trim(), 
        description: description.trim() || undefined 
      });
      
      // Сброс формы
      setName('');
      setDescription('');
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Error creating news type:', error);
    }
  };

  const handleEditNewsTypeSubmit = async () => {
    if (!selectedNewsType) return;
    
    try {
      await newsType.updateNewsType(selectedNewsType.id, { 
        name: name.trim(), 
        description: description.trim() || undefined 
      });
      
      // Сброс формы
      setName('');
      setDescription('');
      setSelectedNewsType(null);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating news type:', error);
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
      <NewsTypesHeader
        onCreateNewsType={handleCreateNewsType}
        isLoading={newsType.loading}
      />

      {newsType.loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      ) : newsType.isServerError ? (
        <Alert color="danger" variant="flat">
          {newsType.error || 'Ошибка загрузки типов новостей'}
        </Alert>
      ) : (
        <NewsTypesTable
          newsTypes={newsType.newsTypes}
          onEdit={handleEditNewsType}
          onDelete={handleDeleteNewsType}
        />
      )}

      <CreateNewsTypeModal
        isOpen={isCreateModalOpen}
        onOpenChange={() => setIsCreateModalOpen(!isCreateModalOpen)}
        name={name}
        setName={setName}
        description={description}
        setDescription={setDescription}
        onCreateNewsType={handleCreateNewsTypeSubmit}
        isLoading={newsType.loading}
      />

      <EditNewsTypeModal
        isOpen={isEditModalOpen}
        onOpenChange={() => setIsEditModalOpen(!isEditModalOpen)}
        newsType={selectedNewsType}
        name={name}
        setName={setName}
        description={description}
        setDescription={setDescription}
        onSave={handleEditNewsTypeSubmit}
        isLoading={newsType.loading}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onOpenChange={() => setIsDeleteModalOpen(!isDeleteModalOpen)}
        title="Удалить тип новости"
        itemName={deletingNewsType?.name || ''}
        itemDetails={deletingNewsType ? `ID: ${deletingNewsType.id} | Создан: ${new Date(deletingNewsType.createdAt).toLocaleDateString('ru-RU')}` : ''}
        warningMessage="Если этот тип используется в новостях, удаление будет невозможно."
        onConfirmDelete={handleConfirmDelete}
        isLoading={newsType.loading}
      />
    </div>
  );
});

export default NewsTypesPage;
