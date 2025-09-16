import React from 'react';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button
} from '@heroui/react';
import type { Product } from '@/types/types';

interface ProductActionsProps {
  product: Product;
  onAction: (action: string, product: Product) => void;
}

const ProductActions: React.FC<ProductActionsProps> = ({ product, onAction }) => {
  const handleAction = (action: string) => {
    onAction(action, product);
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="light" size="sm">
          Действия
        </Button>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem 
          key="edit" 
          onPress={() => handleAction('edit')}
        >
          Редактировать
        </DropdownItem>
        <DropdownItem 
          key="view" 
          onPress={() => handleAction('view')}
        >
          Просмотр
        </DropdownItem>
        <DropdownItem 
          key="media" 
          onPress={() => handleAction('media')}
        >
          Медиафайлы
        </DropdownItem>
        <DropdownItem 
          key="delete" 
          className="text-danger" 
          color="danger"
          onPress={() => handleAction('delete')}
        >
          Удалить
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default ProductActions;
