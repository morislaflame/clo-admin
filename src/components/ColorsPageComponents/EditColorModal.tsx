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

interface Color {
  id: number;
  name: string;
  hexCode?: string;
  createdAt: string;
}

interface EditColorModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  color: Color | null;
  editedName: string;
  setEditedName: (name: string) => void;
  editedHex: string;
  setEditedHex: (hex: string) => void;
  onSave: () => void;
  isLoading?: boolean;
}

const EditColorModal: React.FC<EditColorModalProps> = ({
  isOpen,
  onOpenChange,
  color,
  editedName,
  setEditedName,
  editedHex,
  setEditedHex,
  onSave,
  isLoading = false
}) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Редактировать цвет
            </ModalHeader>
            <ModalBody>
              <Input
                label="Название цвета"
                placeholder="Введите название цвета"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                variant="bordered"
                isDisabled={isLoading}
              />
              <Input
                label="Hex код (опционально)"
                placeholder="#FF5733"
                value={editedHex}
                onChange={(e) => setEditedHex(e.target.value)}
                variant="bordered"
                isDisabled={isLoading}
              />
              {editedHex && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-default-500">Предпросмотр:</span>
                  <div 
                    className="w-8 h-8 rounded-full border border-default-300"
                    style={{ backgroundColor: editedHex }}
                  />
                </div>
              )}
              {color && (
                <div className="text-sm text-default-500">
                  ID: {color.id} | Создан: {new Date(color.createdAt).toLocaleDateString('ru-RU')}
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

export default EditColorModal;
