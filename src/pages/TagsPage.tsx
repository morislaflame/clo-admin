import { useContext, useEffect } from 'react';
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

const TagsPage = observer(() => {
  const { user, tag } = useContext(Context) as IStoreContext;

  useEffect(() => {
    if (user.isAuth) {
      tag.fetchTags();
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
        <h1 className="text-2xl font-bold">Управление тегами</h1>
        <Button color="primary" size="lg">
          Создать тег
        </Button>
      </div>

      {tag.loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      ) : tag.isServerError ? (
        <Alert color="danger" variant="flat">
          {tag.error || 'Ошибка загрузки тегов'}
        </Alert>
      ) : (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Список тегов</h2>
          </CardHeader>
          <CardBody>
            <Table aria-label="Tags table">
              <TableHeader>
                <TableColumn>ID</TableColumn>
                <TableColumn>Название</TableColumn>
                <TableColumn>Цвет</TableColumn>
                <TableColumn>Дата создания</TableColumn>
                <TableColumn>Действия</TableColumn>
              </TableHeader>
              <TableBody emptyContent="Теги не найдены">
                {tag.tags.map((tag) => (
                  <TableRow key={tag.id}>
                    <TableCell>{tag.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{tag.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {tag.color ? (
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded-full border border-default-300"
                            style={{ backgroundColor: tag.color }}
                          />
                          <span className="text-sm text-default-500">{tag.color}</span>
                        </div>
                      ) : (
                        <span className="text-default-400">Не указан</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(tag.createdAt).toLocaleDateString('ru-RU')}
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

export default TagsPage;
