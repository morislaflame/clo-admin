import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Chip, Image } from '@heroui/react';
import type { Collection } from '@/types/types';

interface ViewCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  collection: Collection | null;
}

const ViewCollectionModal = ({ isOpen, onClose, collection }: ViewCollectionModalProps) => {
  if (!collection) return null;

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size="3xl">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          {collection.name}
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Информация о коллекции</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">ID</p>
                  <p className="font-medium">{collection.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Название</p>
                  <p className="font-medium">{collection.name}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Описание</p>
                  <p className="font-medium">{collection.description || '—'}</p>
                </div>
              </div>
            </div>

            {collection.products && collection.products.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Продукты в коллекции</h3>
                <div className="flex flex-wrap gap-2">
                  {collection.products.map((product) => (
                    <Chip key={product.id} variant="flat" color="primary">
                      {product.name}
                    </Chip>
                  ))}
                </div>
              </div>
            )}

            {collection.mediaFiles && collection.mediaFiles.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Медиафайлы</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {collection.mediaFiles.map((media) => (
                    <div key={media.id} className="border rounded-lg p-2">
                      {media.mimeType.startsWith('image/') ? (
                        <Image
                          src={media.url}
                          alt={media.originalName}
                          className="w-full h-24 object-cover rounded"
                        />
                      ) : (
                        <div className="w-full h-24 bg-gray-100 rounded flex items-center justify-center">
                          <span className="text-sm text-gray-500">Видео</span>
                        </div>
                      )}
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        {media.originalName}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onPress={onClose}>
            Закрыть
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ViewCollectionModal;
