import { Button } from '@heroui/react';

interface MainBannersHeaderProps {
  onCreateClick: () => void;
}

const MainBannersHeader = ({ onCreateClick }: MainBannersHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold">Главные баннеры</h1>
        <p className="text-gray-600 mt-1">
          Управление баннерами на главной странице
        </p>
      </div>
      <Button
        color="primary"
        onPress={onCreateClick}
      >
        Создать баннер
      </Button>
    </div>
  );
};

export default MainBannersHeader;
