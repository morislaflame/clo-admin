import { useState, useContext } from 'react';
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

interface CreateMainBannerModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onSuccess: () => void;
}

const CreateMainBannerModal = observer(({ isOpen, onOpenChange, onSuccess }: CreateMainBannerModalProps) => {
  const { mainBanner } = useContext(Context) as IStoreContext;
  const [title, setTitle] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const handleFileRemove = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (selectedFiles.length === 0) {
      alert('Пожалуйста, выберите хотя бы одно изображение');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('isActive', isActive.toString());
      
      selectedFiles.forEach((file) => {
        formData.append('media', file);
      });

      await mainBanner.createMainBanner(formData);
      onSuccess();
      handleClose();
    } catch (error) {
      console.error('Error creating main banner:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setIsActive(true);
    setSelectedFiles([]);
    onOpenChange();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={handleClose} size="2xl">
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Создать новый баннер
            </ModalHeader>
            <ModalBody>
              {mainBanner.error && (
                <Alert color="danger" title="Ошибка">
                  {mainBanner.error}
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Изображения
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center cursor-pointer"
                  >
                    <span className="text-sm text-gray-600">
                      Нажмите для выбора изображений или перетащите файлы сюда
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      Поддерживаются форматы: JPG, PNG, GIF (макс. 10MB)
                    </span>
                  </label>
                </div>

                {selectedFiles.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Выбранные файлы ({selectedFiles.length}):
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="w-full h-30 object-cover rounded"
                          />
                          <Button
                            isIconOnly
                            size="sm"
                            color="danger"
                            variant="solid"
                            className="absolute top-1 right-1"
                            onPress={() => handleFileRemove(index)}
                          >
                            Удалить
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
                isDisabled={selectedFiles.length === 0}
              >
                Создать баннер
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
});

export default CreateMainBannerModal;
