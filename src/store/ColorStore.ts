import { makeAutoObservable, runInAction } from "mobx";
import { 
    fetchColors, 
    createColor, 
    updateColor, 
    deleteColor,
    createDefaultColors,
    addColorsToProduct,
    removeColorFromProduct
} from "@/http/productAPI";
import type { Color, Product } from "@/types/types";

export default class ColorStore {
    _colors: Color[] = [];
    _currentColor: Color | null = null;
    _loading = false;
    _error = '';
    _isServerError = false;

    constructor() {
        makeAutoObservable(this);
    }

    setColors(colors: Color[]) {
        this._colors = colors;
    }

    setCurrentColor(color: Color | null) {
        this._currentColor = color;
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

    async fetchColors() {
        try {
            this.setLoading(true);
            this.setError('');
            this.setServerError(false);

            const colors: Color[] = await fetchColors();
            
            runInAction(() => {
                this.setColors(colors);
            });
        } catch (error: unknown) {
            console.error("Error fetching colors:", error);
            runInAction(() => {
                this.setError(error instanceof Error ? error.message : 'Failed to fetch colors');
                this.setServerError(true);
            });
        } finally {
            runInAction(() => {
                this.setLoading(false);
            });
        }
    }

    async createColor(colorData: { name: string; hexCode?: string }) {
        try {
            this.setLoading(true);
            this.setError('');
            this.setServerError(false);

            const color: Color = await createColor(colorData);
            
            runInAction(() => {
                this._colors.unshift(color);
            });

            return color;
        } catch (error: unknown) {
            console.error("Error creating color:", error);
            runInAction(() => {
                this.setError(error instanceof Error ? error.message : 'Failed to create color');
                this.setServerError(true);
            });
            throw error;
        } finally {
            runInAction(() => {
                this.setLoading(false);
            });
        }
    }

    async updateColor(id: number, colorData: { name?: string; hexCode?: string }) {
        try {
            this.setLoading(true);
            this.setError('');
            this.setServerError(false);

            const updatedColor: Color = await updateColor(id, colorData);
            
            runInAction(() => {
                const index = this._colors.findIndex(color => color.id === id);
                if (index !== -1) {
                    this._colors[index] = updatedColor;
                }
                if (this._currentColor?.id === id) {
                    this.setCurrentColor(updatedColor);
                }
            });

            return updatedColor;
        } catch (error: unknown) {
            console.error("Error updating color:", error);
            runInAction(() => {
                this.setError(error instanceof Error ? error.message : 'Failed to update color');
                this.setServerError(true);
            });
            throw error;
        } finally {
            runInAction(() => {
                this.setLoading(false);
            });
        }
    }

    async deleteColor(id: number) {
        try {
            this.setLoading(true);
            this.setError('');
            this.setServerError(false);

            await deleteColor(id);
            
            runInAction(() => {
                this._colors = this._colors.filter(color => color.id !== id);
                if (this._currentColor?.id === id) {
                    this.setCurrentColor(null);
                }
            });
        } catch (error: unknown) {
            console.error("Error deleting color:", error);
            runInAction(() => {
                this.setError(error instanceof Error ? error.message : 'Failed to delete color');
                this.setServerError(true);
            });
            throw error;
        } finally {
            runInAction(() => {
                this.setLoading(false);
            });
        }
    }

    async createDefaultColors() {
        try {
            this.setLoading(true);
            this.setError('');
            this.setServerError(false);

            const result = await createDefaultColors();
            
            runInAction(() => {
                // Обновляем список цветов
                this.fetchColors();
            });

            return result;
        } catch (error: unknown) {
            console.error("Error creating default colors:", error);
            runInAction(() => {
                this.setError(error instanceof Error ? error.message : 'Failed to create default colors');
                this.setServerError(true);
            });
            throw error;
        } finally {
            runInAction(() => {
                this.setLoading(false);
            });
        }
    }

    async addColorsToProduct(productId: number, colorIds: number[]) {
        try {
            this.setError('');
            this.setServerError(false);

            const updatedProduct: Product = await addColorsToProduct(productId, colorIds);
            return updatedProduct;
        } catch (error: unknown) {
            console.error("Error adding colors to product:", error);
            runInAction(() => {
                this.setError(error instanceof Error ? error.message : 'Failed to add colors to product');
                this.setServerError(true);
            });
            throw error;
        }
    }

    async removeColorFromProduct(productId: number, colorId: number) {
        try {
            this.setError('');
            this.setServerError(false);

            await removeColorFromProduct(productId, colorId);
        } catch (error: unknown) {
            console.error("Error removing color from product:", error);
            runInAction(() => {
                this.setError(error instanceof Error ? error.message : 'Failed to remove color from product');
                this.setServerError(true);
            });
            throw error;
        }
    }

    // Геттеры
    get colors() {
        return this._colors;
    }

    get currentColor() {
        return this._currentColor;
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
    getColorById(id: number): Color | undefined {
        return this._colors.find(color => color.id === id);
    }

    getColorsByName(name: string): Color[] {
        return this._colors.filter(color => 
            color.name.toLowerCase().includes(name.toLowerCase())
        );
    }

    getColorsByHexCode(hexCode: string): Color[] {
        return this._colors.filter(color => color.hexCode === hexCode);
    }

    clearError() {
        this.setError('');
        this.setServerError(false);
    }

    clearCurrentColor() {
        this.setCurrentColor(null);
    }
}
