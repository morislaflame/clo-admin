import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Button, Spinner } from '@heroui/react';
import { observer } from 'mobx-react-lite';
import type { Collection } from '@/types/types';

interface CollectionsTableProps {
  collections: Collection[];
  totalCount: number;
  loading: boolean;
  error: string;
  isServerError: boolean;
  onCollectionAction: (action: string, collection: Collection) => void;
}

const CollectionsTable = observer(({ 
  collections, 
  totalCount, 
  loading, 
  error, 
  isServerError, 
  onCollectionAction 
}: CollectionsTableProps) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-danger">
          {isServerError ? 'Ошибка сервера: ' : 'Ошибка: '}{error}
        </p>
      </div>
    );
  }

  if (collections.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Коллекции не найдены</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg shadow">
      <Table aria-label="Коллекции">
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>Название</TableColumn>
          <TableColumn>Описание</TableColumn>
          <TableColumn>Количество продуктов</TableColumn>
          <TableColumn>Медиафайлы</TableColumn>
          <TableColumn>Действия</TableColumn>
        </TableHeader>
        <TableBody>
          {collections.map((collection) => (
            <TableRow key={collection.id}>
              <TableCell>{collection.id}</TableCell>
              <TableCell>
                <div className="font-medium">{collection.name}</div>
              </TableCell>
              <TableCell>
                <div className="max-w-xs truncate">
                  {collection.description || '—'}
                </div>
              </TableCell>
              <TableCell>
                <Chip size="sm" variant="flat" color="primary">
                  {collection.products?.length || 0}
                </Chip>
              </TableCell>
              <TableCell>
                <Chip size="sm" variant="flat" color="secondary">
                  {collection.mediaFiles?.length || 0}
                </Chip>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="light"
                    color="primary"
                    onPress={() => onCollectionAction('view', collection)}
                  >
                    Просмотр
                  </Button>
                  <Button
                    size="sm"
                    variant="light"
                    color="warning"
                    onPress={() => onCollectionAction('edit', collection)}
                  >
                    Редактировать
                  </Button>
                  <Button
                    size="sm"
                    variant="light"
                    color="secondary"
                    onPress={() => onCollectionAction('products', collection)}
                  >
                    Продукты
                  </Button>
                  <Button
                    size="sm"
                    variant="light"
                    color="danger"
                    onPress={() => onCollectionAction('delete', collection)}
                  >
                    Удалить
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <div className="p-4 border-t">
        <p className="text-sm text-gray-500">
          Всего коллекций: {totalCount}
        </p>
      </div>
    </div>
  );
});

export default CollectionsTable;
