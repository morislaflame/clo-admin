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

interface CreateColorModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  newColorName: string;
  setNewColorName: (name: string) => void;
  newColorHex: string;
  setNewColorHex: (hex: string) => void;
  onCreateColor: () => void;
}

const CreateColorModal: React.FC<CreateColorModalProps> = ({
  isOpen,
  onOpenChange,
  newColorName,
  setNewColorName,
  newColorHex,
  setNewColorHex,
  onCreateColor
}) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Создать новый цвет
            </ModalHeader>
            <ModalBody>
              <Input
                label="Название цвета"
                placeholder="Введите название цвета"
                value={newColorName}
                onChange={(e) => setNewColorName(e.target.value)}
                variant="bordered"
              />
              <Input
                label="Hex код (опционально)"
                placeholder="#FF5733"
                value={newColorHex}
                onChange={(e) => setNewColorHex(e.target.value)}
                variant="bordered"
              />
              {newColorHex && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-default-500">Предпросмотр:</span>
                  <div 
                    className="w-8 h-8 rounded-full border border-default-300"
                    style={{ backgroundColor: newColorHex }}
                  />
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Отмена
              </Button>
              <Button 
                color="primary" 
                onPress={onCreateColor}
                isDisabled={!newColorName.trim()}
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

export default CreateColorModal;
