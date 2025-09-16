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

interface Size {
  id: number;
  name: string;
  createdAt: string;
}

interface SizesTableProps {
  sizes: Size[];
  onDelete: (size: Size) => void;
}

const SizesTable: React.FC<SizesTableProps> = ({
  sizes,
  onDelete
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center w-full">
          <h2 className="text-lg font-semibold">Список размеров</h2>
          <span className="text-sm text-default-500">Всего размеров <Chip variant="flat">{sizes.length}</Chip></span>
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
            {sizes.map((sizeItem) => (
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
                      <Button variant="bordered" size="sm">
                        Действия
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu>
                      <DropdownItem 
                        key="delete" 
                        className="text-danger" 
                        color="danger"
                        onPress={() => onDelete(sizeItem)}
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

export default SizesTable;
