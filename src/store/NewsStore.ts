import { makeAutoObservable, runInAction } from "mobx";
import { 
    fetchNews, 
    fetchNewsById, 
    createNews, 
    updateNews, 
    deleteNews, 
    deleteNewsMedia
} from "@/http/newsAPI";
import type { News, NewsFilters, NewsResponse } from "@/types/types";

export default class NewsStore {
    _news: News[] = [];
    _currentNews: News | null = null;
    _loading = false;
    _totalCount = 0;
    _currentPage = 1;
    _totalPages = 0;
    _error = '';
    _isServerError = false;

    constructor() {
        makeAutoObservable(this);
    }

    setNews(news: News[]) {
        this._news = news;
    }

    setCurrentNews(news: News | null) {
        this._currentNews = news;
    }

    setLoading(loading: boolean) {
        this._loading = loading;
    }

    setTotalCount(count: number) {
        this._totalCount = count;
    }

    setCurrentPage(page: number) {
        this._currentPage = page;
    }

    setTotalPages(pages: number) {
        this._totalPages = pages;
    }

    setError(error: string) {
        this._error = error;
    }

    setServerError(flag: boolean) {
        this._isServerError = flag;
    }

    async fetchNews(filters?: NewsFilters) {
        try {
            this.setLoading(true);
            this.setError('');
            this.setServerError(false);

            const response: NewsResponse = await fetchNews(filters);
            
            runInAction(() => {
                this.setNews(response.news);
                this.setTotalCount(response.totalCount);
                this.setCurrentPage(response.currentPage);
                this.setTotalPages(response.totalPages);
            });
        } catch (error: any) {
            console.error("Error fetching news:", error);
            runInAction(() => {
                this.setError(error.response?.data?.message || 'Failed to fetch news');
                this.setServerError(true);
            });
        } finally {
            runInAction(() => {
                this.setLoading(false);
            });
        }
    }

    async fetchNewsById(id: number) {
        try {
            this.setLoading(true);
            this.setError('');
            this.setServerError(false);

            const news: News = await fetchNewsById(id);
            
            runInAction(() => {
                this.setCurrentNews(news);
            });
        } catch (error: any) {
            console.error("Error fetching news by id:", error);
            runInAction(() => {
                this.setError(error.response?.data?.message || 'Failed to fetch news');
                this.setServerError(true);
            });
        } finally {
            runInAction(() => {
                this.setLoading(false);
            });
        }
    }

    async createNews(newsData: FormData) {
        try {
            this.setLoading(true);
            this.setError('');
            this.setServerError(false);

            const news: News = await createNews(newsData);
            
            runInAction(() => {
                this._news.unshift(news);
                this.setTotalCount(this._totalCount + 1);
            });

            return news;
        } catch (error: any) {
            console.error("Error creating news:", error);
            runInAction(() => {
                this.setError(error.response?.data?.message || 'Failed to create news');
                this.setServerError(true);
            });
            throw error;
        } finally {
            runInAction(() => {
                this.setLoading(false);
            });
        }
    }

    async updateNews(id: number, newsData: FormData) {
        try {
            this.setLoading(true);
            this.setError('');
            this.setServerError(false);

            const updatedNews: News = await updateNews(id, newsData);
            
            runInAction(() => {
                const index = this._news.findIndex(news => news.id === id);
                if (index !== -1) {
                    this._news[index] = updatedNews;
                }
                if (this._currentNews?.id === id) {
                    this.setCurrentNews(updatedNews);
                }
            });

            return updatedNews;
        } catch (error: any) {
            console.error("Error updating news:", error);
            runInAction(() => {
                this.setError(error.response?.data?.message || 'Failed to update news');
                this.setServerError(true);
            });
            throw error;
        } finally {
            runInAction(() => {
                this.setLoading(false);
            });
        }
    }

    async deleteNews(id: number) {
        try {
            this.setLoading(true);
            this.setError('');
            this.setServerError(false);

            await deleteNews(id);
            
            runInAction(() => {
                this._news = this._news.filter(news => news.id !== id);
                this.setTotalCount(this._totalCount - 1);
                if (this._currentNews?.id === id) {
                    this.setCurrentNews(null);
                }
            });
        } catch (error: any) {
            console.error("Error deleting news:", error);
            runInAction(() => {
                this.setError(error.response?.data?.message || 'Failed to delete news');
                this.setServerError(true);
            });
            throw error;
        } finally {
            runInAction(() => {
                this.setLoading(false);
            });
        }
    }

    async deleteNewsMedia(newsId: number, mediaId: number) {
        try {
            this.setError('');
            this.setServerError(false);

            await deleteNewsMedia(newsId, mediaId);
            
            runInAction(() => {
                if (this._currentNews?.id === newsId) {
                    this._currentNews.mediaFiles = this._currentNews.mediaFiles?.filter(
                        media => media.id !== mediaId
                    );
                }
            });
        } catch (error: any) {
            console.error("Error deleting news media:", error);
            runInAction(() => {
                this.setError(error.response?.data?.message || 'Failed to delete media');
                this.setServerError(true);
            });
            throw error;
        }
    }

    // Геттеры
    get news() {
        return this._news;
    }

    get currentNews() {
        return this._currentNews;
    }

    get loading() {
        return this._loading;
    }

    get totalCount() {
        return this._totalCount;
    }

    get currentPage() {
        return this._currentPage;
    }

    get totalPages() {
        return this._totalPages;
    }

    get error() {
        return this._error;
    }

    get isServerError() {
        return this._isServerError;
    }

    // Вспомогательные методы
    getNewsById(id: number): News | undefined {
        return this._news.find(news => news.id === id);
    }

    getPublishedNews(): News[] {
        return this._news.filter(news => news.status === 'PUBLISHED');
    }

    getDraftNews(): News[] {
        return this._news.filter(news => news.status === 'DRAFT');
    }

    getArchivedNews(): News[] {
        return this._news.filter(news => news.status === 'ARCHIVED');
    }

    clearError() {
        this.setError('');
        this.setServerError(false);
    }

    clearCurrentNews() {
        this.setCurrentNews(null);
    }
}
