import { $authHost, $host } from "./index";
import type { 
    News, 
    NewsType, 
    Tag, 
    NewsFilters, 
    NewsResponse, 
    NewsTypeResponse, 
    TagResponse 
} from "@/types/types";

// Новости
export const fetchNews = async (filters?: NewsFilters): Promise<NewsResponse> => {
    const { data } = await $host.get('api/news', { params: filters });
    return data;
};

export const fetchNewsById = async (id: number): Promise<News> => {
    const { data } = await $host.get(`api/news/${id}`);
    return data;
};

export const createNews = async (newsData: FormData): Promise<News> => {
    const { data } = await $authHost.post('api/news', newsData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return data;
};

export const updateNews = async (id: number, newsData: FormData): Promise<News> => {
    const { data } = await $authHost.put(`api/news/${id}`, newsData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return data;
};

export const deleteNews = async (id: number): Promise<{ message: string }> => {
    const { data } = await $authHost.delete(`api/news/${id}`);
    return data;
};

export const deleteNewsMedia = async (newsId: number, mediaId: number): Promise<{ message: string }> => {
    const { data } = await $authHost.delete(`api/news/${newsId}/media/${mediaId}`);
    return data;
};

// Типы новостей
export const fetchNewsTypes = async (page?: number, limit?: number, search?: string): Promise<NewsTypeResponse> => {
    const { data } = await $host.get('api/news-type', { 
        params: { page, limit, search } 
    });
    return data;
};

export const fetchNewsTypesWithCounts = async (): Promise<NewsType[]> => {
    const { data } = await $host.get('api/news-type/counts');
    return data;
};

export const fetchNewsTypeById = async (id: number): Promise<NewsType> => {
    const { data } = await $host.get(`api/news-type/${id}`);
    return data;
};

export const createNewsType = async (newsTypeData: { name: string; description?: string }): Promise<NewsType> => {
    const { data } = await $authHost.post('api/news-type', newsTypeData);
    return data;
};

export const updateNewsType = async (id: number, newsTypeData: { name?: string; description?: string }): Promise<NewsType> => {
    const { data } = await $authHost.put(`api/news-type/${id}`, newsTypeData);
    return data;
};

export const deleteNewsType = async (id: number): Promise<{ message: string }> => {
    const { data } = await $authHost.delete(`api/news-type/${id}`);
    return data;
};

// Теги
export const fetchTags = async (page?: number, limit?: number, search?: string): Promise<TagResponse> => {
    const { data } = await $host.get('api/tag', { 
        params: { page, limit, search } 
    });
    return data;
};

export const fetchTagsWithCounts = async (): Promise<Tag[]> => {
    const { data } = await $host.get('api/tag/counts');
    return data;
};

export const fetchTagById = async (id: number): Promise<Tag> => {
    const { data } = await $host.get(`api/tag/${id}`);
    return data;
};

export const createTag = async (tagData: { name: string; color?: string }): Promise<Tag> => {
    const { data } = await $authHost.post('api/tag', tagData);
    return data;
};

export const updateTag = async (id: number, tagData: { name?: string; color?: string }): Promise<Tag> => {
    const { data } = await $authHost.put(`api/tag/${id}`, tagData);
    return data;
};

export const deleteTag = async (id: number): Promise<{ message: string }> => {
    const { data } = await $authHost.delete(`api/tag/${id}`);
    return data;
};
