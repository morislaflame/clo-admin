import { $authHost } from "./index";

export interface MainBanner {
  id: number;
  title?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  mediaFiles: MediaFile[];
}

export interface MediaFile {
  id: number;
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
  bucket: string;
  url: string;
  entityType: string;
  entityId: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMainBannerData {
  title?: string;
  isActive?: boolean;
}

export interface UpdateMainBannerData {
  title?: string;
  isActive?: boolean;
  deletedMediaIds?: number[];
}

export interface MainBannerResponse {
  mainBanners: MainBanner[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export const mainBannerAPI = {
  // Получить все баннеры (для админов)
  async getAll(page: number = 1, limit: number = 20): Promise<MainBannerResponse> {
    const { data } = await $authHost.get(`api/main-banner?page=${page}&limit=${limit}`);
    return data;
  },

  // Получить активный баннер (публичный)
  async getActive(): Promise<MainBanner> {
    const { data } = await $authHost.get("api/main-banner/active");
    return data;
  },

  // Получить один баннер
  async getOne(id: number): Promise<MainBanner> {
    const { data } = await $authHost.get(`api/main-banner/${id}`);
    return data;
  },

  // Создать баннер
  async create(formData: FormData): Promise<MainBanner> {
    const { data } = await $authHost.post("api/main-banner", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  },

  // Обновить баннер
  async update(id: number, formData: FormData): Promise<MainBanner> {
    const { data } = await $authHost.put(`api/main-banner/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  },

  // Удалить баннер
  async delete(id: number): Promise<{ message: string }> {
    const { data } = await $authHost.delete(`api/main-banner/${id}`);
    return data;
  },

  // Удалить медиафайл баннера
  async deleteMedia(mainBannerId: number, mediaId: number): Promise<{ message: string }> {
    const { data } = await $authHost.delete(`api/main-banner/${mainBannerId}/media/${mediaId}`);
    return data;
  },
};
