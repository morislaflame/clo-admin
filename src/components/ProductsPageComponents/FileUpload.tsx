import React, { useRef } from 'react';
import { Button, Chip } from '@heroui/react';

interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  onChange: (files: File[]) => void;
  value: File[];
  maxFiles?: number;
}

const FileUpload: React.FC<FileUploadProps> = ({
  accept = "image/*,video/*",
  multiple = true,
  onChange,
  value = [],
  maxFiles = 10
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (files.length > 0) {
      const newFiles = [...value, ...files].slice(0, maxFiles);
      onChange(newFiles);
    }
    
    // Очищаем input для возможности повторного выбора тех же файлов
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = value.filter((_, i) => i !== index);
    onChange(newFiles);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileType = (file: File): string => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    return 'file';
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <Button
        variant="bordered"
        onPress={() => fileInputRef.current?.click()}
        isDisabled={value.length >= maxFiles}
      >
        {value.length >= maxFiles ? 'Достигнут лимит файлов' : 'Выбрать файлы'}
      </Button>

      {value.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-default-600">
            Выбрано файлов: {value.length} / {maxFiles}
          </p>
          <div className="flex flex-wrap gap-2">
            {value.map((file, index) => (
              <Chip
                key={index}
                variant="flat"
                color={getFileType(file) === 'image' ? 'primary' : 'secondary'}
                onClose={() => handleRemoveFile(index)}
                className="max-w-xs"
              >
                <div className="flex flex-col items-start">
                  <span className="text-xs font-medium truncate max-w-32">
                    {file.name}
                  </span>
                  <span className="text-xs text-default-500">
                    {formatFileSize(file.size)}
                  </span>
                </div>
              </Chip>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
