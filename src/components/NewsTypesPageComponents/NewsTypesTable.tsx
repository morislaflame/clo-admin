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
import type { NewsType } from '@/types/types';

interface NewsTypesTableProps {
  newsTypes: NewsType[];
  onEdit: (newsType: NewsType) => void;
  onDelete: (newsType: NewsType) => void;
}

const NewsTypesTable: React.FC<NewsTypesTableProps> = ({
  newsTypes,
  onEdit,
  onDelete
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center w-full">
          <h2 className="text-lg font-semibold">Список типов новостей</h2>
          <span className="text-sm text-default-500">Всего типов <Chip variant="flat">{newsTypes.length}</Chip></span>
        </div>
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
            {newsTypes.map((newsType) => (
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
                      <Button variant="bordered" size="sm">
                        Действия
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu>
                      <DropdownItem key="edit" onPress={() => onEdit(newsType)}>
                        Редактировать
                      </DropdownItem>
                      <DropdownItem 
                        key="delete" 
                        className="text-danger" 
                        color="danger"
                        onPress={() => onDelete(newsType)}
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

export default NewsTypesTable;
