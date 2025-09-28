import { $authHost, $host } from "./index";
import type { 
  Collection, 
  Product
} from "@/types/types";

// Интерфейсы для коллекций
export interface CollectionFilters {
  page?: number;
  limit?: number;
}

export interface CollectionResponse {
  collections: Collection[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export interface CollectionProductsResponse {
  products: Product[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

// Коллекции
export const fetchCollections = async (filters?: CollectionFilters): Promise<CollectionResponse> => {
  const { data } = await $host.get('api/collection', { params: filters });
  return data;
};

export const fetchCollectionById = async (id: number): Promise<Collection> => {
  const { data } = await $host.get(`api/collection/${id}`);
  return data;
};

export const createCollection = async (collectionData: FormData): Promise<Collection> => {
  const { data } = await $authHost.post('api/collection', collectionData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

export const updateCollection = async (id: number, collectionData: FormData): Promise<Collection> => {
  const { data } = await $authHost.put(`api/collection/${id}`, collectionData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

export const deleteCollection = async (id: number): Promise<{ message: string }> => {
  const { data } = await $authHost.delete(`api/collection/${id}`);
  return data;
};

export const deleteCollectionMedia = async (collectionId: number, mediaId: number): Promise<{ message: string }> => {
  const { data } = await $authHost.delete(`api/collection/${collectionId}/media/${mediaId}`);
  return data;
};

// Управление продуктами в коллекции
export const addProductToCollection = async (collectionId: number, productId: number): Promise<{ message: string }> => {
  const { data } = await $authHost.post(`api/collection/${collectionId}/products/${productId}`);
  return data;
};

export const removeProductFromCollection = async (collectionId: number, productId: number): Promise<{ message: string }> => {
  const { data } = await $authHost.delete(`api/collection/${collectionId}/products/${productId}`);
  return data;
};

export const fetchCollectionProducts = async (collectionId: number, filters?: { page?: number; limit?: number }): Promise<CollectionProductsResponse> => {
  const { data } = await $host.get(`api/collection/${collectionId}/products`, { params: filters });
  return data;
};

// Получение продуктов, которые не добавлены ни в одну коллекцию
export const fetchAvailableProducts = async (filters?: { page?: number; limit?: number }): Promise<CollectionProductsResponse> => {
  const { data } = await $host.get('api/product', { 
    params: { 
      ...filters, 
      notInCollection: true 
    } 
  });
  return data;
};
