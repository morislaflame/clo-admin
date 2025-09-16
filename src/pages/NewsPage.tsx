import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Spinner, Alert } from '@heroui/react';
import { Context, type IStoreContext } from '@/store/StoreProvider';
import {
  NewsHeader,
  NewsTable,
  CreateNewsModal,
  EditNewsModal,
  ViewNewsModal
} from '@/components/NewsPageComponents';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';
import type { News } from '@/types/types';

const NewsPage = observer(() => {
  const { user, news, newsType, tag } = useContext(Context) as IStoreContext;
  
  // Состояния для модалок
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  
  // Состояния для выбранной новости
  const [selectedNews, setSelectedNews] = React.useState<News | null>(null);
  const [deletingNews, setDeletingNews] = React.useState<News | null>(null);
  
  // Состояния для формы создания/редактирования
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [content, setContent] = React.useState('');
  const [status, setStatus] = React.useState('DRAFT');
  const [selectedNewsType, setSelectedNewsType] = React.useState('');
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);

  useEffect(() => {
    if (user.isAuth) {
      news.fetchNews();
      newsType.fetchNewsTypes();
      tag.fetchTags();
    }
  }, [user.isAuth, news, newsType, tag]);

  // Обработчики действий
  const handleCreateNews = () => {
    setIsCreateModalOpen(true);
  };

  const handleEditNews = (newsItem: News) => {
    setSelectedNews(newsItem);
    setTitle(newsItem.title);
    setDescription(newsItem.description || '');
    setContent(newsItem.content);
    setStatus(newsItem.status);
    setSelectedNewsType(newsItem.newsTypeId?.toString() || '');
    setSelectedTags(newsItem.tags?.map(tag => tag.id.toString()) || []);
    setIsEditModalOpen(true);
  };

  const handleViewNews = (newsItem: News) => {
    setSelectedNews(newsItem);
    setIsViewModalOpen(true);
  };

  const handleDeleteNews = (newsItem: News) => {
    setDeletingNews(newsItem);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingNews) return;
    
    try {
      await news.deleteNews(deletingNews.id);
      setIsDeleteModalOpen(false);
      setDeletingNews(null);
    } catch (error) {
      console.error('Error deleting news:', error);
    }
  };

  const handleCreateNewsSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('content', content);
      formData.append('status', status);
      formData.append('newsTypeId', selectedNewsType);
      formData.append('tagIds', JSON.stringify(selectedTags.map(id => parseInt(id))));

      await news.createNews(formData);
      
      // Сброс формы
      setTitle('');
      setDescription('');
      setContent('');
      setStatus('DRAFT');
      setSelectedNewsType('');
      setSelectedTags([]);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Error creating news:', error);
    }
  };

  const handleEditNewsSubmit = async () => {
    if (!selectedNews) return;
    
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('content', content);
      formData.append('status', status);
      formData.append('newsTypeId', selectedNewsType);
      formData.append('tagIds', JSON.stringify(selectedTags.map(id => parseInt(id))));

      await news.updateNews(selectedNews.id, formData);
      
      // Сброс формы
      setTitle('');
      setDescription('');
      setContent('');
      setStatus('DRAFT');
      setSelectedNewsType('');
      setSelectedTags([]);
      setSelectedNews(null);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating news:', error);
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
      <NewsHeader
        onCreateNews={handleCreateNews}
        isLoading={news.loading}
      />

      {news.loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      ) : news.isServerError ? (
        <Alert color="danger" variant="flat">
          {news.error || 'Ошибка загрузки новостей'}
        </Alert>
      ) : (
        <NewsTable
          news={news.news}
          onEdit={handleEditNews}
          onView={handleViewNews}
          onDelete={handleDeleteNews}
        />
      )}

      <CreateNewsModal
        isOpen={isCreateModalOpen}
        onOpenChange={() => setIsCreateModalOpen(!isCreateModalOpen)}
        newsTypes={newsType.newsTypes}
        tags={tag.tags}
        selectedNewsType={selectedNewsType}
        setSelectedNewsType={setSelectedNewsType}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        content={content}
        setContent={setContent}
        status={status}
        setStatus={setStatus}
        onCreateNews={handleCreateNewsSubmit}
        isLoading={news.loading}
      />

      <EditNewsModal
        isOpen={isEditModalOpen}
        onOpenChange={() => setIsEditModalOpen(!isEditModalOpen)}
        news={selectedNews}
        newsTypes={newsType.newsTypes}
        tags={tag.tags}
        selectedNewsType={selectedNewsType}
        setSelectedNewsType={setSelectedNewsType}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        content={content}
        setContent={setContent}
        status={status}
        setStatus={setStatus}
        onSave={handleEditNewsSubmit}
        isLoading={news.loading}
      />

      <ViewNewsModal
        isOpen={isViewModalOpen}
        onOpenChange={() => setIsViewModalOpen(!isViewModalOpen)}
        news={selectedNews}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onOpenChange={() => setIsDeleteModalOpen(!isDeleteModalOpen)}
        title="Удалить новость"
        itemName={deletingNews?.title || ''}
        itemDetails={deletingNews ? `ID: ${deletingNews.id} | Создан: ${new Date(deletingNews.createdAt).toLocaleDateString('ru-RU')}` : ''}
        warningMessage="Новость будет полностью удалена из системы вместе со всеми медиафайлами."
        onConfirmDelete={handleConfirmDelete}
        isLoading={news.loading}
      />
    </div>
  );
});

export default NewsPage;
