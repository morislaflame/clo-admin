import { Button } from '@heroui/react';

interface CollectionsHeaderProps {
  onCreateCollection: () => void;
}

const CollectionsHeader = ({ onCreateCollection }: CollectionsHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Управление коллекциями</h1>
      <Button color="primary" size="lg" onPress={onCreateCollection}>
        Создать коллекцию
      </Button>
    </div>
  );
};

export default CollectionsHeader;
