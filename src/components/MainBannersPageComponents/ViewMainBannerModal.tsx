import { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Chip,
  Alert
} from '@heroui/react';
import type { MainBanner } from '@/http/mainBannerAPI';

interface ViewMainBannerModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  mainBanner: MainBanner;
  onDeleteMedia: (mainBannerId: number, mediaId: number) => void;
}

const ViewMainBannerModal = ({ isOpen, onOpenChange, mainBanner, onDeleteMedia }: ViewMainBannerModalProps) => {
  const [deletingMediaId, setDeletingMediaId] = useState<number | null>(null);

  const handleDeleteMedia = async (mediaId: number) => {
    if (confirm('Вы уверены, что хотите удалить это изображение?')) {
      setDeletingMediaId(mediaId);
      try {
        await onDeleteMedia(mainBanner.id, mediaId);
      } catch (error) {
        console.error('Error deleting media:', error);
      } finally {
        setDeletingMediaId(null);
      }
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'success' : 'default';
  };

  const getStatusText = (isActive: boolean) => {
    return isActive ? 'Активен' : 'Неактивен';
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">
                    {mainBanner.title || 'Без названия'}
                  </h2>
                  <p className="text-sm text-gray-500">ID: {mainBanner.id}</p>
                </div>
                <Chip 
                  color={getStatusColor(mainBanner.isActive)}
                  variant="flat"
                  size="sm"
                >
                  {getStatusText(mainBanner.isActive)}
                </Chip>
              </div>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Информация о баннере</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Дата создания:</span>
                      <p>{new Date(mainBanner.createdAt).toLocaleString('ru-RU')}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Последнее обновление:</span>
                      <p>{new Date(mainBanner.updatedAt).toLocaleString('ru-RU')}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Изображения ({mainBanner.mediaFiles?.length || 0})
                  </h3>
                  {mainBanner.mediaFiles && mainBanner.mediaFiles.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {mainBanner.mediaFiles.map((media) => (
                        <div key={media.id} className="relative group">
                          <img
                            src={media.url}
                            alt={media.originalName}
                            className="w-full h-32 object-cover rounded"
                          />
                          <Button
                            isIconOnly
                            size="sm"
                            color="danger"
                            variant="solid"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onPress={() => handleDeleteMedia(media.id)}
                            isLoading={deletingMediaId === media.id}
                          >
                            Х
                          </Button>
                          {/* <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-xs">
                           
                            <p className="text-xs opacity-75">
                              {(media.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div> */}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Alert color="warning" title="Нет изображений">
                      У этого баннера нет изображений
                    </Alert>
                  )}
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Закрыть
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ViewMainBannerModal;
