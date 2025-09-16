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

interface ClothingType {
  id: number;
  name: string;
  createdAt: string;
}

interface EditClothingTypeModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  clothingType: ClothingType | null;
  editedName: string;
  setEditedName: (name: string) => void;
  onSave: () => void;
  isLoading?: boolean;
}

const EditClothingTypeModal: React.FC<EditClothingTypeModalProps> = ({
  isOpen,
  onOpenChange,
  clothingType,
  editedName,
  setEditedName,
  onSave,
  isLoading = false
}) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Редактировать тип одежды
            </ModalHeader>
            <ModalBody>
              <Input
                label="Название типа"
                placeholder="Введите название типа одежды"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                variant="bordered"
                isDisabled={isLoading}
              />
              {clothingType && (
                <div className="text-sm text-default-500">
                  ID: {clothingType.id} | Создан: {new Date(clothingType.createdAt).toLocaleDateString('ru-RU')}
                </div>
              )}
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
                onPress={onSave}
                isDisabled={!editedName.trim() || isLoading}
                isLoading={isLoading}
              >
                Сохранить
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default EditClothingTypeModal;
