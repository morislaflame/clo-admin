import { makeAutoObservable, runInAction } from "mobx";
import { 
    fetchNewsTypes, 
    fetchNewsTypesWithCounts,
    fetchNewsTypeById, 
    createNewsType, 
    updateNewsType, 
    deleteNewsType
} from "@/http/newsAPI";
import type { NewsType, NewsTypeResponse } from "@/types/types";

export default class NewsTypeStore {
    _newsTypes: NewsType[] = [];
    _newsTypesWithCounts: NewsType[] = [];
    _currentNewsType: NewsType | null = null;
    _loading = false;
    _totalCount = 0;
    _currentPage = 1;
    _totalPages = 0;
    _error = '';
    _isServerError = false;

    constructor() {
        makeAutoObservable(this);
    }

    setNewsTypes(newsTypes: NewsType[]) {
        this._newsTypes = newsTypes;
    }

    setNewsTypesWithCounts(newsTypes: NewsType[]) {
        this._newsTypesWithCounts = newsTypes;
    }

    setCurrentNewsType(newsType: NewsType | null) {
        this._currentNewsType = newsType;
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

    async fetchNewsTypes(page?: number, limit?: number, search?: string) {
        try {
            this.setLoading(true);
            this.setError('');
            this.setServerError(false);

            const response: NewsTypeResponse = await fetchNewsTypes(page, limit, search);
            
            runInAction(() => {
                this.setNewsTypes(response.newsTypes);
                this.setTotalCount(response.totalCount);
                this.setCurrentPage(response.currentPage);
                this.setTotalPages(response.totalPages);
            });
        } catch (error: any) {
            console.error("Error fetching news types:", error);
            runInAction(() => {
                this.setError(error.response?.data?.message || 'Failed to fetch news types');
                this.setServerError(true);
            });
        } finally {
            runInAction(() => {
                this.setLoading(false);
            });
        }
    }

    async fetchNewsTypesWithCounts() {
        try {
            this.setError('');
            this.setServerError(false);

            const newsTypes: NewsType[] = await fetchNewsTypesWithCounts();
            
            runInAction(() => {
                this.setNewsTypesWithCounts(newsTypes);
            });
        } catch (error: any) {
            console.error("Error fetching news types with counts:", error);
            runInAction(() => {
                this.setError(error.response?.data?.message || 'Failed to fetch news types with counts');
                this.setServerError(true);
            });
        }
    }

    async fetchNewsTypeById(id: number) {
        try {
            this.setLoading(true);
            this.setError('');
            this.setServerError(false);

            const newsType: NewsType = await fetchNewsTypeById(id);
            
            runInAction(() => {
                this.setCurrentNewsType(newsType);
            });
        } catch (error: any) {
            console.error("Error fetching news type by id:", error);
            runInAction(() => {
                this.setError(error.response?.data?.message || 'Failed to fetch news type');
                this.setServerError(true);
            });
        } finally {
            runInAction(() => {
                this.setLoading(false);
            });
        }
    }

    async createNewsType(newsTypeData: { name: string; description?: string }) {
        try {
            this.setLoading(true);
            this.setError('');
            this.setServerError(false);

            const newsType: NewsType = await createNewsType(newsTypeData);
            
            runInAction(() => {
                this._newsTypes.unshift(newsType);
                this.setTotalCount(this._totalCount + 1);
            });

            return newsType;
        } catch (error: any) {
            console.error("Error creating news type:", error);
            runInAction(() => {
                this.setError(error.response?.data?.message || 'Failed to create news type');
                this.setServerError(true);
            });
            throw error;
        } finally {
            runInAction(() => {
                this.setLoading(false);
            });
        }
    }

    async updateNewsType(id: number, newsTypeData: { name?: string; description?: string }) {
        try {
            this.setLoading(true);
            this.setError('');
            this.setServerError(false);

            const updatedNewsType: NewsType = await updateNewsType(id, newsTypeData);
            
            runInAction(() => {
                const index = this._newsTypes.findIndex(newsType => newsType.id === id);
                if (index !== -1) {
                    this._newsTypes[index] = updatedNewsType;
                }
                if (this._currentNewsType?.id === id) {
                    this.setCurrentNewsType(updatedNewsType);
                }
            });

            return updatedNewsType;
        } catch (error: any) {
            console.error("Error updating news type:", error);
            runInAction(() => {
                this.setError(error.response?.data?.message || 'Failed to update news type');
                this.setServerError(true);
            });
            throw error;
        } finally {
            runInAction(() => {
                this.setLoading(false);
            });
        }
    }

    async deleteNewsType(id: number) {
        try {
            this.setLoading(true);
            this.setError('');
            this.setServerError(false);

            await deleteNewsType(id);
            
            runInAction(() => {
                this._newsTypes = this._newsTypes.filter(newsType => newsType.id !== id);
                this.setTotalCount(this._totalCount - 1);
                if (this._currentNewsType?.id === id) {
                    this.setCurrentNewsType(null);
                }
            });
        } catch (error: any) {
            console.error("Error deleting news type:", error);
            runInAction(() => {
                this.setError(error.response?.data?.message || 'Failed to delete news type');
                this.setServerError(true);
            });
            throw error;
        } finally {
            runInAction(() => {
                this.setLoading(false);
            });
        }
    }

    // Геттеры
    get newsTypes() {
        return this._newsTypes;
    }

    get newsTypesWithCounts() {
        return this._newsTypesWithCounts;
    }

    get currentNewsType() {
        return this._currentNewsType;
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
    getNewsTypeById(id: number): NewsType | undefined {
        return this._newsTypes.find(newsType => newsType.id === id);
    }

    getNewsTypesByName(name: string): NewsType[] {
        return this._newsTypes.filter(newsType => 
            newsType.name.toLowerCase().includes(name.toLowerCase())
        );
    }

    clearError() {
        this.setError('');
        this.setServerError(false);
    }

    clearCurrentNewsType() {
        this.setCurrentNewsType(null);
    }
}
