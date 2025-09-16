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

interface Color {
  id: number;
  name: string;
  hexCode?: string;
  createdAt: string;
}

interface ColorsTableProps {
  colors: Color[];
  onEdit: (color: Color) => void;
  onDelete: (color: Color) => void;
}

const ColorsTable: React.FC<ColorsTableProps> = ({
  colors,
  onEdit,
  onDelete
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center w-full">
          <h2 className="text-lg font-semibold">Список цветов</h2>
            <span className="text-sm text-default-500">Всего цветов <Chip variant="flat">{colors.length}</Chip></span>
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
            {colors.map((colorItem) => (
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
                      <Button variant="bordered" size="sm">
                        Действия
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu>
                      <DropdownItem key="edit" onPress={() => onEdit(colorItem)}>
                        Редактировать
                      </DropdownItem>
                      <DropdownItem 
                        key="delete" 
                        className="text-danger" 
                        color="danger"
                        onPress={() => onDelete(colorItem)}
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

export default ColorsTable;
