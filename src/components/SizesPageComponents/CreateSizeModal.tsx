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

interface CreateSizeModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  newSizeName: string;
  setNewSizeName: (name: string) => void;
  onCreateSize: () => void;
}

const CreateSizeModal: React.FC<CreateSizeModalProps> = ({
  isOpen,
  onOpenChange,
  newSizeName,
  setNewSizeName,
  onCreateSize
}) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Создать новый размер
            </ModalHeader>
            <ModalBody>
              <Input
                label="Название размера"
                placeholder="Введите название размера (например: XS, S, M, L, XL)"
                value={newSizeName}
                onChange={(e) => setNewSizeName(e.target.value)}
                variant="bordered"
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Отмена
              </Button>
              <Button 
                color="primary" 
                onPress={onCreateSize}
                isDisabled={!newSizeName.trim()}
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

export default CreateSizeModal;
