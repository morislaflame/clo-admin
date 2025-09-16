import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Card,
  CardBody,
  Chip,
  Divider,
} from '@heroui/react';
import MediaCarousel from './MediaCarousel';
import type { Product } from '@/types/types';

interface ViewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

const ViewProductModal: React.FC<ViewProductModalProps> = ({ isOpen, onClose, product }) => {
  if (!product) {
    return null;
  }

  // Получаем доступные размеры и цвета
  const availableSizes = product.sizes?.map(size => size.name).join(', ') || '';
  const availableColors = product.colors?.map(color => color.name).join(', ') || '';

  // Определяем статус товара
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'success';
      case 'SOLD': return 'danger';
      case 'DELETED': return 'default';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'В наличии';
      case 'SOLD': return 'Продано';
      case 'DELETED': return 'Удалено';
      default: return status;
    }
  };

  const getGenderLabel = (gender: string) => {
    switch (gender) {
      case 'MAN': return 'Мужское';
      case 'WOMAN': return 'Женское';
      default: return gender;
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="5xl"
      scrollBehavior="inside"
      backdrop="blur"
      placement="center"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold">Просмотр продукта</h2>
          <p className="text-sm text-default-500">ID: {product.id}</p>
        </ModalHeader>
        
        <ModalBody>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Левая часть - карусель с медиа */}
            <div className="order-1 lg:order-1">
              {product.mediaFiles && product.mediaFiles.length > 0 ? (
                <MediaCarousel 
                  mediaFiles={product.mediaFiles} 
                  productName={product.name}
                />
              ) : (
                <Card className="w-full h-96">
                  <CardBody className="flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <p>Нет изображений</p>
                    </div>
                  </CardBody>
                </Card>
              )}
            </div>

            {/* Правая часть - информация о товаре */}
            <div className="order-2 lg:order-2">
              <Card className="w-full h-fit">
                <CardBody className="p-4 space-y-4">
                  {/* Заголовок и статус */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <h1 className="text-2xl font-bold text-foreground">
                        {product.name}
                      </h1>
                      <Chip 
                        color={getStatusColor(product.status)}
                        size="sm"
                        variant="flat"
                      >
                        {getStatusLabel(product.status)}
                      </Chip>
                    </div>
                    
                    <Chip 
                      color="default" 
                      size="sm" 
                      variant="bordered"
                    >
                      {getGenderLabel(product.gender)}
                    </Chip>
                  </div>

                  <Divider />

                  {/* Цена */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="text-xl font-bold">
                        {product.priceKZT.toLocaleString()} ₸
                      </div>
                      <span className="text-small text-default-400 font-bold"> | </span>
                      <div className="text-lg text-default-400">
                        ${product.priceUSD}
                      </div>
                    </div>
                  </div>

                  <Divider />

                  {/* Характеристики */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Характеристики</h3>
                    
                    {product.clothingType && (
                      <div className="flex justify-between">
                        <span className="text-default-500">Тип одежды:</span>
                        <span className="font-medium">{product.clothingType.name}</span>
                      </div>
                    )}
                    
                    {product.collection && (
                      <div className="flex justify-between">
                        <span className="text-default-500">Коллекция:</span>
                        <span className="font-medium">{product.collection.name}</span>
                      </div>
                    )}
                    
                    {availableSizes && (
                      <div className="flex justify-between">
                        <span className="text-default-500">Размеры:</span>
                        <span className="font-medium">{availableSizes}</span>
                      </div>
                    )}
                    
                    {availableColors && (
                      <div className="flex justify-between">
                        <span className="text-default-500">Цвета:</span>
                        <span className="font-medium">{availableColors}</span>
                      </div>
                    )}
                  </div>

                  {/* Описание */}
                  {product.description && (
                    <>
                      <Divider />
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold">Описание</h3>
                        <p className="text-default-600 leading-relaxed">
                          {product.description}
                        </p>
                      </div>
                    </>
                  )}

                  {/* Состав */}
                  {product.ingredients && (
                    <>
                      <Divider />
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold">Состав</h3>
                        <p className="text-default-600 leading-relaxed">
                          {product.ingredients}
                        </p>
                      </div>
                    </>
                  )}
                </CardBody>
              </Card>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ViewProductModal;
