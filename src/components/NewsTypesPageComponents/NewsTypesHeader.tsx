import React from 'react';
import { Button } from '@heroui/react';

interface NewsTypesHeaderProps {
  onCreateNewsType: () => void;
  isLoading: boolean;
}

const NewsTypesHeader: React.FC<NewsTypesHeaderProps> = ({
  onCreateNewsType,
  isLoading
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Управление типами новостей</h1>
      <div className="flex gap-2">
        <Button 
          color="primary" 
          size="lg"
          onPress={onCreateNewsType}
          isLoading={isLoading}
        >
          Создать тип
        </Button>
      </div>
    </div>
  );
};

export default NewsTypesHeader;
