import { Card, CardBody, Spinner } from '@heroui/react';
import { ShoppingBag, DollarSign, TrendingUp, Clock } from 'lucide-react';
import type { OrderStatsResponse } from '@/http/orderAPI';

interface OrdersStatisticsProps {
  stats: OrderStatsResponse | null;
  loading: boolean;
}

const OrdersStatistics = ({ stats, loading }: OrdersStatisticsProps) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const statusStats = {
    created: stats.ordersByStatus.find(s => s.status === 'CREATED')?.count || 0,
    paid: stats.ordersByStatus.find(s => s.status === 'PAID')?.count || 0,
    shipped: stats.ordersByStatus.find(s => s.status === 'SHIPPED')?.count || 0,
    delivered: stats.ordersByStatus.find(s => s.status === 'DELIVERED')?.count || 0,
    cancelled: stats.ordersByStatus.find(s => s.status === 'CANCELLED')?.count || 0,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Всего заказов */}
      <Card>
        <CardBody>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-default-500">Всего заказов</p>
              <p className="text-2xl font-bold">{stats.totalOrders}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <ShoppingBag className="text-primary" size={24} />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Общая выручка */}
      <Card>
        <CardBody>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-default-500">Общая выручка</p>
              <p className="text-2xl font-bold">
                {stats.totalRevenue.totalKZT.toLocaleString()} ₸
              </p>
              <p className="text-xs text-default-400">
                ${stats.totalRevenue.totalUSD.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-success/10 rounded-lg">
              <DollarSign className="text-success" size={24} />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Доставлено */}
      <Card>
        <CardBody>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-default-500">Доставлено</p>
              <p className="text-2xl font-bold">{statusStats.delivered}</p>
              <p className="text-xs text-default-400">
                {stats.totalOrders > 0 
                  ? `${((statusStats.delivered / stats.totalOrders) * 100).toFixed(1)}%`
                  : '0%'
                }
              </p>
            </div>
            <div className="p-3 bg-secondary/10 rounded-lg">
              <TrendingUp className="text-secondary" size={24} />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* В обработке */}
      <Card>
        <CardBody>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-default-500">В обработке</p>
              <p className="text-2xl font-bold">
                {statusStats.created + statusStats.paid + statusStats.shipped}
              </p>
              <div className="flex gap-2 mt-1">
                <span className="text-xs text-default-400">
                  Новых: {statusStats.created}
                </span>
                <span className="text-xs text-default-400">
                  В пути: {statusStats.shipped}
                </span>
              </div>
            </div>
            <div className="p-3 bg-warning/10 rounded-lg">
              <Clock className="text-warning" size={24} />
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default OrdersStatistics;
