import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Chip,
  Divider
} from '@heroui/react';
import type { News } from '@/types/types';

interface ViewNewsModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  news: News | null;
}

const ViewNewsModal: React.FC<ViewNewsModalProps> = ({
  isOpen,
  onOpenChange,
  news
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'success';
      case 'DRAFT':
        return 'warning';
      case 'ARCHIVED':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'Опубликовано';
      case 'DRAFT':
        return 'Черновик';
      case 'ARCHIVED':
        return 'Архив';
      default:
        return status;
    }
  };

  if (!news) return null;

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="4xl" scrollBehavior="inside">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Просмотр новости</h2>
                <Chip 
                  color={getStatusColor(news.status)} 
                  variant="flat" 
                  size="sm"
                >
                  {getStatusText(news.status)}
                </Chip>
              </div>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">{news.title}</h3>
                  {news.description && (
                    <p className="text-default-600 mb-3">{news.description}</p>
                  )}
                </div>

                <Divider />

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-default-700">ID:</span>
                    <span className="ml-2">{news.id}</span>
                  </div>
                  <div>
                    <span className="font-medium text-default-700">Тип:</span>
                    <span className="ml-2">{news.newsType?.name || 'Не указан'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-default-700">Автор:</span>
                    <span className="ml-2">{news.author?.email || 'Неизвестен'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-default-700">Создано:</span>
                    <span className="ml-2">{new Date(news.createdAt).toLocaleDateString('ru-RU')}</span>
                  </div>
                  {news.publishedAt && (
                    <div>
                      <span className="font-medium text-default-700">Опубликовано:</span>
                      <span className="ml-2">{new Date(news.publishedAt).toLocaleDateString('ru-RU')}</span>
                    </div>
                  )}
                </div>

                {news.tags && news.tags.length > 0 && (
                  <>
                    <Divider />
                    <div>
                      <span className="font-medium text-default-700 mb-2 block">Теги:</span>
                      <div className="flex flex-wrap gap-2">
                        {news.tags.map((tag) => (
                          <Chip
                            key={tag.id}
                            size="sm"
                            color={tag.color ? 'default' : 'primary'}
                            variant="flat"
                          >
                            {tag.name}
                          </Chip>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <Divider />

                <div>
                  <span className="font-medium text-default-700 mb-2 block">Содержание:</span>
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-wrap">{news.content}</p>
                  </div>
                </div>

                {news.mediaFiles && news.mediaFiles.length > 0 && (
                  <>
                    <Divider />
                    <div>
                      <span className="font-medium text-default-700 mb-2 block">Медиафайлы:</span>
                      <div className="grid grid-cols-2 gap-2">
                        {news.mediaFiles.map((media) => (
                          <div key={media.id} className="border rounded-lg p-2">
                            {media.mimeType.startsWith('image/') ? (
                              <img 
                                src={media.url} 
                                alt="Media" 
                                className="w-full h-32 object-cover rounded"
                              />
                            ) : (
                              <div className="w-full h-32 bg-default-100 rounded flex items-center justify-center">
                                <span className="text-default-500">Видео файл</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={onClose}>
                Закрыть
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ViewNewsModal;
