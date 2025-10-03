import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Chip,
  Card,
  CardBody,
  Divider,
} from '@heroui/react';
import type { Order } from '@/http/orderAPI';

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

const OrderDetailsModal = ({ isOpen, onClose, order }: OrderDetailsModalProps) => {
  if (!order) return null;

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
      case 'BANK_TRANSFER': return 'Банковский перевод';
      default: return method;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="3xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span>Заказ #{order.id}</span>
            <Chip color={getStatusColor(order.status)} variant="flat">
              {getStatusLabel(order.status)}
            </Chip>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            {/* Информация о клиенте */}
            <Card>
              <CardBody>
                <h3 className="text-lg font-semibold mb-3">Информация о клиенте</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-default-500">Имя получателя</p>
                    <p className="font-medium">{order.recipientName}</p>
                  </div>
                  {order.user?.email && (
                    <div>
                      <p className="text-sm text-default-500">Email</p>
                      <p className="font-medium">{order.user.email}</p>
                    </div>
                  )}
                  {order.recipientEmail && (
                    <div>
                      <p className="text-sm text-default-500">Email (гость)</p>
                      <p className="font-medium">{order.recipientEmail}</p>
                    </div>
                  )}
                  {order.recipientPhone && (
                    <div>
                      <p className="text-sm text-default-500">Телефон</p>
                      <p className="font-medium">{order.recipientPhone}</p>
                    </div>
                  )}
                  <div className="md:col-span-2">
                    <p className="text-sm text-default-500">Адрес доставки</p>
                    <p className="font-medium">{order.recipientAddress}</p>
                  </div>
                  <div>
                    <p className="text-sm text-default-500">ID пользователя</p>
                    <p className="font-medium">
                      {order.userId}
                      {order.user?.isGuest && (
                        <Chip size="sm" color="warning" variant="flat" className="ml-2">
                          Гость
                        </Chip>
                      )}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Информация о заказе */}
            <Card>
              <CardBody>
                <h3 className="text-lg font-semibold mb-3">Информация о заказе</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-default-500">Дата создания</p>
                    <p className="font-medium">{formatDate(order.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-default-500">Последнее обновление</p>
                    <p className="font-medium">{formatDate(order.updatedAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-default-500">Способ оплаты</p>
                    <Chip variant="bordered">
                      {getPaymentMethodLabel(order.paymentMethod)}
                    </Chip>
                  </div>
                  <div>
                    <p className="text-sm text-default-500">Общая сумма</p>
                    <div className="flex flex-col gap-1">
                      <p className="font-bold text-lg">{order.totalKZT.toLocaleString()} ₸</p>
                      <p className="text-sm text-default-500">${order.totalUSD}</p>
                    </div>
                  </div>
                  {order.notes && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-default-500">Примечания</p>
                      <p className="font-medium">{order.notes}</p>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>

            {/* Товары в заказе */}
            <Card>
              <CardBody>
                <h3 className="text-lg font-semibold mb-3">
                  Товары ({order.orderItems.length})
                </h3>
                <div className="space-y-3">
                  {order.orderItems.map((item, index) => (
                    <div key={item.id}>
                      {index > 0 && <Divider className="my-3" />}
                      <div className="flex gap-4">
                        {/* Изображение товара */}
                        {item.product.mediaFiles && item.product.mediaFiles.length > 0 ? (
                          <img
                            src={item.product.mediaFiles[0].url}
                            alt={item.product.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-default-100 rounded-lg flex items-center justify-center">
                            <span className="text-default-400 text-sm">Нет фото</span>
                          </div>
                        )}

                        {/* Информация о товаре */}
                        <div className="flex-1">
                          <h4 className="font-semibold">{item.product.name}</h4>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Chip size="sm" variant="flat">
                              ID: {item.productId}
                            </Chip>
                            {item.selectedColor && (
                              <Chip size="sm" variant="flat" color="secondary">
                                Цвет: {item.selectedColor.name}
                              </Chip>
                            )}
                            {item.selectedSize && (
                              <Chip size="sm" variant="flat" color="secondary">
                                Размер: {item.selectedSize.name}
                              </Chip>
                            )}
                            <Chip size="sm" variant="flat">
                              x{item.quantity}
                            </Chip>
                          </div>
                          {item.product.collection && (
                            <p className="text-sm text-default-500 mt-2">
                              Коллекция: {item.product.collection.name}
                            </p>
                          )}
                        </div>

                        {/* Цена */}
                        <div className="text-right">
                          <p className="font-bold">{item.priceKZT.toLocaleString()} ₸</p>
                          <p className="text-sm text-default-500">${item.priceUSD}</p>
                          {item.quantity > 1 && (
                            <p className="text-xs text-default-400 mt-1">
                              {item.priceKZT.toLocaleString()} ₸ × {item.quantity}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Итого */}
                <Divider className="my-4" />
                <div className="flex justify-between items-center">
                  <p className="text-lg font-semibold">Итого:</p>
                  <div className="text-right">
                    <p className="text-xl font-bold text-primary">
                      {order.totalKZT.toLocaleString()} ₸
                    </p>
                    <p className="text-sm text-default-500">${order.totalUSD}</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="default" variant="light" onPress={onClose}>
            Закрыть
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default OrderDetailsModal;
