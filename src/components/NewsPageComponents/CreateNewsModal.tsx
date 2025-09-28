import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Textarea,
  Select,
  SelectItem,
  Button,
  Chip
} from '@heroui/react';
import FileUpload from '../ProductsPageComponents/FileUpload';
import type { NewsType, Tag } from '@/types/types';

interface CreateNewsModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  newsTypes: NewsType[];
  tags: Tag[];
  selectedNewsType: string;
  setSelectedNewsType: (value: string) => void;
  selectedTags: string[];
  setSelectedTags: (value: string[]) => void;
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  content: string;
  setContent: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
  mediaFiles: File[];
  setMediaFiles: (value: File[]) => void;
  onCreateNews: () => void;
  isLoading?: boolean;
}

const CreateNewsModal: React.FC<CreateNewsModalProps> = ({
  isOpen,
  onOpenChange,
  newsTypes,
  tags,
  selectedNewsType,
  setSelectedNewsType,
  selectedTags,
  setSelectedTags,
  title,
  setTitle,
  description,
  setDescription,
  content,
  setContent,
  status,
  setStatus,
  mediaFiles,
  setMediaFiles,
  onCreateNews,
  isLoading = false
}) => {
  const statusOptions = [
    { key: 'DRAFT', label: 'Черновик' },
    { key: 'PUBLISHED', label: 'Опубликовано' },
    { key: 'ARCHIVED', label: 'Архив' }
  ];

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl" scrollBehavior="inside">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Создать новость
            </ModalHeader>
            <ModalBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Заголовок"
                  placeholder="Введите заголовок новости"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  variant="bordered"
                  isDisabled={isLoading}
                  isRequired
                />
                <Select
                  label="Тип новости"
                  placeholder="Выберите тип новости"
                  selectedKeys={selectedNewsType ? [selectedNewsType] : []}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as string;
                    setSelectedNewsType(selected);
                  }}
                  variant="bordered"
                  isDisabled={isLoading}
                  isRequired
                >
                  {newsTypes.map((type) => (
                    <SelectItem key={type.id.toString()}>
                      {type.name}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              <Textarea
                label="Краткое описание"
                placeholder="Введите краткое описание новости"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                variant="bordered"
                isDisabled={isLoading}
                minRows={2}
              />

              <Textarea
                label="Содержание"
                placeholder="Введите содержание новости"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                variant="bordered"
                isDisabled={isLoading}
                minRows={6}
                isRequired
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Статус"
                  placeholder="Выберите статус"
                  selectedKeys={status ? [status] : []}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as string;
                    setStatus(selected);
                  }}
                  variant="bordered"
                  isDisabled={isLoading}
                  defaultSelectedKeys={['DRAFT']}
                >
                  {statusOptions.map((option) => (
                    <SelectItem key={option.key} >
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>

                <div>
                  <label className="text-sm font-medium text-default-700 mb-2 block">
                    Теги
                  </label>
                  <div className="flex flex-wrap gap-2 p-3 border border-default-200 rounded-lg min-h-[40px]">
                    {selectedTags.length === 0 ? (
                      <span className="text-default-400 text-sm">Выберите теги</span>
                    ) : (
                      selectedTags.map((tagId) => {
                        const tag = tags.find(t => t.id.toString() === tagId);
                        return tag ? (
                          <Chip
                            key={tagId}
                            size="sm"
                            color={tag.color ? 'default' : 'primary'}
                            variant="flat"
                            onClose={() => {
                              setSelectedTags(selectedTags.filter(id => id !== tagId));
                            }}
                          >
                            {tag.name}
                          </Chip>
                        ) : null;
                      })
                    )}
                  </div>
                  <Select
                    placeholder="Добавить тег"
                    selectedKeys={[]}
                    onSelectionChange={(keys) => {
                      const selected = Array.from(keys)[0] as string;
                      if (selected && !selectedTags.includes(selected)) {
                        setSelectedTags([...selectedTags, selected]);
                      }
                    }}
                    variant="bordered"
                    isDisabled={isLoading}
                    size="sm"
                    className="mt-2"
                  >
                    {tags.filter(tag => !selectedTags.includes(tag.id.toString())).map((tag) => (
                      <SelectItem key={tag.id.toString()}>
                        {tag.name}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
              </div>

              {/* Загрузка медиафайлов */}
              <div>
                <label className="text-sm font-medium text-default-700 mb-2 block">
                  Медиафайлы
                </label>
                <FileUpload
                  accept="image/*,video/*"
                  multiple={true}
                  onChange={setMediaFiles}
                  value={mediaFiles}
                  maxFiles={10}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button 
                color="danger" 
                variant="light" 
                onPress={onClose}
                isDisabled={isLoading}
              >
                Отмена
              </Button>
              <Button 
                color="primary" 
                onPress={onCreateNews}
                isDisabled={!title.trim() || !content.trim() || !selectedNewsType || isLoading}
                isLoading={isLoading}
              >
                Создать
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CreateNewsModal;
