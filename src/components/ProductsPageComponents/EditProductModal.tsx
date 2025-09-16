import React, { useState, useEffect, useContext } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
  Chip,
  Alert,
  Spinner,
} from '@heroui/react';
import FileUpload from './FileUpload';
import MediaPreview from './MediaPreview';
import { Context, type IStoreContext } from '@/store/StoreProvider';
import type { Product } from '@/types/types';

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSuccess?: () => void;
}

interface ProductFormData {
  name: string;
  priceKZT: string;
  priceUSD: string;
  description: string;
  color: string;
  ingredients: string;
  gender: 'MAN' | 'WOMAN';
  clothingTypeId: string;
  collectionId: string;
  sizeIds: number[];
  colorIds: number[];
  mediaFiles: File[];
}

const EditProductModal: React.FC<EditProductModalProps> = ({ isOpen, onClose, product, onSuccess }) => {
  const { product: productStore, clothingType, size, color } = useContext(Context) as IStoreContext;
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    priceKZT: '',
    priceUSD: '',
    description: '',
    color: '',
    ingredients: '',
    gender: 'MAN',
    clothingTypeId: '',
    collectionId: '',
    sizeIds: [],
    colorIds: [],
    mediaFiles: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Загружаем справочные данные при открытии модального окна
  useEffect(() => {
    if (isOpen) {
      clothingType.fetchClothingTypes();
      size.fetchSizes();
      color.fetchColors();
    }
  }, [isOpen, clothingType, size, color]);

  // Заполняем форму данными продукта при открытии
  useEffect(() => {
    if (product && isOpen) {
      setFormData({
        name: product.name || '',
        priceKZT: product.priceKZT?.toString() || '',
        priceUSD: product.priceUSD?.toString() || '',
        description: product.description || '',
        color: product.color || '',
        ingredients: product.ingredients || '',
        gender: product.gender || 'MAN',
        clothingTypeId: product.clothingTypeId?.toString() || '',
        collectionId: product.collectionId?.toString() || '',
        sizeIds: product.sizes?.map(size => size.id) || [],
        colorIds: product.colors?.map(color => color.id) || [],
        mediaFiles: []
      });
    }
  }, [product, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Название обязательно';
    }

    if (!formData.priceKZT || isNaN(Number(formData.priceKZT)) || Number(formData.priceKZT) <= 0) {
      newErrors.priceKZT = 'Цена в тенге должна быть положительным числом';
    }

    if (!formData.priceUSD || isNaN(Number(formData.priceUSD)) || Number(formData.priceUSD) <= 0) {
      newErrors.priceUSD = 'Цена в долларах должна быть положительным числом';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ProductFormData, value: string | number[] | File[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Очищаем ошибку для этого поля
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSizeToggle = (sizeId: number) => {
    setFormData(prev => ({
      ...prev,
      sizeIds: prev.sizeIds.includes(sizeId)
        ? prev.sizeIds.filter(id => id !== sizeId)
        : [...prev.sizeIds, sizeId]
    }));
  };

  const handleColorToggle = (colorId: number) => {
    setFormData(prev => ({
      ...prev,
      colorIds: prev.colorIds.includes(colorId)
        ? prev.colorIds.filter(id => id !== colorId)
        : [...prev.colorIds, colorId]
    }));
  };

  const handleFileChange = (files: File[]) => {
    setFormData(prev => ({
      ...prev,
      mediaFiles: files
    }));
  };

  const handleSubmit = async () => {
    if (!product || !validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const formDataToSend = new FormData();
      
      // Добавляем основные поля
      formDataToSend.append('name', formData.name);
      formDataToSend.append('priceKZT', formData.priceKZT);
      formDataToSend.append('priceUSD', formData.priceUSD);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('color', formData.color);
      formDataToSend.append('ingredients', formData.ingredients);
      formDataToSend.append('gender', formData.gender);
      
      if (formData.clothingTypeId) {
        formDataToSend.append('clothingTypeId', formData.clothingTypeId);
      }
      
      if (formData.collectionId) {
        formDataToSend.append('collectionId', formData.collectionId);
      }

      // Добавляем размеры и цвета (всегда отправляем, даже пустые массивы)
      formDataToSend.append('sizeIds', JSON.stringify(formData.sizeIds));
      formDataToSend.append('colorIds', JSON.stringify(formData.colorIds));

      // Добавляем новые медиафайлы
      formData.mediaFiles.forEach(file => {
        formDataToSend.append('media', file);
      });

      // Логируем отправляемые данные для отладки
      console.log('Sending update data:', {
        productId: product.id,
        sizeIds: formData.sizeIds,
        colorIds: formData.colorIds,
        sizeIdsString: JSON.stringify(formData.sizeIds),
        colorIdsString: JSON.stringify(formData.colorIds)
      });

      await productStore.updateProduct(product.id, formDataToSend);
      
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Ошибка обновления продукта:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        name: '',
        priceKZT: '',
        priceUSD: '',
        description: '',
        color: '',
        ingredients: '',
        gender: 'MAN',
        clothingTypeId: '',
        collectionId: '',
        sizeIds: [],
        colorIds: [],
        mediaFiles: []
      });
      setErrors({});
      onClose();
    }
  };

  const handleDeleteMedia = async (mediaId: number) => {
    if (!product) return;
    
    try {
      await productStore.deleteProductMedia(product.id, mediaId);
      onSuccess?.(); // Обновляем данные
    } catch (error) {
      console.error('Ошибка удаления медиафайла:', error);
    }
  };

  if (!product) {
    return null;
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose}
      size="5xl"
      scrollBehavior="inside"
      isDismissable={!isSubmitting}
      hideCloseButton={isSubmitting}
      backdrop="blur"
      placement="bottom"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold">Редактировать продукт</h2>
          <p className="text-sm text-default-500">ID: {product.id}</p>
        </ModalHeader>
        
        <ModalBody>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Основная информация */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-lg font-medium">Основная информация</h3>
              
              <Input
                label="Название продукта"
                placeholder="Введите название"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                isInvalid={!!errors.name}
                errorMessage={errors.name}
                isRequired
              />

              <div className="grid grid-cols-2 gap-2">
                <Input
                  label="Цена (₸)"
                  placeholder="0"
                  type="number"
                  value={formData.priceKZT}
                  onChange={(e) => handleInputChange('priceKZT', e.target.value)}
                  isInvalid={!!errors.priceKZT}
                  errorMessage={errors.priceKZT}
                  isRequired
                />
                <Input
                  label="Цена ($)"
                  placeholder="0"
                  type="number"
                  value={formData.priceUSD}
                  onChange={(e) => handleInputChange('priceUSD', e.target.value)}
                  isInvalid={!!errors.priceUSD}
                  errorMessage={errors.priceUSD}
                  isRequired
                />
              </div>

              <Select
                label="Пол"
                placeholder="Выберите пол"
                selectedKeys={[formData.gender]}
                onChange={(e) => handleInputChange('gender', e.target.value as 'MAN' | 'WOMAN')}
                isRequired
              >
                <SelectItem key="MAN">Мужской</SelectItem>
                <SelectItem key="WOMAN">Женский</SelectItem>
              </Select>

              <Select
                label="Тип одежды"
                placeholder="Выберите тип одежды"
                selectedKeys={formData.clothingTypeId ? [formData.clothingTypeId] : []}
                onChange={(e) => handleInputChange('clothingTypeId', e.target.value)}
              >
                {clothingType.clothingTypes.map((type) => (
                  <SelectItem key={type.id.toString()}>
                    {type.name}
                  </SelectItem>
                ))}
              </Select>

              <Textarea
                label="Описание"
                placeholder="Введите описание продукта"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                minRows={3}
              />

              <Input
                label="Состав"
                placeholder="Материалы и состав"
                value={formData.ingredients}
                onChange={(e) => handleInputChange('ingredients', e.target.value)}
              />

              {/* Размеры */}
              <div>
                <label className="text-sm font-medium mb-2 block">Размеры</label>
                <div className="flex flex-wrap gap-2">
                  {size.sizes.map((sizeItem) => (
                    <Chip
                      key={sizeItem.id}
                      variant={formData.sizeIds.includes(sizeItem.id) ? "solid" : "flat"}
                      color={formData.sizeIds.includes(sizeItem.id) ? "primary" : "default"}
                      className="cursor-pointer"
                      onClick={() => handleSizeToggle(sizeItem.id)}
                    >
                      {sizeItem.name}
                    </Chip>
                  ))}
                </div>
              </div>

              {/* Цвета */}
              <div>
                <label className="text-sm font-medium mb-2 block">Цвета</label>
                <div className="flex flex-wrap gap-2">
                  {color.colors.map((colorItem) => (
                    <Chip
                      key={colorItem.id}
                      variant={formData.colorIds.includes(colorItem.id) ? "solid" : "flat"}
                      color={formData.colorIds.includes(colorItem.id) ? "primary" : "default"}
                      className="cursor-pointer"
                      onClick={() => handleColorToggle(colorItem.id)}
                    >
                      <div className="flex items-center gap-1">
                        {colorItem.hexCode && (
                          <div 
                            className="w-3 h-3 rounded-full border border-white"
                            style={{ backgroundColor: colorItem.hexCode }}
                          />
                        )}
                        {colorItem.name}
                      </div>
                    </Chip>
                  ))}
                </div>
              </div>

              {/* Новые медиафайлы */}
              <div>
                <label className="text-sm font-medium mb-2 block">Добавить новые медиафайлы</label>
                <FileUpload
                  accept="image/*,video/*"
                  multiple
                  onChange={handleFileChange}
                  value={formData.mediaFiles}
                />
                <p className="text-xs text-default-500 mt-1">
                  Поддерживаются изображения и видео (максимум 10 файлов)
                </p>
              </div>
            </div>

            {/* Существующие медиафайлы */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Текущие медиафайлы</h3>
              
              {product.mediaFiles && product.mediaFiles.length > 0 ? (
                <div className="space-y-3">
                  {product.mediaFiles.map((media) => (
                    <MediaPreview
                      key={media.id}
                      media={media}
                      onDelete={handleDeleteMedia}
                      showDeleteButton={true}
                      size="md"
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-default-500">
                  <p>Нет медиафайлов</p>
                </div>
              )}
            </div>
          </div>

          {productStore.error && (
            <Alert color="danger" variant="flat" className="mt-4">
              {productStore.error}
            </Alert>
          )}
        </ModalBody>

        <ModalFooter>
          <Button 
            color="danger" 
            variant="light" 
            onPress={handleClose}
            isDisabled={isSubmitting}
          >
            Отмена
          </Button>
          <Button 
            color="primary" 
            onPress={handleSubmit}
            isLoading={isSubmitting}
            startContent={isSubmitting ? <Spinner size="sm" /> : null}
          >
            {isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditProductModal;
