import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Textarea } from '@heroui/react';
import { useState, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { Context, type IStoreContext } from '@/store/StoreProvider';

interface CreateCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateCollectionModal = observer(({ isOpen, onClose, onSuccess }: CreateCollectionModalProps) => {
  const { collection } = useContext(Context) as IStoreContext;
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [files, setFiles] = useState<FileList | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      
      if (files) {
        Array.from(files).forEach((file) => {
          formDataToSend.append('media', file);
        });
      }

      await collection.createCollection(formDataToSend);
      onSuccess();
      handleClose();
    } catch (error) {
      console.error('Error creating collection:', error);
    }
  };

  const handleClose = () => {
    setFormData({ name: '', description: '' });
    setFiles(null);
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={handleClose} size="2xl">
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader className="flex flex-col gap-1">Создать коллекцию</ModalHeader>
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
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Медиафайлы
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
              isLoading={collection.loading}
              isDisabled={!formData.name.trim()}
            >
              Создать
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
});

export default CreateCollectionModal;
