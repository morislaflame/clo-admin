import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button
} from '@heroui/react';

interface CreateClothingTypeModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  newTypeName: string;
  setNewTypeName: (name: string) => void;
  onCreateType: () => void;
}

const CreateClothingTypeModal: React.FC<CreateClothingTypeModalProps> = ({
  isOpen,
  onOpenChange,
  newTypeName,
  setNewTypeName,
  onCreateType
}) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Создать новый тип одежды
            </ModalHeader>
            <ModalBody>
              <Input
                label="Название типа"
                placeholder="Введите название типа одежды"
                value={newTypeName}
                onChange={(e) => setNewTypeName(e.target.value)}
                variant="bordered"
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Отмена
              </Button>
              <Button 
                color="primary" 
                onPress={onCreateType}
                isDisabled={!newTypeName.trim()}
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

export default CreateClothingTypeModal;
