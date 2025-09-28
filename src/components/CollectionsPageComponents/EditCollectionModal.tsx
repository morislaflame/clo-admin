import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Textarea, Chip } from '@heroui/react';
import { useState, useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Context, type IStoreContext } from '@/store/StoreProvider';
import type { Collection } from '@/types/types';

interface EditCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  collection: Collection | null;
  onSuccess: () => void;
}

const EditCollectionModal = observer(({ isOpen, onClose, collection, onSuccess }: EditCollectionModalProps) => {
  const { collection: collectionStore } = useContext(Context) as IStoreContext;
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [files, setFiles] = useState<FileList | null>(null);
  const [deletedMediaIds, setDeletedMediaIds] = useState<number[]>([]);

  useEffect(() => {
    if (collection) {
      setFormData({
        name: collection.name || '',
        description: collection.description || '',
      });
    }
  }, [collection]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !collection) {
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      
      if (deletedMediaIds.length > 0) {
        formDataToSend.append('deletedMediaIds', JSON.stringify(deletedMediaIds));
      }
      
      if (files) {
        Array.from(files).forEach((file) => {
          formDataToSend.append('media', file);
        });
      }

      await collectionStore.updateCollection(collection.id, formDataToSend);
      onSuccess();
      handleClose();
    } catch (error) {
      console.error('Error updating collection:', error);
    }
  };

  const handleClose = () => {
    setFormData({ name: '', description: '' });
    setFiles(null);
    setDeletedMediaIds([]);
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  const handleDeleteMedia = (mediaId: number) => {
    setDeletedMediaIds(prev => [...prev, mediaId]);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={handleClose} size="2xl">
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader className="flex flex-col gap-1">Редактировать коллекцию</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Название коллекции"
                placeholder="Введите название коллекции"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                isRequired
                variant="bordered"
              />
              
              <Textarea
                label="Описание"
                placeholder="Введите описание коллекции"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                variant="bordered"
                minRows={3}
              />
              
              {collection?.mediaFiles && collection.mediaFiles.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Текущие медиафайлы
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {collection.mediaFiles
                      .filter(media => !deletedMediaIds.includes(media.id))
                      .map((media) => (
                        <Chip
                          key={media.id}
                          onClose={() => handleDeleteMedia(media.id)}
                          variant="flat"
                          color="secondary"
                        >
                          {media.originalName}
                        </Chip>
                      ))}
                  </div>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Добавить медиафайлы
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-600"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Выберите изображения или видео для коллекции
                </p>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={handleClose}>
              Отмена
            </Button>
            <Button 
              color="primary" 
              type="submit"
              isLoading={collectionStore.loading}
              isDisabled={!formData.name.trim()}
            >
              Сохранить
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
});

export default EditCollectionModal;
