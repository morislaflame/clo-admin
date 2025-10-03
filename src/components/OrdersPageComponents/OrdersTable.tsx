import { useState } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Button,
  Spinner,
  Alert,
  Pagination,
  Input,
  Select,
  SelectItem,
  Card,
  CardBody,
} from '@heroui/react';
import { Eye, Edit } from 'lucide-react';
import type { Order } from '@/http/orderAPI';

interface OrdersTableProps {
  orders: Order[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  isServerError: boolean;
  onOrderAction: (action: 'view' | 'edit', order: Order) => void;
  onPageChange: (page: number) => void;
  onFilterChange: (filters: OrderFilters) => void;
}

export interface OrderFilters {
  status?: string;
  paymentMethod?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
}

const OrdersTable = ({
  orders,
  totalCount,
  currentPage,
  totalPages,
  loading,
  error,
  isServerError,
  onOrderAction,
  onPageChange,
  onFilterChange,
}: OrdersTableProps) => {
  const [filters, setFilters] = useState<OrderFilters>({});

  const statusOptions = [
    { value: '', label: 'Все статусы' },
    { value: 'CREATED', label: 'Создан' },
    { value: 'PAID', label: 'Оплачен' },
    { value: 'SHIPPED', label: 'В пути' },
    { value: 'DELIVERED', label: 'Доставлен' },
    { value: 'CANCELLED', label: 'Отменен' },
  ];

  const paymentOptions = [
    { value: '', label: 'Все способы' },
    { value: 'CASH', label: 'Наличные' },
    { value: 'CARD', label: 'Карта' },
    { value: 'BANK_TRANSFER', label: 'Банковский перевод' },
  ];

  const handleFilterChange = (key: keyof OrderFilters, value: string) => {
    const newFilters = { ...filters, [key]: value || undefined };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const getStatusColor = (status: string): 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' => {
    switch (status) {
      case 'CREATED': return 'default';
      case 'PAID': return 'primary';
      case 'SHIPPED': return 'secondary';
      case 'DELIVERED': return 'success';
      case 'CANCELLED': return 'danger';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'CREATED': return 'Создан';
      case 'PAID': return 'Оплачен';
      case 'SHIPPED': return 'В пути';
      case 'DELIVERED': return 'Доставлен';
      case 'CANCELLED': return 'Отменен';
      default: return status;
    }
  };

  const getPaymentMethodLabel = (method: string): string => {
    switch (method) {
      case 'CASH': return 'Наличные';
      case 'CARD': return 'Карта';
      case 'BANK_TRANSFER': return 'Банк. перевод';
      default: return method;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (error && isServerError) {
    return (
      <Alert color="danger" variant="flat">
        <div className="flex flex-col gap-2">
          <p className="font-semibold">Ошибка подключения к серверу</p>
          <p className="text-sm">{error}</p>
        </div>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {/* Фильтры */}
      <Card>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Select
              label="Статус"
              placeholder="Выберите статус"
              selectedKeys={filters.status ? [filters.status] : ['']}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              {statusOptions.map((option) => (
                <SelectItem key={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </Select>

            <Select
              label="Способ оплаты"
              placeholder="Выберите способ"
              selectedKeys={filters.paymentMethod ? [filters.paymentMethod] : ['']}
              onChange={(e) => handleFilterChange('paymentMethod', e.target.value)}
            >
              {paymentOptions.map((option) => (
                <SelectItem key={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </Select>

            <Input
              type="number"
              label="ID пользователя"
              placeholder="Введите ID"
              value={filters.userId || ''}
              onChange={(e) => handleFilterChange('userId', e.target.value)}
            />

            <Input
              type="date"
              label="С даты"
              value={filters.startDate || ''}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
            />

            <Input
              type="date"
              label="До даты"
              value={filters.endDate || ''}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
            />
          </div>
        </CardBody>
      </Card>

      {/* Статистика */}
      <Card>
        <CardBody>
          <div className="flex items-center justify-between">
            <p className="text-sm text-default-500">
              Всего заказов: <span className="font-semibold text-foreground">{totalCount}</span>
            </p>
            <p className="text-sm text-default-500">
              Страница {currentPage} из {totalPages}
            </p>
          </div>
        </CardBody>
      </Card>

      {/* Таблица */}
      <Table aria-label="Таблица заказов">
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>ДАТА</TableColumn>
          <TableColumn>КЛИЕНТ</TableColumn>
          <TableColumn>КОНТАКТ</TableColumn>
          <TableColumn>СТАТУС</TableColumn>
          <TableColumn>ОПЛАТА</TableColumn>
          <TableColumn>СУММА</TableColumn>
          <TableColumn>ТОВАРОВ</TableColumn>
          <TableColumn>ДЕЙСТВИЯ</TableColumn>
        </TableHeader>
        <TableBody
          items={orders}
          isLoading={loading}
          loadingContent={<Spinner size="lg" />}
          emptyContent={
            <div className="text-center py-8">
              <p className="text-default-500">Заказы не найдены</p>
            </div>
          }
        >
          {(order) => (
            <TableRow key={order.id}>
              <TableCell>#{order.id}</TableCell>
              <TableCell className="text-sm">
                {formatDate(order.createdAt)}
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <p className="text-sm font-medium">{order.recipientName}</p>
                  {order.user?.isGuest && (
                    <Chip size="sm" color="warning" variant="flat">
                      Гость
                    </Chip>
                  )}
                  {order.user?.email && (
                    <p className="text-xs text-default-500">{order.user.email}</p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  {order.recipientPhone && (
                    <p className="text-xs">{order.recipientPhone}</p>
                  )}
                  {order.recipientEmail && (
                    <p className="text-xs text-default-500">{order.recipientEmail}</p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Chip color={getStatusColor(order.status)} variant="flat" size="sm">
                  {getStatusLabel(order.status)}
                </Chip>
              </TableCell>
              <TableCell>
                <Chip variant="bordered" size="sm">
                  {getPaymentMethodLabel(order.paymentMethod)}
                </Chip>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <p className="text-sm font-medium">{order.totalKZT.toLocaleString()} ₸</p>
                  <p className="text-xs text-default-500">${order.totalUSD}</p>
                </div>
              </TableCell>
              <TableCell>
                <Chip size="sm" variant="flat">
                  {order.orderItems?.length || 0}
                </Chip>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    onPress={() => onOrderAction('view', order)}
                  >
                    <Eye size={18} />
                  </Button>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    color="primary"
                    onPress={() => onOrderAction('edit', order)}
                  >
                    <Edit size={18} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Пагинация */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            total={totalPages}
            page={currentPage}
            onChange={onPageChange}
            showControls
          />
        </div>
      )}

      {error && !isServerError && (
        <Alert color="warning" variant="flat">
          {error}
        </Alert>
      )}
    </div>
  );
};

export default OrdersTable;
