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
  Badge
} from '@heroui/react';

interface ClothingType {
  id: number;
  name: string;
  createdAt: string;
}

interface ClothingTypesTableProps {
  clothingTypes: ClothingType[];
  onEdit: (type: ClothingType) => void;
  onDelete: (type: ClothingType) => void;
}

const ClothingTypesTable: React.FC<ClothingTypesTableProps> = ({
  clothingTypes,
  onEdit,
  onDelete
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center w-full">
          <h2 className="text-lg font-semibold">Список типов одежды</h2>
          <Badge content={clothingTypes.length} color="primary" variant="flat">
            <span className="text-sm text-default-500">Всего типов</span>
          </Badge>
        </div>
      </CardHeader>
      <CardBody>
        <Table aria-label="Clothing types table">
          <TableHeader>
            <TableColumn>ID</TableColumn>
            <TableColumn>Название</TableColumn>
            <TableColumn>Дата создания</TableColumn>
            <TableColumn>Действия</TableColumn>
          </TableHeader>
          <TableBody emptyContent="Типы одежды не найдены">
            {clothingTypes.map((type) => (
              <TableRow key={type.id}>
                <TableCell>{type.id}</TableCell>
                <TableCell>
                  <span className="font-medium">{type.name}</span>
                </TableCell>
                <TableCell>
                  {new Date(type.createdAt).toLocaleDateString('ru-RU')}
                </TableCell>
                <TableCell>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button variant="bordered" size="sm">
                        Действия
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu>
                      <DropdownItem key="edit" onPress={() => onEdit(type)}>
                        Редактировать
                      </DropdownItem>
                      <DropdownItem 
                        key="delete" 
                        className="text-danger" 
                        color="danger"
                        onPress={() => onDelete(type)}
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

export default ClothingTypesTable;
