import { useState, useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Switch,
  Alert
} from '@heroui/react';
import { Context, type IStoreContext } from '@/store/StoreProvider';
import type { MainBanner } from '@/http/mainBannerAPI';

interface EditMainBannerModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  mainBanner: MainBanner;
  onSuccess: () => void;
}

const EditMainBannerModal = observer(({ isOpen, onOpenChange, mainBanner, onSuccess }: EditMainBannerModalProps) => {
  const { mainBanner: mainBannerStore } = useContext(Context) as IStoreContext;
  const [title, setTitle] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [deletedMediaIds, setDeletedMediaIds] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (mainBanner) {
      setTitle(mainBanner.title || '');
      setIsActive(mainBanner.isActive);
      setSelectedFiles([]);
      setDeletedMediaIds([]);
    }
  }, [mainBanner]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const handleFileRemove = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleMediaDelete = (mediaId: number) => {
    setDeletedMediaIds(prev => [...prev, mediaId]);
  };

  const handleMediaRestore = (mediaId: number) => {
    setDeletedMediaIds(prev => prev.filter(id => id !== mediaId));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('isActive', isActive.toString());
      
      if (deletedMediaIds.length > 0) {
        formData.append('deletedMediaIds', JSON.stringify(deletedMediaIds));
      }
      
      selectedFiles.forEach((file) => {
        formData.append('media', file);
      });

      await mainBannerStore.updateMainBanner(mainBanner.id, formData);
      onSuccess();
      handleClose();
    } catch (error) {
      console.error('Error updating main banner:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setIsActive(true);
    setSelectedFiles([]);
    setDeletedMediaIds([]);
    onOpenChange();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={handleClose} size="2xl">
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Редактировать баннер
            </ModalHeader>
            <ModalBody>
              {mainBannerStore.error && (
                <Alert color="danger" title="Ошибка">
                  {mainBannerStore.error}
                </Alert>
              )}

              <Input
                label="Название баннера"
                placeholder="Введите название баннера"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <Switch
                isSelected={isActive}
                onValueChange={setIsActive}
              >
                Активный баннер
              </Switch>

              {/* Существующие изображения */}
              {mainBanner.mediaFiles && mainBanner.mediaFiles.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Текущие изображения
                    {deletedMediaIds.length > 0 && (
                      <span className="text-red-500 text-sm ml-2">
                        (удалено: {deletedMediaIds.length})
                      </span>
                    )}
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {mainBanner.mediaFiles
                      .filter((media) => !deletedMediaIds.includes(media.id))
                      .map((media) => (
                      <div key={media.id} className="relative">
                        <img
                          src={media.url}
                          alt={media.originalName}
                          className="w-full h-20 object-cover rounded"
                        />
                        <Button
                          isIconOnly
                          size="sm"
                          color="danger"
                          variant="solid"
                          className="absolute top-1 right-1"
                          onPress={() => handleMediaDelete(media.id)}
                        >
                          Х
                        </Button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-1 text-xs truncate">
                          {media.originalName}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Удаленные изображения */}
              {deletedMediaIds.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Удаленные изображения
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {mainBanner.mediaFiles
                      .filter((media) => deletedMediaIds.includes(media.id))
                      .map((media) => (
                      <div key={media.id} className="relative opacity-50">
                        <img
                          src={media.url}
                          alt={media.originalName}
                          className="w-full h-20 object-cover rounded"
                        />
                        <Button
                          isIconOnly
                          size="sm"
                          color="success"
                          variant="solid"
                          className="absolute top-1 right-1"
                          onPress={() => handleMediaRestore(media.id)}
                        >
                          Восстановить
                        </Button>
                        <div className="absolute bottom-0 left-0 right-0 bg-red-500 bg-opacity-50 text-white p-1 text-xs truncate">
                          {media.originalName}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Добавление новых изображений */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Добавить новые изображения
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload-edit"
                  />
                  <label
                    htmlFor="file-upload-edit"
                    className="flex flex-col items-center justify-center cursor-pointer"
                  >
                    <span className="text-sm text-gray-600">
                      Нажмите для выбора новых изображений
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      Поддерживаются форматы: JPG, PNG, GIF (макс. 10MB)
                    </span>
                  </label>
                </div>

                {selectedFiles.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Новые файлы ({selectedFiles.length}):
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="w-full h-20 object-cover rounded"
                          />
                          <Button
                            isIconOnly
                            size="sm"
                            color="danger"
                            variant="solid"
                            className="absolute top-1 right-1"
                            onPress={() => handleFileRemove(index)}
                          >
                            Х
                          </Button>
                          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-1 text-xs truncate">
                            {file.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={handleClose}>
                Отмена
              </Button>
              <Button
                color="primary"
                onPress={handleSubmit}
                isLoading={isSubmitting}
              >
                Сохранить изменения
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
});

export default EditMainBannerModal;
