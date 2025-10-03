import { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Alert,
  useDisclosure,
} from '@heroui/react';
import { Context, type IStoreContext } from '@/store/StoreProvider';
import { 
  OrdersTable, 
  OrderDetailsModal, 
  UpdateOrderStatusModal,
  OrdersStatistics
} from '@/components/OrdersPageComponents';
import type { Order } from '@/http/orderAPI';
import type { OrderFilters } from '@/components/OrdersPageComponents/OrdersTable';

const OrdersPage = observer(() => {
  const { user, order } = useContext(Context) as IStoreContext;
  const { isOpen: isViewOpen, onOpen: onViewOpen, onOpenChange: onViewOpenChange } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onOpenChange: onEditOpenChange } = useDisclosure();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [currentFilters, setCurrentFilters] = useState<OrderFilters>({});

  useEffect(() => {
    if (user.isAuth) {
      loadOrders();
      order.loadOrderStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.isAuth]);

  const loadOrders = (filters?: OrderFilters, page?: number) => {
    order.loadAllOrders({
      ...filters,
      userId: filters?.userId ? Number(filters.userId) : undefined,
      page: page || 1,
      limit: 20,
    });
  };

  const handleOrderAction = (action: 'view' | 'edit', orderItem: Order) => {
    switch (action) {
      case 'view':
        setSelectedOrder(orderItem);
        onViewOpen();
        break;
      case 'edit':
        setSelectedOrder(orderItem);
        onEditOpen();
        break;
      default:
        console.log('Неизвестное действие:', action);
    }
  };

  const handlePageChange = (page: number) => {
    loadOrders(currentFilters, page);
  };

  const handleFilterChange = (filters: OrderFilters) => {
    setCurrentFilters(filters);
    loadOrders(filters, 1);
  };

  const handleUpdateOrderStatus = async (orderId: number, status: string, notes?: string) => {
    const result = await order.updateOrderStatus(orderId, { status: status as Order['status'], notes });
    
    if (result.success) {
      // Обновляем список заказов
      loadOrders(currentFilters, order.currentPage);
      
      // Обновляем статистику
      order.loadOrderStats();
    }
  };

  if (!user.isAuth) {
    return (
      <div className="p-6">
        <Alert color="warning" variant="flat">
          Необходима авторизация для доступа к этой странице
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Управление заказами</h1>
        <p className="text-default-500">
          Просматривайте и обновляйте статусы заказов
        </p>
      </div>

      {/* Статистика */}
      <OrdersStatistics 
        stats={order.stats}
        loading={order.statsLoading}
      />

      {/* Таблица заказов */}
      <OrdersTable
        orders={order.orders}
        totalCount={order.totalCount}
        currentPage={order.currentPage}
        totalPages={order.totalPages}
        loading={order.loading}
        error={order.error}
        isServerError={order.isServerError}
        onOrderAction={handleOrderAction}
        onPageChange={handlePageChange}
        onFilterChange={handleFilterChange}
      />

      {/* Модальное окно просмотра */}
      <OrderDetailsModal
        isOpen={isViewOpen}
        onClose={() => {
          onViewOpenChange();
          setSelectedOrder(null);
        }}
        order={selectedOrder}
      />

      {/* Модальное окно редактирования статуса */}
      <UpdateOrderStatusModal
        isOpen={isEditOpen}
        onClose={() => {
          onEditOpenChange();
          setSelectedOrder(null);
        }}
        order={selectedOrder}
        onUpdate={handleUpdateOrderStatus}
        loading={order.updating}
      />
    </div>
  );
});

export default OrdersPage;
