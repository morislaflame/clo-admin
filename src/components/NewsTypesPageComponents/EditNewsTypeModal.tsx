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
import type { NewsType } from '@/types/types';

interface EditNewsTypeModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  newsType: NewsType | null;
  name: string;
  setName: (name: string) => void;
  description: string;
  setDescription: (description: string) => void;
  onSave: () => void;
  isLoading?: boolean;
}

const EditNewsTypeModal: React.FC<EditNewsTypeModalProps> = ({
  isOpen,
  onOpenChange,
  newsType,
  name,
  setName,
  description,
  setDescription,
  onSave,
  isLoading = false
}) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Редактировать тип новости
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
              {newsType && (
                <div className="text-sm text-default-500">
                  ID: {newsType.id} | Создан: {new Date(newsType.createdAt).toLocaleDateString('ru-RU')}
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
                isDisabled={!name.trim() || isLoading}
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

export default EditNewsTypeModal;
