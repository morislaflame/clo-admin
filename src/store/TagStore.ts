import { makeAutoObservable, runInAction } from "mobx";
import { 
    fetchTags, 
    fetchTagsWithCounts,
    fetchTagById, 
    createTag, 
    updateTag, 
    deleteTag
} from "@/http/newsAPI";
import type { Tag, TagResponse } from "@/types/types";

export default class TagStore {
    _tags: Tag[] = [];
    _tagsWithCounts: Tag[] = [];
    _currentTag: Tag | null = null;
    _loading = false;
    _totalCount = 0;
    _currentPage = 1;
    _totalPages = 0;
    _error = '';
    _isServerError = false;

    constructor() {
        makeAutoObservable(this);
    }

    setTags(tags: Tag[]) {
        this._tags = tags;
    }

    setTagsWithCounts(tags: Tag[]) {
        this._tagsWithCounts = tags;
    }

    setCurrentTag(tag: Tag | null) {
        this._currentTag = tag;
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

    async fetchTags(page?: number, limit?: number, search?: string) {
        try {
            this.setLoading(true);
            this.setError('');
            this.setServerError(false);

            const response: TagResponse = await fetchTags(page, limit, search);
            
            runInAction(() => {
                this.setTags(response.tags);
                this.setTotalCount(response.totalCount);
                this.setCurrentPage(response.currentPage);
                this.setTotalPages(response.totalPages);
            });
        } catch (error: any) {
            console.error("Error fetching tags:", error);
            runInAction(() => {
                this.setError(error.response?.data?.message || 'Failed to fetch tags');
                this.setServerError(true);
            });
        } finally {
            runInAction(() => {
                this.setLoading(false);
            });
        }
    }

    async fetchTagsWithCounts() {
        try {
            this.setError('');
            this.setServerError(false);

            const tags: Tag[] = await fetchTagsWithCounts();
            
            runInAction(() => {
                this.setTagsWithCounts(tags);
            });
        } catch (error: any) {
            console.error("Error fetching tags with counts:", error);
            runInAction(() => {
                this.setError(error.response?.data?.message || 'Failed to fetch tags with counts');
                this.setServerError(true);
            });
        }
    }

    async fetchTagById(id: number) {
        try {
            this.setLoading(true);
            this.setError('');
            this.setServerError(false);

            const tag: Tag = await fetchTagById(id);
            
            runInAction(() => {
                this.setCurrentTag(tag);
            });
        } catch (error: any) {
            console.error("Error fetching tag by id:", error);
            runInAction(() => {
                this.setError(error.response?.data?.message || 'Failed to fetch tag');
                this.setServerError(true);
            });
        } finally {
            runInAction(() => {
                this.setLoading(false);
            });
        }
    }

    async createTag(tagData: { name: string; color?: string }) {
        try {
            this.setLoading(true);
            this.setError('');
            this.setServerError(false);

            const tag: Tag = await createTag(tagData);
            
            runInAction(() => {
                this._tags.unshift(tag);
                this.setTotalCount(this._totalCount + 1);
            });

            return tag;
        } catch (error: any) {
            console.error("Error creating tag:", error);
            runInAction(() => {
                this.setError(error.response?.data?.message || 'Failed to create tag');
                this.setServerError(true);
            });
            throw error;
        } finally {
            runInAction(() => {
                this.setLoading(false);
            });
        }
    }

    async updateTag(id: number, tagData: { name?: string; color?: string }) {
        try {
            this.setLoading(true);
            this.setError('');
            this.setServerError(false);

            const updatedTag: Tag = await updateTag(id, tagData);
            
            runInAction(() => {
                const index = this._tags.findIndex(tag => tag.id === id);
                if (index !== -1) {
                    this._tags[index] = updatedTag;
                }
                if (this._currentTag?.id === id) {
                    this.setCurrentTag(updatedTag);
                }
            });

            return updatedTag;
        } catch (error: any) {
            console.error("Error updating tag:", error);
            runInAction(() => {
                this.setError(error.response?.data?.message || 'Failed to update tag');
                this.setServerError(true);
            });
            throw error;
        } finally {
            runInAction(() => {
                this.setLoading(false);
            });
        }
    }

    async deleteTag(id: number) {
        try {
            this.setLoading(true);
            this.setError('');
            this.setServerError(false);

            await deleteTag(id);
            
            runInAction(() => {
                this._tags = this._tags.filter(tag => tag.id !== id);
                this.setTotalCount(this._totalCount - 1);
                if (this._currentTag?.id === id) {
                    this.setCurrentTag(null);
                }
            });
        } catch (error: any) {
            console.error("Error deleting tag:", error);
            runInAction(() => {
                this.setError(error.response?.data?.message || 'Failed to delete tag');
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
    get tags() {
        return this._tags;
    }

    get tagsWithCounts() {
        return this._tagsWithCounts;
    }

    get currentTag() {
        return this._currentTag;
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
    getTagById(id: number): Tag | undefined {
        return this._tags.find(tag => tag.id === id);
    }

    getTagsByName(name: string): Tag[] {
        return this._tags.filter(tag => 
            tag.name.toLowerCase().includes(name.toLowerCase())
        );
    }

    getTagsByColor(color: string): Tag[] {
        return this._tags.filter(tag => tag.color === color);
    }

    clearError() {
        this.setError('');
        this.setServerError(false);
    }

    clearCurrentTag() {
        this.setCurrentTag(null);
    }
}
