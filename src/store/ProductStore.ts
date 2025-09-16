import { makeAutoObservable, runInAction } from "mobx";
import { 
    fetchProducts, 
    fetchProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct, 
    deleteProductMedia,
    type ProductFilters,
    type ProductResponse
} from "@/http/productAPI";
import type { Product } from "@/types/types";

export default class ProductStore {
    _products: Product[] = [];
    _currentProduct: Product | null = null;
    _loading = false;
    _totalCount = 0;
    _currentPage = 1;
    _totalPages = 0;
    _error = '';
    _isServerError = false;

    constructor() {
        makeAutoObservable(this);
    }

    setProducts(products: Product[]) {
        this._products = products;
    }

    setCurrentProduct(product: Product | null) {
        this._currentProduct = product;
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

    async fetchProducts(filters?: ProductFilters) {
        try {
            this.setLoading(true);
            this.setError('');
            this.setServerError(false);

            const response: ProductResponse = await fetchProducts(filters);
            
            runInAction(() => {
                this.setProducts(response.products);
                this.setTotalCount(response.totalCount);
                this.setCurrentPage(response.currentPage);
                this.setTotalPages(response.totalPages);
            });
        } catch (error: unknown) {
            console.error("Error fetching products:", error);
            runInAction(() => {
                this.setError(error instanceof Error ? error.message : 'Failed to fetch products');
                this.setServerError(true);
            });
        } finally {
            runInAction(() => {
                this.setLoading(false);
            });
        }
    }

    async fetchProductById(id: number) {
        try {
            this.setLoading(true);
            this.setError('');
            this.setServerError(false);

            const product: Product = await fetchProductById(id);
            
            runInAction(() => {
                this.setCurrentProduct(product);
            });
        } catch (error: unknown) {
            console.error("Error fetching product by id:", error);
            runInAction(() => {
                this.setError(error instanceof Error ? error.message : 'Failed to fetch product');
                this.setServerError(true);
            });
        } finally {
            runInAction(() => {
                this.setLoading(false);
            });
        }
    }

    async createProduct(productData: FormData) {
        try {
            this.setLoading(true);
            this.setError('');
            this.setServerError(false);

            const product: Product = await createProduct(productData);
            
            runInAction(() => {
                this._products.unshift(product);
                this.setTotalCount(this._totalCount + 1);
            });

            return product;
        } catch (error: unknown) {
            console.error("Error creating product:", error);
            runInAction(() => {
                this.setError(error instanceof Error ? error.message : 'Failed to create product');
                this.setServerError(true);
            });
            throw error;
        } finally {
            runInAction(() => {
                this.setLoading(false);
            });
        }
    }

    async updateProduct(id: number, productData: FormData) {
        try {
            this.setLoading(true);
            this.setError('');
            this.setServerError(false);

            const updatedProduct: Product = await updateProduct(id, productData);
            
            runInAction(() => {
                const index = this._products.findIndex(product => product.id === id);
                if (index !== -1) {
                    this._products[index] = updatedProduct;
                }
                if (this._currentProduct?.id === id) {
                    this.setCurrentProduct(updatedProduct);
                }
            });

            return updatedProduct;
        } catch (error: unknown) {
            console.error("Error updating product:", error);
            runInAction(() => {
                this.setError(error instanceof Error ? error.message : 'Failed to update product');
                this.setServerError(true);
            });
            throw error;
        } finally {
            runInAction(() => {
                this.setLoading(false);
            });
        }
    }

    async deleteProduct(id: number) {
        try {
            this.setLoading(true);
            this.setError('');
            this.setServerError(false);

            await deleteProduct(id);
            
            runInAction(() => {
                this._products = this._products.filter(product => product.id !== id);
                this.setTotalCount(this._totalCount - 1);
                if (this._currentProduct?.id === id) {
                    this.setCurrentProduct(null);
                }
            });
        } catch (error: unknown) {
            console.error("Error deleting product:", error);
            runInAction(() => {
                this.setError(error instanceof Error ? error.message : 'Failed to delete product');
                this.setServerError(true);
            });
            throw error;
        } finally {
            runInAction(() => {
                this.setLoading(false);
            });
        }
    }

    async deleteProductMedia(productId: number, mediaId: number) {
        try {
            this.setError('');
            this.setServerError(false);

            await deleteProductMedia(productId, mediaId);
            
            runInAction(() => {
                if (this._currentProduct?.id === productId) {
                    this._currentProduct.mediaFiles = this._currentProduct.mediaFiles?.filter(
                        media => media.id !== mediaId
                    );
                }
            });
        } catch (error: unknown) {
            console.error("Error deleting product media:", error);
            runInAction(() => {
                this.setError(error instanceof Error ? error.message : 'Failed to delete media');
                this.setServerError(true);
            });
            throw error;
        }
    }

    // Геттеры
    get products() {
        return this._products;
    }

    get currentProduct() {
        return this._currentProduct;
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
    getProductById(id: number): Product | undefined {
        return this._products.find(product => product.id === id);
    }

    getAvailableProducts(): Product[] {
        return this._products.filter(product => product.status === 'AVAILABLE');
    }

    getSoldProducts(): Product[] {
        return this._products.filter(product => product.status === 'SOLD');
    }

    getDeletedProducts(): Product[] {
        return this._products.filter(product => product.status === 'DELETED');
    }

    getProductsByGender(gender: 'MAN' | 'WOMAN'): Product[] {
        return this._products.filter(product => product.gender === gender);
    }

    getProductsByClothingType(clothingTypeId: number): Product[] {
        return this._products.filter(product => product.clothingTypeId === clothingTypeId);
    }

    clearError() {
        this.setError('');
        this.setServerError(false);
    }

    clearCurrentProduct() {
        this.setCurrentProduct(null);
    }
}
