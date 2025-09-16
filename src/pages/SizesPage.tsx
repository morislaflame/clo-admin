import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Spinner,
  Alert,
  Badge,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  useDisclosure
} from '@heroui/react';
import { Context, type IStoreContext } from '@/store/StoreProvider';

const SizesPage = observer(() => {
  const { user, size } = useContext(Context) as IStoreContext;
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [newSizeName, setNewSizeName] = React.useState('');

  useEffect(() => {
    if (user.isAuth) {
      size.fetchSizes();
    }
  }, [user.isAuth]);

  const handleCreateSize = async () => {
    if (!newSizeName.trim()) return;
    
    try {
      await size.createSize({ name: newSizeName.trim() });
      setNewSizeName('');
      onOpenChange();
    } catch (error) {
      console.error('Error creating size:', error);
    }
  };

  const handleCreateDefaults = async () => {
    try {
      await size.createDefaultSizes();
    } catch (error) {
      console.error('Error creating default sizes:', error);
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Управление размерами</h1>
        <div className="flex gap-2">
          <Button 
            color="secondary" 
            variant="flat" 
            size="lg"
            onClick={handleCreateDefaults}
            isLoading={size.loading}
          >
            Создать стандартные
          </Button>
          <Button color="primary" size="lg" onPress={onOpen}>
            Создать размер
          </Button>
        </div>
      </div>

      {size.loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      ) : size.isServerError ? (
        <Alert color="danger" variant="flat">
          {size.error || 'Ошибка загрузки размеров'}
        </Alert>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center w-full">
              <h2 className="text-lg font-semibold">Список размеров</h2>
              <Badge content={size.sizes.length} color="primary" variant="flat">
                <span className="text-sm text-default-500">Всего размеров</span>
              </Badge>
            </div>
          </CardHeader>
          <CardBody>
            <Table aria-label="Sizes table">
              <TableHeader>
                <TableColumn>ID</TableColumn>
                <TableColumn>Название</TableColumn>
                <TableColumn>Дата создания</TableColumn>
                <TableColumn>Действия</TableColumn>
              </TableHeader>
              <TableBody emptyContent="Размеры не найдены">
                {size.sizes.map((sizeItem) => (
                  <TableRow key={sizeItem.id}>
                    <TableCell>{sizeItem.id}</TableCell>
                    <TableCell>
                      <span className="font-medium">{sizeItem.name}</span>
                    </TableCell>
                    <TableCell>
                      {new Date(sizeItem.createdAt).toLocaleDateString('ru-RU')}
                    </TableCell>
                    <TableCell>
                      <Dropdown>
                        <DropdownTrigger>
                          <Button variant="light" size="sm">
                            Действия
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu>
                          <DropdownItem key="delete" className="text-danger" color="danger">
                            Удалить
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      )}

      {/* Модальное окно создания */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Создать новый размер</ModalHeader>
              <ModalBody>
                <Input
                  label="Название размера"
                  placeholder="Введите название размера (например: XS, S, M, L, XL)"
                  value={newSizeName}
                  onChange={(e) => setNewSizeName(e.target.value)}
                  variant="bordered"
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Отмена
                </Button>
                <Button 
                  color="primary" 
                  onPress={handleCreateSize}
                  isDisabled={!newSizeName.trim()}
                >
                  Создать
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
});

export default SizesPage;
