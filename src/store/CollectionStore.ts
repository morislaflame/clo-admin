import { makeAutoObservable, runInAction } from "mobx";
import { 
    fetchCollections, 
    fetchCollectionById, 
    createCollection, 
    updateCollection, 
    deleteCollection, 
    deleteCollectionMedia,
    addProductToCollection,
    removeProductFromCollection,
    fetchCollectionProducts,
    fetchAvailableProducts,
    type CollectionFilters,
    type CollectionResponse,
    type CollectionProductsResponse
} from "@/http/collectionAPI";
import type { Collection, Product } from "@/types/types";

export default class CollectionStore {
    _collections: Collection[] = [];
    _currentCollection: Collection | null = null;
    _collectionProducts: Product[] = [];
    _loading = false;
    _totalCount = 0;
    _currentPage = 1;
    _totalPages = 0;
    _error = '';
    _isServerError = false;

    constructor() {
        makeAutoObservable(this);
    }

    setCollections(collections: Collection[]) {
        this._collections = collections;
    }

    setCurrentCollection(collection: Collection | null) {
        this._currentCollection = collection;
    }

    setCollectionProducts(products: Product[]) {
        this._collectionProducts = products;
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

    async fetchCollections(filters?: CollectionFilters) {
        try {
            this.setLoading(true);
            this.setError('');
            this.setServerError(false);

            const response: CollectionResponse = await fetchCollections(filters);
            
            runInAction(() => {
                this.setCollections(response.collections);
                this.setTotalCount(response.totalCount);
                this.setCurrentPage(response.currentPage);
                this.setTotalPages(response.totalPages);
            });
        } catch (error: unknown) {
            console.error("Error fetching collections:", error);
            runInAction(() => {
                this.setError(error instanceof Error ? error.message : 'Failed to fetch collections');
                this.setServerError(true);
            });
        } finally {
            runInAction(() => {
                this.setLoading(false);
            });
        }
    }

    async fetchCollectionById(id: number) {
        try {
            this.setLoading(true);
            this.setError('');
            this.setServerError(false);

            const collection: Collection = await fetchCollectionById(id);
            
            runInAction(() => {
                this.setCurrentCollection(collection);
            });
        } catch (error: unknown) {
            console.error("Error fetching collection by id:", error);
            runInAction(() => {
                this.setError(error instanceof Error ? error.message : 'Failed to fetch collection');
                this.setServerError(true);
            });
        } finally {
            runInAction(() => {
                this.setLoading(false);
            });
        }
    }

    async createCollection(collectionData: FormData) {
        try {
            this.setLoading(true);
            this.setError('');
            this.setServerError(false);

            const collection: Collection = await createCollection(collectionData);
            
            runInAction(() => {
                this._collections.unshift(collection);
                this.setTotalCount(this._totalCount + 1);
            });

            return collection;
        } catch (error: unknown) {
            console.error("Error creating collection:", error);
            runInAction(() => {
                this.setError(error instanceof Error ? error.message : 'Failed to create collection');
                this.setServerError(true);
            });
            throw error;
        } finally {
            runInAction(() => {
                this.setLoading(false);
            });
        }
    }

    async updateCollection(id: number, collectionData: FormData) {
        try {
            this.setLoading(true);
            this.setError('');
            this.setServerError(false);

            const updatedCollection: Collection = await updateCollection(id, collectionData);
            
            runInAction(() => {
                const index = this._collections.findIndex(collection => collection.id === id);
                if (index !== -1) {
                    this._collections[index] = updatedCollection;
                }
                if (this._currentCollection?.id === id) {
                    this.setCurrentCollection(updatedCollection);
                }
            });

            return updatedCollection;
        } catch (error: unknown) {
            console.error("Error updating collection:", error);
            runInAction(() => {
                this.setError(error instanceof Error ? error.message : 'Failed to update collection');
                this.setServerError(true);
            });
            throw error;
        } finally {
            runInAction(() => {
                this.setLoading(false);
            });
        }
    }

    async deleteCollection(id: number) {
        try {
            this.setLoading(true);
            this.setError('');
            this.setServerError(false);

            await deleteCollection(id);
            
            runInAction(() => {
                this._collections = this._collections.filter(collection => collection.id !== id);
                this.setTotalCount(this._totalCount - 1);
                if (this._currentCollection?.id === id) {
                    this.setCurrentCollection(null);
                }
            });
        } catch (error: unknown) {
            console.error("Error deleting collection:", error);
            runInAction(() => {
                this.setError(error instanceof Error ? error.message : 'Failed to delete collection');
                this.setServerError(true);
            });
            throw error;
        } finally {
            runInAction(() => {
                this.setLoading(false);
            });
        }
    }

    async deleteCollectionMedia(collectionId: number, mediaId: number) {
        try {
            this.setError('');
            this.setServerError(false);

            await deleteCollectionMedia(collectionId, mediaId);
            
            runInAction(() => {
                if (this._currentCollection?.id === collectionId) {
                    this._currentCollection.mediaFiles = this._currentCollection.mediaFiles?.filter(
                        media => media.id !== mediaId
                    );
                }
            });
        } catch (error: unknown) {
            console.error("Error deleting collection media:", error);
            runInAction(() => {
                this.setError(error instanceof Error ? error.message : 'Failed to delete media');
                this.setServerError(true);
            });
            throw error;
        }
    }

    async addProductToCollection(collectionId: number, productId: number) {
        try {
            this.setError('');
            this.setServerError(false);

            await addProductToCollection(collectionId, productId);
            
            // Обновляем коллекцию после добавления продукта
            await this.fetchCollectionById(collectionId);
        } catch (error: unknown) {
            console.error("Error adding product to collection:", error);
            runInAction(() => {
                this.setError(error instanceof Error ? error.message : 'Failed to add product to collection');
                this.setServerError(true);
            });
            throw error;
        }
    }

    async removeProductFromCollection(collectionId: number, productId: number) {
        try {
            this.setError('');
            this.setServerError(false);

            await removeProductFromCollection(collectionId, productId);
            
            // Обновляем коллекцию после удаления продукта
            await this.fetchCollectionById(collectionId);
        } catch (error: unknown) {
            console.error("Error removing product from collection:", error);
            runInAction(() => {
                this.setError(error instanceof Error ? error.message : 'Failed to remove product from collection');
                this.setServerError(true);
            });
            throw error;
        }
    }

    async fetchCollectionProducts(collectionId: number, filters?: { page?: number; limit?: number }) {
        try {
            this.setLoading(true);
            this.setError('');
            this.setServerError(false);

            const response: CollectionProductsResponse = await fetchCollectionProducts(collectionId, filters);
            
            runInAction(() => {
                this.setCollectionProducts(response.products);
            });
        } catch (error: unknown) {
            console.error("Error fetching collection products:", error);
            runInAction(() => {
                this.setError(error instanceof Error ? error.message : 'Failed to fetch collection products');
                this.setServerError(true);
            });
        } finally {
            runInAction(() => {
                this.setLoading(false);
            });
        }
    }

    async fetchAvailableProducts(filters?: { page?: number; limit?: number }) {
        try {
            this.setLoading(true);
            this.setError('');
            this.setServerError(false);

            const response: CollectionProductsResponse = await fetchAvailableProducts(filters);
            
            runInAction(() => {
                this.setCollectionProducts(response.products);
            });
        } catch (error: unknown) {
            console.error("Error fetching available products:", error);
            runInAction(() => {
                this.setError(error instanceof Error ? error.message : 'Failed to fetch available products');
                this.setServerError(true);
            });
        } finally {
            runInAction(() => {
                this.setLoading(false);
            });
        }
    }

    // Геттеры
    get collections() {
        return this._collections;
    }

    get currentCollection() {
        return this._currentCollection;
    }

    get collectionProducts() {
        return this._collectionProducts;
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
    getCollectionById(id: number): Collection | undefined {
        return this._collections.find(collection => collection.id === id);
    }

    getCollectionsWithProducts(): Collection[] {
        return this._collections.filter(collection => collection.products && collection.products.length > 0);
    }

    getEmptyCollections(): Collection[] {
        return this._collections.filter(collection => !collection.products || collection.products.length === 0);
    }

    clearError() {
        this.setError('');
        this.setServerError(false);
    }

    clearCurrentCollection() {
        this.setCurrentCollection(null);
    }
}
