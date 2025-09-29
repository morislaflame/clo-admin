import { useState } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
  Image,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure
} from '@heroui/react';
import type { MainBanner } from '@/http/mainBannerAPI';

interface MainBannersTableProps {
  mainBanners: MainBanner[];
  isLoading: boolean;
  onAction: (action: string, mainBanner: MainBanner) => void;
  onDeleteMedia: (mainBannerId: number, mediaId: number) => void;
}

const MainBannersTable = ({ 
  mainBanners, 
  isLoading, 
  onAction,
}: MainBannersTableProps) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedMainBanner, setSelectedMainBanner] = useState<MainBanner | null>(null);

  const handleViewMedia = (mainBanner: MainBanner) => {
    setSelectedMainBanner(mainBanner);
    onOpen();
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'success' : 'default';
  };

  const getStatusText = (isActive: boolean) => {
    return isActive ? 'Активен' : 'Неактивен';
  };

  return (
    <>
      <Table aria-label="Main banners table">
        <TableHeader>
          <TableColumn>ПРЕВЬЮ</TableColumn>
          <TableColumn>СТАТУС</TableColumn>
          <TableColumn>ИЗОБРАЖЕНИЯ</TableColumn>
          <TableColumn>ДАТА СОЗДАНИЯ</TableColumn>
          <TableColumn>ДЕЙСТВИЯ</TableColumn>
        </TableHeader>
        <TableBody 
          isLoading={isLoading}
          loadingContent="Загрузка баннеров..."
          emptyContent="Баннеры не найдены"
        >
          {mainBanners.map((mainBanner) => (
            <TableRow key={mainBanner.id}>
              <TableCell>
                {mainBanner.mediaFiles && mainBanner.mediaFiles.length > 0 ? (
                  <Image
                    src={mainBanner.mediaFiles[0].url}
                    alt={mainBanner.title || 'Banner'}
                    className="w-16 h-12 object-cover rounded"
                  />
                ) : (
                  <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-gray-400 text-xs">Нет фото</span>
                  </div>
                )}
              </TableCell>
              <TableCell>
                <Chip 
                  color={getStatusColor(mainBanner.isActive)}
                  variant="flat"
                  size="sm"
                >
                  {getStatusText(mainBanner.isActive)}
                </Chip>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {mainBanner.mediaFiles?.length || 0} изображений
                  </span>
                  {mainBanner.mediaFiles && mainBanner.mediaFiles.length > 0 && (
                    <Button
                      size="sm"
                      variant="light"
                      onPress={() => handleViewMedia(mainBanner)}
                    >
                      Просмотр
                    </Button>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm text-gray-600">
                  {new Date(mainBanner.createdAt).toLocaleDateString('ru-RU')}
                </div>
              </TableCell>
              <TableCell>
                <Dropdown>
                  <DropdownTrigger>
                    <Button size="sm" variant="light">
                      Действия
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Actions">
                    <DropdownItem
                      key="view"
                      onPress={() => onAction('view', mainBanner)}
                    >
                      Просмотр
                    </DropdownItem>
                    <DropdownItem
                      key="edit"
                      onPress={() => onAction('edit', mainBanner)}
                    >
                      Редактировать
                    </DropdownItem>
                    <DropdownItem
                      key="delete"
                      className="text-danger"
                      color="danger"
                      onPress={() => onAction('delete', mainBanner)}
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

      {/* Модальное окно для просмотра изображений */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Изображения баннера: {selectedMainBanner?.title || 'Без названия'}
              </ModalHeader>
              <ModalBody>
                {selectedMainBanner?.mediaFiles && selectedMainBanner.mediaFiles.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedMainBanner.mediaFiles.map((media) => (
                      <div key={media.id} className="relative group">
                        <img
                          src={media.url}
                          alt={media.originalName}
                          className="w-full h-48 object-cover rounded"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Нет изображений
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Закрыть
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default MainBannersTable;
