import { makeAutoObservable } from "mobx";
import { mainBannerAPI, type MainBanner, type MainBannerResponse } from "@/http/mainBannerAPI";

export default class MainBannerStore {
  mainBanners: MainBanner[] = [];
  activeMainBanner: MainBanner | null = null;
  currentMainBanner: MainBanner | null = null;
  isLoading = false;
  error = "";
  totalCount = 0;
  currentPage = 1;
  totalPages = 0;

  constructor() {
    makeAutoObservable(this);
  }

  setLoading(loading: boolean) {
    this.isLoading = loading;
  }

  setError(error: string) {
    this.error = error;
  }

  setMainBanners(mainBanners: MainBanner[]) {
    this.mainBanners = mainBanners;
  }

  setActiveMainBanner(mainBanner: MainBanner | null) {
    this.activeMainBanner = mainBanner;
  }

  setCurrentMainBanner(mainBanner: MainBanner | null) {
    this.currentMainBanner = mainBanner;
  }

  setPagination(data: { totalCount: number; currentPage: number; totalPages: number }) {
    this.totalCount = data.totalCount;
    this.currentPage = data.currentPage;
    this.totalPages = data.totalPages;
  }

  // Получить все баннеры
  async fetchMainBanners(page: number = 1, limit: number = 20) {
    try {
      this.setLoading(true);
      this.setError("");
      const response: MainBannerResponse = await mainBannerAPI.getAll(page, limit);
      this.setMainBanners(response.mainBanners);
      this.setPagination({
        totalCount: response.totalCount,
        currentPage: response.currentPage,
        totalPages: response.totalPages,
      });
    } catch (error: any) {
      this.setError(error.response?.data?.message || "Ошибка при загрузке баннеров");
      console.error("Error fetching main banners:", error);
    } finally {
      this.setLoading(false);
    }
  }

  // Получить активный баннер
  async fetchActiveMainBanner() {
    try {
      this.setLoading(true);
      this.setError("");
      const response = await mainBannerAPI.getActive();
      this.setActiveMainBanner(response);
    } catch (error: any) {
      this.setError(error.response?.data?.message || "Ошибка при загрузке активного баннера");
      console.error("Error fetching active main banner:", error);
    } finally {
      this.setLoading(false);
    }
  }

  // Получить один баннер
  async fetchMainBanner(id: number) {
    try {
      this.setLoading(true);
      this.setError("");
      const response = await mainBannerAPI.getOne(id);
      this.setCurrentMainBanner(response);
    } catch (error: any) {
      this.setError(error.response?.data?.message || "Ошибка при загрузке баннера");
      console.error("Error fetching main banner:", error);
    } finally {
      this.setLoading(false);
    }
  }

  // Создать баннер
  async createMainBanner(formData: FormData) {
    try {
      this.setLoading(true);
      this.setError("");
      const response = await mainBannerAPI.create(formData);
      this.mainBanners.unshift(response);
      this.setCurrentMainBanner(response);
      return response;
    } catch (error: any) {
      this.setError(error.response?.data?.message || "Ошибка при создании баннера");
      console.error("Error creating main banner:", error);
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  // Обновить баннер
  async updateMainBanner(id: number, formData: FormData) {
    try {
      this.setLoading(true);
      this.setError("");
      const response = await mainBannerAPI.update(id, formData);
      
      // Обновляем баннер в списке
      const index = this.mainBanners.findIndex(banner => banner.id === id);
      if (index !== -1) {
        this.mainBanners[index] = response;
      }
      
      // Обновляем текущий баннер
      if (this.currentMainBanner?.id === id) {
        this.setCurrentMainBanner(response);
      }
      
      // Обновляем активный баннер если это он
      if (this.activeMainBanner?.id === id) {
        this.setActiveMainBanner(response);
      }
      
      return response;
    } catch (error: any) {
      this.setError(error.response?.data?.message || "Ошибка при обновлении баннера");
      console.error("Error updating main banner:", error);
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  // Удалить баннер
  async deleteMainBanner(id: number) {
    try {
      this.setLoading(true);
      this.setError("");
      await mainBannerAPI.delete(id);
      
      // Удаляем баннер из списка
      this.mainBanners = this.mainBanners.filter(banner => banner.id !== id);
      
      // Очищаем текущий баннер если это он
      if (this.currentMainBanner?.id === id) {
        this.setCurrentMainBanner(null);
      }
      
      // Очищаем активный баннер если это он
      if (this.activeMainBanner?.id === id) {
        this.setActiveMainBanner(null);
      }
      
      this.totalCount--;
    } catch (error: any) {
      this.setError(error.response?.data?.message || "Ошибка при удалении баннера");
      console.error("Error deleting main banner:", error);
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  // Удалить медиафайл баннера
  async deleteMainBannerMedia(mainBannerId: number, mediaId: number) {
    try {
      this.setLoading(true);
      this.setError("");
      await mainBannerAPI.deleteMedia(mainBannerId, mediaId);
      
      // Обновляем баннеры, удаляя медиафайл
      this.mainBanners = this.mainBanners.map(banner => {
        if (banner.id === mainBannerId) {
          return {
            ...banner,
            mediaFiles: banner.mediaFiles.filter(media => media.id !== mediaId)
          };
        }
        return banner;
      });
      
      // Обновляем текущий баннер
      if (this.currentMainBanner?.id === mainBannerId) {
        this.setCurrentMainBanner({
          ...this.currentMainBanner,
          mediaFiles: this.currentMainBanner.mediaFiles.filter(media => media.id !== mediaId)
        });
      }
      
      // Обновляем активный баннер
      if (this.activeMainBanner?.id === mainBannerId) {
        this.setActiveMainBanner({
          ...this.activeMainBanner,
          mediaFiles: this.activeMainBanner.mediaFiles.filter(media => media.id !== mediaId)
        });
      }
    } catch (error: any) {
      this.setError(error.response?.data?.message || "Ошибка при удалении медиафайла");
      console.error("Error deleting main banner media:", error);
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  // Очистить ошибки
  clearError() {
    this.setError("");
  }

  // Очистить текущий баннер
  clearCurrentMainBanner() {
    this.setCurrentMainBanner(null);
  }
}
