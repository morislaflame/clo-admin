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
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Spinner,
  Alert
} from '@heroui/react';
import { Context, type IStoreContext } from '@/store/StoreProvider';

const NewsPage = observer(() => {
  const { user, news } = useContext(Context) as IStoreContext;

  useEffect(() => {
    if (user.isAuth) {
      news.fetchNews();
    }
  }, [user.isAuth]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'success';
      case 'DRAFT':
        return 'warning';
      case 'ARCHIVED':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'Опубликовано';
      case 'DRAFT':
        return 'Черновик';
      case 'ARCHIVED':
        return 'Архив';
      default:
        return status;
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
        <h1 className="text-2xl font-bold">Управление новостями</h1>
        <Button color="primary" size="lg">
          Создать новость
        </Button>
      </div>

      {news.loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      ) : news.isServerError ? (
        <Alert color="danger" variant="flat">
          {news.error || 'Ошибка загрузки новостей'}
        </Alert>
      ) : (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Список новостей</h2>
          </CardHeader>
          <CardBody>
            <Table aria-label="News table">
              <TableHeader>
                <TableColumn>ID</TableColumn>
                <TableColumn>Заголовок</TableColumn>
                <TableColumn>Статус</TableColumn>
                <TableColumn>Тип</TableColumn>
                <TableColumn>Автор</TableColumn>
                <TableColumn>Дата создания</TableColumn>
                <TableColumn>Действия</TableColumn>
              </TableHeader>
              <TableBody emptyContent="Новости не найдены">
                {news.news.map((news) => (
                  <TableRow key={news.id}>
                    <TableCell>{news.id}</TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="font-medium truncate">{news.title}</p>
                        {news.description && (
                          <p className="text-sm text-default-500 truncate">
                            {news.description}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        color={getStatusColor(news.status)} 
                        variant="flat" 
                        size="sm"
                      >
                        {getStatusText(news.status)}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      {news.newsType?.name || 'Не указан'}
                    </TableCell>
                    <TableCell>
                      {news.author?.email || 'Неизвестен'}
                    </TableCell>
                    <TableCell>
                      {new Date(news.createdAt).toLocaleDateString('ru-RU')}
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
                          <DropdownItem key="view">Просмотр</DropdownItem>
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

export default NewsPage;
