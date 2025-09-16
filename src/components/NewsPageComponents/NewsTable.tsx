import React from 'react';
import {
  Card,
  CardBody,
  CardHeader,
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
  Button,
  Chip
} from '@heroui/react';
import type { News } from '@/types/types';

interface NewsTableProps {
  news: News[];
  onEdit: (news: News) => void;
  onView: (news: News) => void;
  onDelete: (news: News) => void;
}

const NewsTable: React.FC<NewsTableProps> = ({
  news,
  onEdit,
  onView,
  onDelete
}) => {
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

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center w-full">
          <h2 className="text-lg font-semibold">Список новостей</h2>
          <span className="text-sm text-default-500">Всего новостей <Chip variant="flat">{news.length}</Chip></span>
        </div>
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
            {news.map((newsItem) => (
              <TableRow key={newsItem.id}>
                <TableCell>{newsItem.id}</TableCell>
                <TableCell>
                  <div className="max-w-xs">
                    <p className="font-medium truncate">{newsItem.title}</p>
                    {newsItem.description && (
                      <p className="text-sm text-default-500 truncate">
                        {newsItem.description}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Chip 
                    color={getStatusColor(newsItem.status)} 
                    variant="flat" 
                    size="sm"
                  >
                    {getStatusText(newsItem.status)}
                  </Chip>
                </TableCell>
                <TableCell>
                  {newsItem.newsType?.name || 'Не указан'}
                </TableCell>
                <TableCell>
                  {newsItem.author?.email || 'Неизвестен'}
                </TableCell>
                <TableCell>
                  {new Date(newsItem.createdAt).toLocaleDateString('ru-RU')}
                </TableCell>
                <TableCell>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button variant="bordered" size="sm">
                        Действия
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu>
                      <DropdownItem key="edit" onPress={() => onEdit(newsItem)}>
                        Редактировать
                      </DropdownItem>
                      <DropdownItem key="view" onPress={() => onView(newsItem)}>
                        Просмотр
                      </DropdownItem>
                      <DropdownItem 
                        key="delete" 
                        className="text-danger" 
                        color="danger"
                        onPress={() => onDelete(newsItem)}
                      >
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
  );
};

export default NewsTable;
