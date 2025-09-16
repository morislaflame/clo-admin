import React from 'react';
import { Button } from '@heroui/react';

interface SizesHeaderProps {
  onCreateDefaults: () => void;
  onCreateSize: () => void;
  isLoading: boolean;
}

const SizesHeader: React.FC<SizesHeaderProps> = ({
  onCreateDefaults,
  onCreateSize,
  isLoading
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Управление размерами</h1>
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
        <Button color="primary" size="lg" onPress={onCreateSize}>
          Создать размер
        </Button>
      </div>
    </div>
  );
};

export default SizesHeader;
