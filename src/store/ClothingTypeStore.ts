import { makeAutoObservable, runInAction } from "mobx";
import { 
    fetchClothingTypes, 
    fetchClothingTypeById, 
    createClothingType, 
    updateClothingType, 
    deleteClothingType,
    createDefaultClothingTypes,
    getClothingTypeStatistics
} from "@/http/productAPI";
import type { ClothingType } from "@/types/types";

export default class ClothingTypeStore {
    _clothingTypes: ClothingType[] = [];
    _statistics: any[] = [];
    _currentClothingType: ClothingType | null = null;
    _loading = false;
    _error = '';
    _isServerError = false;

    constructor() {
        makeAutoObservable(this);
    }

    setClothingTypes(clothingTypes: ClothingType[]) {
        this._clothingTypes = clothingTypes;
    }

    setStatistics(statistics: any[]) {
        this._statistics = statistics;
    }

    setCurrentClothingType(clothingType: ClothingType | null) {
        this._currentClothingType = clothingType;
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

    async fetchClothingTypes() {
        try {
            this.setLoading(true);
            this.setError('');
            this.setServerError(false);

            const clothingTypes: ClothingType[] = await fetchClothingTypes();
            
            runInAction(() => {
                this.setClothingTypes(clothingTypes);
            });
        } catch (error: unknown) {
            console.error("Error fetching clothing types:", error);
            runInAction(() => {
                this.setError(error instanceof Error ? error.message : 'Failed to fetch clothing types');
                this.setServerError(true);
            });
        } finally {
            runInAction(() => {
                this.setLoading(false);
            });
        }
    }

    async fetchClothingTypeById(id: number) {
        try {
            this.setLoading(true);
            this.setError('');
            this.setServerError(false);

            const clothingType: ClothingType = await fetchClothingTypeById(id);
            
            runInAction(() => {
                this.setCurrentClothingType(clothingType);
            });
        } catch (error: unknown) {
            console.error("Error fetching clothing type by id:", error);
            runInAction(() => {
                this.setError(error instanceof Error ? error.message : 'Failed to fetch clothing type');
                this.setServerError(true);
            });
        } finally {
            runInAction(() => {
                this.setLoading(false);
            });
        }
    }

    async createClothingType(clothingTypeData: { name: string }) {
        try {
            this.setLoading(true);
            this.setError('');
            this.setServerError(false);

            const clothingType: ClothingType = await createClothingType(clothingTypeData);
            
            runInAction(() => {
                this._clothingTypes.unshift(clothingType);
            });

            return clothingType;
        } catch (error: unknown) {
            console.error("Error creating clothing type:", error);
            runInAction(() => {
                this.setError(error instanceof Error ? error.message : 'Failed to create clothing type');
                this.setServerError(true);
            });
            throw error;
        } finally {
            runInAction(() => {
                this.setLoading(false);
            });
        }
    }

    async updateClothingType(id: number, clothingTypeData: { name: string }) {
        try {
            this.setLoading(true);
            this.setError('');
            this.setServerError(false);

            const updatedClothingType: ClothingType = await updateClothingType(id, clothingTypeData);
            
            runInAction(() => {
                const index = this._clothingTypes.findIndex(type => type.id === id);
                if (index !== -1) {
                    this._clothingTypes[index] = updatedClothingType;
                }
                if (this._currentClothingType?.id === id) {
                    this.setCurrentClothingType(updatedClothingType);
                }
            });

            return updatedClothingType;
        } catch (error: unknown) {
            console.error("Error updating clothing type:", error);
            runInAction(() => {
                this.setError(error instanceof Error ? error.message : 'Failed to update clothing type');
                this.setServerError(true);
            });
            throw error;
        } finally {
            runInAction(() => {
                this.setLoading(false);
            });
        }
    }

    async deleteClothingType(id: number) {
        try {
            this.setLoading(true);
            this.setError('');
            this.setServerError(false);

            await deleteClothingType(id);
            
            runInAction(() => {
                this._clothingTypes = this._clothingTypes.filter(type => type.id !== id);
                if (this._currentClothingType?.id === id) {
                    this.setCurrentClothingType(null);
                }
            });
        } catch (error: unknown) {
            console.error("Error deleting clothing type:", error);
            runInAction(() => {
                this.setError(error instanceof Error ? error.message : 'Failed to delete clothing type');
                this.setServerError(true);
            });
            throw error;
        } finally {
            runInAction(() => {
                this.setLoading(false);
            });
        }
    }

    async createDefaultClothingTypes() {
        try {
            this.setLoading(true);
            this.setError('');
            this.setServerError(false);

            const result = await createDefaultClothingTypes();
            
            runInAction(() => {
                // Обновляем список типов одежды
                this.fetchClothingTypes();
            });

            return result;
        } catch (error: unknown) {
            console.error("Error creating default clothing types:", error);
            runInAction(() => {
                this.setError(error instanceof Error ? error.message : 'Failed to create default clothing types');
                this.setServerError(true);
            });
            throw error;
        } finally {
            runInAction(() => {
                this.setLoading(false);
            });
        }
    }

    async fetchStatistics() {
        try {
            this.setError('');
            this.setServerError(false);

            const statistics = await getClothingTypeStatistics();
            
            runInAction(() => {
                this.setStatistics(statistics);
            });
        } catch (error: unknown) {
            console.error("Error fetching clothing type statistics:", error);
            runInAction(() => {
                this.setError(error instanceof Error ? error.message : 'Failed to fetch statistics');
                this.setServerError(true);
            });
        }
    }

    // Геттеры
    get clothingTypes() {
        return this._clothingTypes;
    }

    get statistics() {
        return this._statistics;
    }

    get currentClothingType() {
        return this._currentClothingType;
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
    getClothingTypeById(id: number): ClothingType | undefined {
        return this._clothingTypes.find(type => type.id === id);
    }

    getClothingTypesByName(name: string): ClothingType[] {
        return this._clothingTypes.filter(type => 
            type.name.toLowerCase().includes(name.toLowerCase())
        );
    }

    clearError() {
        this.setError('');
        this.setServerError(false);
    }

    clearCurrentClothingType() {
        this.setCurrentClothingType(null);
    }
}
