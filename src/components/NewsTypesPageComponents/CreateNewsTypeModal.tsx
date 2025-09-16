import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Textarea,
  Button
} from '@heroui/react';

interface CreateNewsTypeModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  name: string;
  setName: (name: string) => void;
  description: string;
  setDescription: (description: string) => void;
  onCreateNewsType: () => void;
  isLoading?: boolean;
}

const CreateNewsTypeModal: React.FC<CreateNewsTypeModalProps> = ({
  isOpen,
  onOpenChange,
  name,
  setName,
  description,
  setDescription,
  onCreateNewsType,
  isLoading = false
}) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Создать новый тип новости
            </ModalHeader>
            <ModalBody>
              <Input
                label="Название типа"
                placeholder="Введите название типа новости"
                value={name}
                onChange={(e) => setName(e.target.value)}
                variant="bordered"
                isDisabled={isLoading}
                isRequired
              />
              <Textarea
                label="Описание (опционально)"
                placeholder="Введите описание типа новости"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                variant="bordered"
                isDisabled={isLoading}
                minRows={3}
              />
            </ModalBody>
            <ModalFooter>
              <Button 
                color="danger" 
                variant="light" 
                onPress={onClose}
                isDisabled={isLoading}
              >
                Отмена
              </Button>
              <Button 
                color="primary" 
                onPress={onCreateNewsType}
                isDisabled={!name.trim() || isLoading}
                isLoading={isLoading}
              >
                Создать
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CreateNewsTypeModal;
