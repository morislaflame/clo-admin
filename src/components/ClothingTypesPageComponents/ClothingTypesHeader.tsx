import React from 'react';
import { Button } from '@heroui/react';

interface ClothingTypesHeaderProps {
  onCreateDefaults: () => void;
  onCreateType: () => void;
  isLoading: boolean;
}

const ClothingTypesHeader: React.FC<ClothingTypesHeaderProps> = ({
  onCreateDefaults,
  onCreateType,
  isLoading
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Управление типами одежды</h1>
      <div className="flex gap-2 lg:flex-row flex-col">
        <Button 
          color="secondary" 
          variant="flat" 
          size="lg"
          onClick={onCreateDefaults}
          isLoading={isLoading}
        >
          Создать стандартные
        </Button>
        <Button color="primary" size="lg" onPress={onCreateType}>
          Создать тип
        </Button>
      </div>
    </div>
  );
};

export default ClothingTypesHeader;
