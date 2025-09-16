import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Alert
} from '@heroui/react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  title: string;
  itemName: string;
  itemDetails?: string;
  warningMessage?: string;
  onConfirmDelete: () => void;
  isLoading?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onOpenChange,
  title,
  itemName,
  itemDetails,
  warningMessage,
  onConfirmDelete,
  isLoading = false,
  confirmButtonText = "Удалить",
  cancelButtonText = "Отмена"
}) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {title}
            </ModalHeader>
            <ModalBody>
              {warningMessage && (
                <Alert color="warning" variant="flat">
                  {warningMessage}
                </Alert>
              )}
              
              <div className="space-y-2">
                <p>Вы уверены, что хотите удалить:</p>
                <div className="p-3 bg-default-100 rounded-lg">
                  <div className="font-semibold text-lg">{itemName}</div>
                  {itemDetails && (
                    <div className="text-sm text-default-500">
                      {itemDetails}
                    </div>
                  )}
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button 
                color="default" 
                variant="light" 
                onPress={onClose}
                isDisabled={isLoading}
              >
                {cancelButtonText}
              </Button>
              <Button 
                color="danger" 
                onPress={onConfirmDelete}
                isLoading={isLoading}
              >
                {confirmButtonText}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default DeleteConfirmModal;
