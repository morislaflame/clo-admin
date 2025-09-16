import { makeAutoObservable, runInAction } from "mobx";
import { 
    fetchSizes, 
    createSize, 
    deleteSize,
    createDefaultSizes,
    addSizesToProduct,
    removeSizeFromProduct
} from "@/http/productAPI";
import type { Size, Product } from "@/types/types";

export default class SizeStore {
    _sizes: Size[] = [];
    _currentSize: Size | null = null;
    _loading = false;
    _error = '';
    _isServerError = false;

    constructor() {
        makeAutoObservable(this);
    }

    setSizes(sizes: Size[]) {
        this._sizes = sizes;
    }

    setCurrentSize(size: Size | null) {
        this._currentSize = size;
    }

    setLoading(loading: boolean) {
        this._loading = loading;
    }

    setError(error: string) {
        this._error = error;
    }

    setServerError(flag: boolean) {
        this._isServerError = flag;
    }

    async fetchSizes() {
        try {
            this.setLoading(true);
            this.setError('');
            this.setServerError(false);

            const sizes: Size[] = await fetchSizes();
            
            runInAction(() => {
                this.setSizes(sizes);
            });
        } catch (error: unknown) {
            console.error("Error fetching sizes:", error);
            runInAction(() => {
                this.setError(error instanceof Error ? error.message : 'Failed to fetch sizes');
                this.setServerError(true);
            });
        } finally {
            runInAction(() => {
                this.setLoading(false);
            });
        }
    }

    async createSize(sizeData: { name: string }) {
        try {
            this.setLoading(true);
            this.setError('');
            this.setServerError(false);

            const size: Size = await createSize(sizeData);
            
            runInAction(() => {
                this._sizes.unshift(size);
            });

            return size;
        } catch (error: unknown) {
            console.error("Error creating size:", error);
            runInAction(() => {
                this.setError(error instanceof Error ? error.message : 'Failed to create size');
                this.setServerError(true);
            });
            throw error;
        } finally {
            runInAction(() => {
                this.setLoading(false);
            });
        }
    }

    async deleteSize(id: number) {
        try {
            this.setLoading(true);
            this.setError('');
            this.setServerError(false);

            await deleteSize(id);
            
            runInAction(() => {
                this._sizes = this._sizes.filter(size => size.id !== id);
                if (this._currentSize?.id === id) {
                    this.setCurrentSize(null);
                }
            });
        } catch (error: unknown) {
            console.error("Error deleting size:", error);
            runInAction(() => {
                this.setError(error instanceof Error ? error.message : 'Failed to delete size');
                this.setServerError(true);
            });
            throw error;
        } finally {
            runInAction(() => {
                this.setLoading(false);
            });
        }
    }

    async createDefaultSizes() {
        try {
            this.setLoading(true);
            this.setError('');
            this.setServerError(false);

            const result = await createDefaultSizes();
            
            runInAction(() => {
                // Обновляем список размеров
                this.fetchSizes();
            });

            return result;
        } catch (error: unknown) {
            console.error("Error creating default sizes:", error);
            runInAction(() => {
                this.setError(error instanceof Error ? error.message : 'Failed to create default sizes');
                this.setServerError(true);
            });
            throw error;
        } finally {
            runInAction(() => {
                this.setLoading(false);
            });
        }
    }

    async addSizesToProduct(productId: number, sizeIds: number[]) {
        try {
            this.setError('');
            this.setServerError(false);

            const updatedProduct: Product = await addSizesToProduct(productId, sizeIds);
            return updatedProduct;
        } catch (error: unknown) {
            console.error("Error adding sizes to product:", error);
            runInAction(() => {
                this.setError(error instanceof Error ? error.message : 'Failed to add sizes to product');
                this.setServerError(true);
            });
            throw error;
        }
    }

    async removeSizeFromProduct(productId: number, sizeId: number) {
        try {
            this.setError('');
            this.setServerError(false);

            await removeSizeFromProduct(productId, sizeId);
        } catch (error: unknown) {
            console.error("Error removing size from product:", error);
            runInAction(() => {
                this.setError(error instanceof Error ? error.message : 'Failed to remove size from product');
                this.setServerError(true);
            });
            throw error;
        }
    }

    // Геттеры
    get sizes() {
        return this._sizes;
    }

    get currentSize() {
        return this._currentSize;
    }

    get loading() {
        return this._loading;
    }

    get error() {
        return this._error;
    }

    get isServerError() {
        return this._isServerError;
    }

    // Вспомогательные методы
    getSizeById(id: number): Size | undefined {
        return this._sizes.find(size => size.id === id);
    }

    getSizesByName(name: string): Size[] {
        return this._sizes.filter(size => 
            size.name.toLowerCase().includes(name.toLowerCase())
        );
    }

    clearError() {
        this.setError('');
        this.setServerError(false);
    }

    clearCurrentSize() {
        this.setCurrentSize(null);
    }
}
