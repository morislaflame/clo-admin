import React from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Spinner,
  Alert
} from '@heroui/react';
import type { Product } from '@/types/types';
import ProductActions from './ProductActions';

interface ProductsTableProps {
  products: Product[];
  totalCount: number;
  loading: boolean;
  error: string;
  isServerError: boolean;
  onProductAction: (action: string, product: Product) => void;
}

const ProductsTable: React.FC<ProductsTableProps> = ({
  products,
  totalCount,
  loading,
  error,
  isServerError,
  onProductAction
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'success';
      case 'SOLD':
        return 'warning';
      case 'DELETED':
        return 'danger';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'Доступен';
      case 'SOLD':
        return 'Продан';
      case 'DELETED':
        return 'Удален';
      default:
        return status;
    }
  };

  const getGenderText = (gender: string) => {
    switch (gender) {
      case 'MAN':
        return 'Мужской';
      case 'WOMAN':
        return 'Женский';
      default:
        return gender;
    }
  };

  const formatPrice = (priceKZT: number, priceUSD: number, currency: 'KZT' | 'USD' = 'KZT') => {
    const price = currency === 'USD' ? priceUSD : priceKZT;
    const symbol = currency === 'USD' ? '$' : '₸';
    return `${price} ${symbol}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isServerError) {
    return (
      <Alert color="danger" variant="flat">
        {error || 'Ошибка загрузки продуктов'}
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center w-full">
          <h2 className="text-lg font-semibold">Список продуктов</h2>
          <span className="text-sm text-default-500">Всего продуктов <Chip variant="flat">{totalCount}</Chip></span>
        </div>
      </CardHeader>
      <CardBody>
        <Table aria-label="Products table">
          <TableHeader>
            <TableColumn>ID</TableColumn>
            <TableColumn>Название</TableColumn>
            <TableColumn>Пол</TableColumn>
            <TableColumn>Цена</TableColumn>
            <TableColumn>Статус</TableColumn>
            <TableColumn>Тип одежды</TableColumn>
            <TableColumn>Размеры</TableColumn>
            <TableColumn>Цвета</TableColumn>
            <TableColumn>Дата создания</TableColumn>
            <TableColumn>Действия</TableColumn>
          </TableHeader>
          <TableBody emptyContent="Продукты не найдены">
            {products.map((productItem) => (
              <TableRow key={productItem.id}>
                <TableCell>{productItem.id}</TableCell>
                <TableCell>
                  <div className="max-w-xs">
                    <p className="font-medium truncate">{productItem.name}</p>
                    {productItem.description && (
                      <p className="text-sm text-default-500 truncate">
                        {productItem.description}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Chip 
                    color={productItem.gender === 'MAN' ? 'primary' : 'secondary'} 
                    variant="flat" 
                    size="sm"
                  >
                    {getGenderText(productItem.gender)}
                  </Chip>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{formatPrice(productItem.priceKZT, productItem.priceUSD, 'KZT')}</div>
                    <div className="text-default-500">{formatPrice(productItem.priceKZT, productItem.priceUSD, 'USD')}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Chip 
                    color={getStatusColor(productItem.status)} 
                    variant="flat" 
                    size="sm"
                  >
                    {getStatusText(productItem.status)}
                  </Chip>
                </TableCell>
                <TableCell>
                  {productItem.clothingType?.name || 'Не указан'}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1 max-w-20">
                    {productItem.sizes?.slice(0, 3).map((size) => (
                      <Chip key={size.id} size="sm" variant="flat">
                        {size.name}
                      </Chip>
                    ))}
                    {productItem.sizes && productItem.sizes.length > 3 && (
                      <Chip size="sm" variant="flat" color="default">
                        +{productItem.sizes.length - 3}
                      </Chip>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1 max-w-20">
                    {productItem.colors?.slice(0, 3).map((color) => (
                      <div key={color.id} className="flex items-center gap-1">
                        {color.hexCode && (
                          <div 
                            className="w-3 h-3 rounded-full border border-default-300"
                            style={{ backgroundColor: color.hexCode }}
                          />
                        )}
                        <span className="text-xs">{color.name}</span>
                      </div>
                    ))}
                    {productItem.colors && productItem.colors.length > 3 && (
                      <Chip size="sm" variant="flat" color="default">
                        +{productItem.colors.length - 3}
                      </Chip>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(productItem.createdAt).toLocaleDateString('ru-RU')}
                </TableCell>
                <TableCell>
                  <ProductActions 
                    product={productItem} 
                    onAction={(action) => onProductAction(action, productItem)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
};

export default ProductsTable;
