import { makeAutoObservable, runInAction } from "mobx";
import type { 
  Order, 
  GetOrdersResponse,
  UpdateOrderStatusRequest,
  GetOrdersParams,
  OrderStatsResponse
} from "../http/orderAPI";
import { 
  getAllOrders,
  getOrder,
  updateOrderStatus,
  getOrderStats
} from "../http/orderAPI";

interface ApiError {
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
  code?: string;
}

export default class OrderStore {
  // Состояние заказов
  orders: Order[] = [];
  currentOrder: Order | null = null;
  totalCount = 0;
  currentPage = 1;
  totalPages = 0;
  
  // Статистика
  stats: OrderStatsResponse | null = null;
  
  // Состояние загрузки
  loading = false;
  updating = false;
  statsLoading = false;
  error: string | null = null;
  isServerError = false;

  constructor() {
    makeAutoObservable(this);
  }

  // Setters
  setOrders(orders: Order[]) {
    this.orders = orders;
  }

  setCurrentOrder(order: Order | null) {
    this.currentOrder = order;
  }

  setPagination(totalCount: number, currentPage: number, totalPages: number) {
    this.totalCount = totalCount;
    this.currentPage = currentPage;
    this.totalPages = totalPages;
  }

  setStats(stats: OrderStatsResponse | null) {
    this.stats = stats;
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  setUpdating(updating: boolean) {
    this.updating = updating;
  }

  setStatsLoading(loading: boolean) {
    this.statsLoading = loading;
  }

  setError(error: string | null) {
    this.error = error;
  }

  setIsServerError(isServerError: boolean) {
    this.isServerError = isServerError;
  }

  // Actions
  async loadAllOrders(params?: GetOrdersParams) {
    try {
      this.setLoading(true);
      this.setError(null);
      this.setIsServerError(false);
      
      const response: GetOrdersResponse = await getAllOrders(params);
      
      runInAction(() => {
        this.setOrders(response.orders);
        this.setPagination(response.totalCount, response.currentPage, response.totalPages);
        this.setLoading(false);
      });

      return response;
    } catch (error: unknown) {
      console.error("Error loading all orders:", error);
      
      const err = error as ApiError;
      const isServerError = err.code === 'ERR_NETWORK' || err.response?.status === 500;
      
      runInAction(() => {
        this.setError('Ошибка загрузки заказов');
        this.setIsServerError(isServerError);
        this.setLoading(false);
      });
      
      throw error;
    }
  }

  async loadOrder(orderId: number) {
    try {
      this.setLoading(true);
      this.setError(null);
      this.setIsServerError(false);
      
      const order: Order = await getOrder(orderId);
      
      runInAction(() => {
        this.setCurrentOrder(order);
        this.setLoading(false);
      });

      return order;
    } catch (error: unknown) {
      console.error("Error loading order:", error);
      
      const err = error as ApiError;
      const isServerError = err.code === 'ERR_NETWORK' || err.response?.status === 500;
      
      runInAction(() => {
        this.setError('Ошибка загрузки заказа');
        this.setIsServerError(isServerError);
        this.setLoading(false);
      });
      
      throw error;
    }
  }

  async updateOrderStatus(orderId: number, statusData: UpdateOrderStatusRequest) {
    try {
      this.setUpdating(true);
      this.setError(null);
      
      const response = await updateOrderStatus(orderId, statusData);
      
      runInAction(() => {
        // Обновляем заказ в списке
        const orderIndex = this.orders.findIndex(order => order.id === orderId);
        if (orderIndex !== -1) {
          this.orders[orderIndex] = response.order;
        }
        
        // Обновляем текущий заказ, если это он
        if (this.currentOrder?.id === orderId) {
          this.setCurrentOrder(response.order);
        }
        
        this.setUpdating(false);
      });

      return { success: true, order: response.order, message: response.message };
    } catch (error: unknown) {
      console.error("Error updating order status:", error);
      
      const err = error as ApiError;
      const errorMessage = err.response?.data?.message || 'Ошибка обновления статуса заказа';
      
      runInAction(() => {
        this.setError(errorMessage);
        this.setUpdating(false);
      });
      
      return { 
        success: false, 
        error: errorMessage 
      };
    }
  }

  async loadOrderStats(params?: {
    startDate?: string;
    endDate?: string;
  }) {
    try {
      this.setStatsLoading(true);
      this.setError(null);
      
      const response = await getOrderStats(params);
      
      runInAction(() => {
        this.setStats(response);
        this.setStatsLoading(false);
      });

      return response;
    } catch (error: unknown) {
      console.error("Error loading order stats:", error);
      
      runInAction(() => {
        this.setError('Ошибка загрузки статистики заказов');
        this.setStatsLoading(false);
      });
      
      throw error;
    }
  }

  // Вспомогательные методы
  getOrderById(orderId: number): Order | undefined {
    return this.orders.find(order => order.id === orderId);
  }

  getOrdersByStatus(status: string): Order[] {
    return this.orders.filter(order => order.status === status);
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'CREATED': return 'Создан';
      case 'PAID': return 'Оплачен';
      case 'SHIPPED': return 'В пути';
      case 'DELIVERED': return 'Доставлен';
      case 'CANCELLED': return 'Отменен';
      default: return status;
    }
  }

  getStatusColor(status: string): 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' {
    switch (status) {
      case 'CREATED': return 'default';
      case 'PAID': return 'primary';
      case 'SHIPPED': return 'secondary';
      case 'DELIVERED': return 'success';
      case 'CANCELLED': return 'danger';
      default: return 'default';
    }
  }

  getPaymentMethodLabel(method: string): string {
    switch (method) {
      case 'CASH': return 'Наличные';
      case 'CARD': return 'Карта';
      case 'BANK_TRANSFER': return 'Банковский перевод';
      default: return method;
    }
  }

  // Getters
  get isEmpty() {
    return this.orders.length === 0;
  }

  get hasOrders() {
    return this.orders.length > 0;
  }

  get isLoading() {
    return this.loading || this.updating;
  }
}
