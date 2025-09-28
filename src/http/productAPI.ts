import { $authHost, $host } from "./index";
import type { 
  Product, 
  ClothingType, 
  Color, 
  Size
} from "@/types/types";

// Интерфейсы для продуктов
export interface ProductFilters {
  gender?: string;
  size?: string;
  color?: string;
  status?: string;
  clothingTypeId?: number;
  collectionId?: number;
  minPrice?: number;
  maxPrice?: number;
  currency?: string;
  page?: number;
  limit?: number;
}

export interface ProductResponse {
  products: Product[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

// Продукты
export const fetchProducts = async (filters?: ProductFilters): Promise<ProductResponse> => {
  const { data } = await $host.get('api/product', { params: filters });
  return data;
};

export const fetchProductById = async (id: number): Promise<Product> => {
  const { data } = await $host.get(`api/product/${id}`);
  return data;
};

export const createProduct = async (productData: FormData): Promise<Product> => {
  const { data } = await $authHost.post('api/product', productData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

export const updateProduct = async (id: number, productData: FormData): Promise<Product> => {
  const { data } = await $authHost.put(`api/product/${id}`, productData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

export const deleteProduct = async (id: number): Promise<{ message: string }> => {
  const { data } = await $authHost.delete(`api/product/${id}`);
  return data;
};

export const deleteProductMedia = async (productId: number, mediaId: number): Promise<{ message: string }> => {
  const { data } = await $authHost.delete(`api/product/${productId}/media/${mediaId}`);
  return data;
};

// Типы одежды
export const fetchClothingTypes = async (): Promise<ClothingType[]> => {
  const { data } = await $host.get('api/clothing-type');
  return data;
};

export const fetchClothingTypeById = async (id: number): Promise<ClothingType> => {
  const { data } = await $host.get(`api/clothing-type/${id}`);
  return data;
};

export const createClothingType = async (clothingTypeData: { name: string }): Promise<ClothingType> => {
  const { data } = await $authHost.post('api/clothing-type', clothingTypeData);
  return data;
};

export const updateClothingType = async (id: number, clothingTypeData: { name: string }): Promise<ClothingType> => {
  const { data } = await $authHost.put(`api/clothing-type/${id}`, clothingTypeData);
  return data;
};

export const deleteClothingType = async (id: number): Promise<{ message: string }> => {
  const { data } = await $authHost.delete(`api/clothing-type/${id}`);
  return data;
};

export const createDefaultClothingTypes = async (): Promise<{ message: string; createdTypes: ClothingType[] }> => {
  const { data } = await $authHost.post('api/clothing-type/create-defaults');
  return data;
};

export const getClothingTypeStatistics = async (): Promise<unknown[]> => {
  const { data } = await $host.get('api/clothing-type/statistics');
  return data;
};

// Цвета
export const fetchColors = async (): Promise<Color[]> => {
  const { data } = await $host.get('api/color');
  return data;
};

export const createColor = async (colorData: { name: string; hexCode?: string }): Promise<Color> => {
  const { data } = await $authHost.post('api/color', colorData);
  return data;
};

export const updateColor = async (id: number, colorData: { name?: string; hexCode?: string }): Promise<Color> => {
  const { data } = await $authHost.put(`api/color/${id}`, colorData);
  return data;
};

export const deleteColor = async (id: number): Promise<{ message: string }> => {
  const { data } = await $authHost.delete(`api/color/${id}`);
  return data;
};

export const createDefaultColors = async (): Promise<{ message: string; createdColors: Color[] }> => {
  const { data } = await $authHost.post('api/color/create-defaults');
  return data;
};

export const addColorsToProduct = async (productId: number, colorIds: number[]): Promise<Product> => {
  const { data } = await $authHost.post(`api/color/product/${productId}`, { colorIds });
  return data;
};

export const removeColorFromProduct = async (productId: number, colorId: number): Promise<{ message: string }> => {
  const { data } = await $authHost.delete(`api/color/product/${productId}/color/${colorId}`);
  return data;
};

// Размеры
export const fetchSizes = async (): Promise<Size[]> => {
  const { data } = await $host.get('api/size');
  return data;
};

export const createSize = async (sizeData: { name: string }): Promise<Size> => {
  const { data } = await $authHost.post('api/size', sizeData);
  return data;
};

export const deleteSize = async (id: number): Promise<{ message: string }> => {
  const { data } = await $authHost.delete(`api/size/${id}`);
  return data;
};

export const createDefaultSizes = async (): Promise<{ message: string; createdSizes: Size[] }> => {
  const { data } = await $authHost.post('api/size/create-defaults');
  return data;
};

export const addSizesToProduct = async (productId: number, sizeIds: number[]): Promise<Product> => {
  const { data } = await $authHost.post(`api/size/product/${productId}`, { sizeIds });
  return data;
};

export const removeSizeFromProduct = async (productId: number, sizeId: number): Promise<{ message: string }> => {
  const { data } = await $authHost.delete(`api/size/product/${productId}/size/${sizeId}`);
  return data;
};
