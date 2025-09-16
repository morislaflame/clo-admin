import React from 'react';
import { Card, CardBody, CardHeader } from '@heroui/react';

interface ClothingTypeStatistic {
  id: number;
  name: string;
  productCount: number;
}

interface ClothingTypesStatisticsProps {
  statistics: ClothingTypeStatistic[];
}

const ClothingTypesStatistics: React.FC<ClothingTypesStatisticsProps> = ({
  statistics
}) => {
  if (statistics.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold">Статистика по типам одежды</h2>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {statistics.map((stat) => (
            <div key={stat.id} className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary">{stat.productCount}</div>
              <div className="text-sm text-default-500 truncate">{stat.name}</div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

export default ClothingTypesStatistics;
