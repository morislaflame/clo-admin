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
  Alert
} from '@heroui/react';
import { Context, type IStoreContext } from '@/store/StoreProvider';

const NewsTypesPage = observer(() => {
  const { user, newsType } = useContext(Context) as IStoreContext;

  useEffect(() => {
    if (user.isAuth) {
      newsType.fetchNewsTypes();
    }
  }, [user.isAuth]);

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
        <h1 className="text-2xl font-bold">Управление типами новостей</h1>
        <Button color="primary" size="lg">
          Создать тип
        </Button>
      </div>

      {newsType.loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      ) : newsType.isServerError ? (
        <Alert color="danger" variant="flat">
          {newsType.error || 'Ошибка загрузки типов новостей'}
        </Alert>
      ) : (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Список типов новостей</h2>
          </CardHeader>
          <CardBody>
            <Table aria-label="News types table">
              <TableHeader>
                <TableColumn>ID</TableColumn>
                <TableColumn>Название</TableColumn>
                <TableColumn>Описание</TableColumn>
                <TableColumn>Дата создания</TableColumn>
                <TableColumn>Действия</TableColumn>
              </TableHeader>
              <TableBody emptyContent="Типы новостей не найдены">
                {newsType.newsTypes.map((newsType) => (
                  <TableRow key={newsType.id}>
                    <TableCell>{newsType.id}</TableCell>
                    <TableCell>
                      <span className="font-medium">{newsType.name}</span>
                    </TableCell>
                    <TableCell>
                      {newsType.description ? (
                        <span className="text-default-600">{newsType.description}</span>
                      ) : (
                        <span className="text-default-400">Не указано</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(newsType.createdAt).toLocaleDateString('ru-RU')}
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
    </div>
  );
});

export default NewsTypesPage;
