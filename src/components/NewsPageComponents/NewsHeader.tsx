import React from 'react';
import { Button } from '@heroui/react';

interface NewsHeaderProps {
  onCreateNews: () => void;
  isLoading: boolean;
}

const NewsHeader: React.FC<NewsHeaderProps> = ({
  onCreateNews,
  isLoading
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Управление новостями</h1>
      <div className="flex gap-2">
        <Button 
          color="primary" 
          size="lg"
          onPress={onCreateNews}
          isLoading={isLoading}
        >
          Создать новость
        </Button>
      </div>
    </div>
  );
};

export default NewsHeader;
