import { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Alert,
  useDisclosure
} from '@heroui/react';
import { Context, type IStoreContext } from '@/store/StoreProvider';
import { 
  MainBannersHeader, 
  MainBannersTable, 
  CreateMainBannerModal, 
  EditMainBannerModal, 
  ViewMainBannerModal
} from '@/components/MainBannersPageComponents';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';
import type { MainBanner } from '@/http/mainBannerAPI';

const MainBannersPage = observer(() => {
  const { user, mainBanner } = useContext(Context) as IStoreContext;
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onOpenChange: onEditOpenChange } = useDisclosure();
  const { isOpen: isViewOpen, onOpen: onViewOpen, onOpenChange: onViewOpenChange } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onOpenChange: onDeleteOpenChange } = useDisclosure();
  
  const [selectedMainBanner, setSelectedMainBanner] = useState<MainBanner | null>(null);
  const [deletingMainBanner, setDeletingMainBanner] = useState<MainBanner | null>(null);

  useEffect(() => {
    if (user.isAuth) {
      mainBanner.fetchMainBanners();
    }
  }, [user.isAuth, mainBanner]);

  const handleMainBannerAction = (action: string, mainBannerItem: MainBanner) => {
    switch (action) {
      case 'edit':
        setSelectedMainBanner(mainBannerItem);
        onEditOpen();
        break;
      case 'view':
        setSelectedMainBanner(mainBannerItem);
        onViewOpen();
        break;
      case 'delete':
        setDeletingMainBanner(mainBannerItem);
        onDeleteOpen();
        break;
    }
  };

  const handleDeleteConfirm = async () => {
    if (deletingMainBanner) {
      try {
        await mainBanner.deleteMainBanner(deletingMainBanner.id);
        onDeleteOpenChange();
        setDeletingMainBanner(null);
      } catch (error) {
        console.error('Error deleting main banner:', error);
      }
    }
  };

  const handleDeleteMedia = async (mainBannerId: number, mediaId: number) => {
    try {
      await mainBanner.deleteMainBannerMedia(mainBannerId, mediaId);
    } catch (error) {
      console.error('Error deleting media:', error);
    }
  };

  if (!user.isAuth) {
    return (
      <div className="flex items-center justify-center h-64">
        <Alert color="warning" title="Требуется авторизация">
          Пожалуйста, войдите в систему для доступа к управлению баннерами.
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6">
      <MainBannersHeader onCreateClick={onOpen} />
      
      {mainBanner.error && (
        <Alert 
          color="danger" 
          title="Ошибка" 
          className="mb-4"
          onClose={mainBanner.clearError}
        >
          {mainBanner.error}
        </Alert>
      )}

      <MainBannersTable 
        mainBanners={mainBanner.mainBanners}
        isLoading={mainBanner.isLoading}
        onAction={handleMainBannerAction}
        onDeleteMedia={handleDeleteMedia}
      />

      {/* Модальные окна */}
      <CreateMainBannerModal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        onSuccess={() => {
          onOpenChange();
          mainBanner.fetchMainBanners();
        }}
      />

      {selectedMainBanner && (
        <>
          <EditMainBannerModal 
            isOpen={isEditOpen} 
            onOpenChange={onEditOpenChange}
            mainBanner={selectedMainBanner}
            onSuccess={() => {
              onEditOpenChange();
              setSelectedMainBanner(null);
              mainBanner.fetchMainBanners();
            }}
          />

          <ViewMainBannerModal 
            isOpen={isViewOpen} 
            onOpenChange={onViewOpenChange}
            mainBanner={selectedMainBanner}
            onDeleteMedia={handleDeleteMedia}
          />
        </>
      )}

      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onOpenChange={onDeleteOpenChange}
        onConfirmDelete={handleDeleteConfirm}
        title="Удаление баннера"
        itemName={deletingMainBanner?.title || 'Без названия'}
        itemDetails={deletingMainBanner ? `ID: ${deletingMainBanner.id} | Создан: ${new Date(deletingMainBanner.createdAt).toLocaleDateString('ru-RU')}` : ''}
        warningMessage="Это действие нельзя отменить."
        isLoading={mainBanner.isLoading}
        confirmButtonText="Удалить"
        cancelButtonText="Отмена"
      />
    </div>
  );
});

export default MainBannersPage;
