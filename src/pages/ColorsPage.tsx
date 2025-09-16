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

const ColorsPage = observer(() => {
  const { user, color } = useContext(Context) as IStoreContext;
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [newColorName, setNewColorName] = React.useState('');
  const [newColorHex, setNewColorHex] = React.useState('');

  useEffect(() => {
    if (user.isAuth) {
      color.fetchColors();
    }
  }, [user.isAuth]);

  const handleCreateColor = async () => {
    if (!newColorName.trim()) return;
    
    try {
      await color.createColor({ 
        name: newColorName.trim(),
        hexCode: newColorHex.trim() || undefined
      });
      setNewColorName('');
      setNewColorHex('');
      onOpenChange();
    } catch (error) {
      console.error('Error creating color:', error);
    }
  };

  const handleCreateDefaults = async () => {
    try {
      await color.createDefaultColors();
    } catch (error) {
      console.error('Error creating default colors:', error);
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
        <h1 className="text-2xl font-bold">Управление цветами</h1>
        <div className="flex gap-2">
          <Button 
            color="secondary" 
            variant="flat" 
            size="lg"
            onClick={handleCreateDefaults}
            isLoading={color.loading}
          >
            Создать стандартные
          </Button>
          <Button color="primary" size="lg" onPress={onOpen}>
            Создать цвет
          </Button>
        </div>
      </div>

      {color.loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      ) : color.isServerError ? (
        <Alert color="danger" variant="flat">
          {color.error || 'Ошибка загрузки цветов'}
        </Alert>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center w-full">
              <h2 className="text-lg font-semibold">Список цветов</h2>
              <Badge content={color.colors.length} color="primary" variant="flat">
                <span className="text-sm text-default-500">Всего цветов</span>
              </Badge>
            </div>
          </CardHeader>
          <CardBody>
            <Table aria-label="Colors table">
              <TableHeader>
                <TableColumn>ID</TableColumn>
                <TableColumn>Название</TableColumn>
                <TableColumn>Цвет</TableColumn>
                <TableColumn>Hex код</TableColumn>
                <TableColumn>Дата создания</TableColumn>
                <TableColumn>Действия</TableColumn>
              </TableHeader>
              <TableBody emptyContent="Цвета не найдены">
                {color.colors.map((colorItem) => (
                  <TableRow key={colorItem.id}>
                    <TableCell>{colorItem.id}</TableCell>
                    <TableCell>
                      <span className="font-medium">{colorItem.name}</span>
                    </TableCell>
                    <TableCell>
                      {colorItem.hexCode ? (
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-6 h-6 rounded-full border border-default-300"
                            style={{ backgroundColor: colorItem.hexCode }}
                          />
                        </div>
                      ) : (
                        <span className="text-default-400">Не указан</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {colorItem.hexCode ? (
                        <code className="text-sm bg-default-100 px-2 py-1 rounded">
                          {colorItem.hexCode}
                        </code>
                      ) : (
                        <span className="text-default-400">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(colorItem.createdAt).toLocaleDateString('ru-RU')}
                    </TableCell>
                    <TableCell>
                      <Dropdown>
                        <DropdownTrigger>
                          <Button variant="light" size="sm">
                            Действия
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu>
                          <DropdownItem key="edit">Редактировать</DropdownItem>
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
              <ModalHeader className="flex flex-col gap-1">Создать новый цвет</ModalHeader>
              <ModalBody>
                <Input
                  label="Название цвета"
                  placeholder="Введите название цвета"
                  value={newColorName}
                  onChange={(e) => setNewColorName(e.target.value)}
                  variant="bordered"
                />
                <Input
                  label="Hex код (опционально)"
                  placeholder="#FF5733"
                  value={newColorHex}
                  onChange={(e) => setNewColorHex(e.target.value)}
                  variant="bordered"
                />
                {newColorHex && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-default-500">Предпросмотр:</span>
                    <div 
                      className="w-8 h-8 rounded-full border border-default-300"
                      style={{ backgroundColor: newColorHex }}
                    />
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Отмена
                </Button>
                <Button 
                  color="primary" 
                  onPress={handleCreateColor}
                  isDisabled={!newColorName.trim()}
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

export default ColorsPage;
