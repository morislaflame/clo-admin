import React from 'react';
import { Button } from '@heroui/react';

interface ColorsHeaderProps {
  onCreateDefaults: () => void;
  onCreateColor: () => void;
  isLoading: boolean;
}

const ColorsHeader: React.FC<ColorsHeaderProps> = ({
  onCreateDefaults,
  onCreateColor,
  isLoading
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Управление цветами</h1>
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
        <Button color="primary" size="lg" onPress={onCreateColor}>
          Создать цвет
        </Button>
      </div>
    </div>
  );
};

export default ColorsHeader;
