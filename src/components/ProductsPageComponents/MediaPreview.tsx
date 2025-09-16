import React from 'react';
import { Image, Card, CardBody, Button } from '@heroui/react';
import type { MediaFile } from '@/types/types';

interface MediaPreviewProps {
  media: MediaFile;
  onDelete?: (mediaId: number) => void;
  showDeleteButton?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const MediaPreview: React.FC<MediaPreviewProps> = ({ 
  media, 
  onDelete, 
  showDeleteButton = false,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'h-24',
    md: 'h-48',
    lg: 'h-64'
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getMediaUrl = (media: MediaFile): string => {
    return media.url || `/api/media/${media.id}`;
  };

  const fallbackImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjQ0NDQ0NDIi8+Cjwvc3ZnPgo=";

  return (
    <Card className="w-full">
      <CardBody className="p-2">
        <div className="relative">
          {media.mimeType.startsWith('image/') ? (
            <Image
              src={getMediaUrl(media)}
              alt={media.originalName}
              width="100%"
              height={sizeClasses[size]}
              className="object-cover rounded-lg"
              isZoomed
              fallbackSrc={fallbackImage}
            />
          ) : (
            <div className={`w-full ${sizeClasses[size]} bg-default-100 rounded-lg flex items-center justify-center`}>
              <div className="text-center">
                <div className="text-4xl mb-2">🎥</div>
                <p className="text-sm text-default-500 truncate max-w-32">
                  {media.originalName}
                </p>
              </div>
            </div>
          )}
          
          {showDeleteButton && onDelete && (
            <Button
              size="sm"
              color="danger"
              variant="solid"
              className="absolute top-2 right-2 z-10 min-w-8 h-8 p-0"
              onPress={() => onDelete(media.id)}
            >
              ✕
            </Button>
          )}
        </div>
        
        <div className="mt-2">
          <p className="text-xs text-default-500 truncate" title={media.originalName}>
            {media.originalName}
          </p>
          <p className="text-xs text-default-400">
            {formatFileSize(media.size)}
          </p>
        </div>
      </CardBody>
    </Card>
  );
};

export default MediaPreview;
