import { useState, useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Select,
  SelectItem,
  Textarea,
  Chip,
} from '@heroui/react';
import type { Order } from '@/http/orderAPI';

interface UpdateOrderStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onUpdate: (orderId: number, status: string, notes?: string) => Promise<void>;
  loading: boolean;
}

const statusOptions = [
  { value: 'CREATED', label: 'Создан', color: 'default' as const },
  { value: 'PAID', label: 'Оплачен', color: 'primary' as const },
  { value: 'SHIPPED', label: 'В пути', color: 'secondary' as const },
  { value: 'DELIVERED', label: 'Доставлен', color: 'success' as const },
  { value: 'CANCELLED', label: 'Отменен', color: 'danger' as const },
];

const UpdateOrderStatusModal = ({
  isOpen,
  onClose,
  order,
  onUpdate,
  loading,
}: UpdateOrderStatusModalProps) => {
  const [status, setStatus] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (order) {
      setStatus(order.status);
      setNotes(order.notes || '');
    }
  }, [order]);

  const handleUpdate = async () => {
    if (!order || !status) return;

    await onUpdate(order.id, status, notes || undefined);
    onClose();
  };

  if (!order) return null;

  const currentStatusOption = statusOptions.find(opt => opt.value === status);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Обновить статус заказа #{order.id}
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            {/* Текущий статус */}
            <div>
              <p className="text-sm text-default-500 mb-2">Текущий статус</p>
              <Chip 
                color={statusOptions.find(opt => opt.value === order.status)?.color} 
                variant="flat"
              >
                {statusOptions.find(opt => opt.value === order.status)?.label}
              </Chip>
            </div>

            {/* Выбор нового статуса */}
            <Select
              label="Новый статус"
              placeholder="Выберите статус"
              selectedKeys={status ? [status] : []}
              onChange={(e) => setStatus(e.target.value)}
              isRequired
              startContent={
                currentStatusOption && (
                  <div className={`w-2 h-2 rounded-full bg-${currentStatusOption.color}`} />
                )
              }
            >
              {statusOptions.map((option) => (
                <SelectItem 
                  key={option.value}
                  startContent={
                    <div className={`w-2 h-2 rounded-full bg-${option.color}`} />
                  }
                >
                  {option.label}
                </SelectItem>
              ))}
            </Select>

            {/* Примечания */}
            <Textarea
              label="Примечания (необязательно)"
              placeholder="Добавьте примечания к заказу..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              minRows={3}
              maxRows={6}
            />

            {/* Информация о заказе */}
            <div className="bg-default-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-default-500">Клиент:</span>
                <span className="text-sm font-medium">{order.recipientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-default-500">Сумма:</span>
                <span className="text-sm font-medium">
                  {order.totalKZT.toLocaleString()} ₸ (${order.totalUSD})
                </span>
              </div>
               <div className="flex justify-between">
                 <span className="text-sm text-default-500">Товаров:</span>
                 <span className="text-sm font-medium">{order.orderItems?.length || 0}</span>
               </div>
              {order.user?.isGuest && (
                <div className="flex justify-between">
                  <span className="text-sm text-default-500">Тип:</span>
                  <Chip size="sm" color="warning" variant="flat">
                    Гостевой заказ
                  </Chip>
                </div>
              )}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button 
            color="default" 
            variant="light" 
            onPress={onClose}
            isDisabled={loading}
          >
            Отмена
          </Button>
          <Button 
            color="primary" 
            onPress={handleUpdate}
            isLoading={loading}
            isDisabled={!status || status === order.status}
          >
            Обновить статус
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UpdateOrderStatusModal;
