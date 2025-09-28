import { createContext, useState, useEffect, type ReactNode } from "react";
import LoadingIndicator from "../components/LoadingIndicator";
import UserStore from "@/store/UserStore";
import NewsStore from "@/store/NewsStore";
import NewsTypeStore from "@/store/NewsTypeStore";
import TagStore from "@/store/TagStore";
import ProductStore from "@/store/ProductStore";
import ClothingTypeStore from "@/store/ClothingTypeStore";
import ColorStore from "@/store/ColorStore";
import SizeStore from "@/store/SizeStore";
import CollectionStore from "@/store/CollectionStore";
// Определяем интерфейс для нашего контекста
export interface IStoreContext {
  user: UserStore;
  news: NewsStore;
  newsType: NewsTypeStore;
  tag: TagStore;
  product: ProductStore;
  clothingType: ClothingTypeStore;
  color: ColorStore;
  size: SizeStore;
  collection: CollectionStore;
}

let storeInstance: IStoreContext | null = null;

// Функция для получения экземпляра хранилища
export function getStore(): IStoreContext {
  if (!storeInstance) {
    throw new Error("Store not initialized");
  }
  return storeInstance;
}

// Создаем контекст с начальным значением null, но указываем правильный тип
export const Context = createContext<IStoreContext | null>(null);

// Добавляем типы для пропсов
interface StoreProviderProps {
  children: ReactNode;
}

const StoreProvider = ({ children }: StoreProviderProps) => {
  const [stores, setStores] = useState<{
    user: UserStore;
    news: NewsStore;
    newsType: NewsTypeStore;
    tag: TagStore;
    product: ProductStore;
    clothingType: ClothingTypeStore;
    color: ColorStore;
    size: SizeStore;
    collection: CollectionStore;
  } | null>(null);

  useEffect(() => {
    const loadStores = async () => {
      const [
        { default: UserStore },
        { default: NewsStore },
        { default: NewsTypeStore },
        { default: TagStore },
        { default: ProductStore },
        { default: ClothingTypeStore },
        { default: ColorStore },
        { default: SizeStore },
        { default: CollectionStore },
      ] = await Promise.all([
        import("@/store/UserStore"),
        import("@/store/NewsStore"),
        import("@/store/NewsTypeStore"),
        import("@/store/TagStore"),
        import("@/store/ProductStore"),
        import("@/store/ClothingTypeStore"),
        import("@/store/ColorStore"),
        import("@/store/SizeStore"),
        import("@/store/CollectionStore"),
      ]);

      setStores({
        user: new UserStore(),
        news: new NewsStore(),
        newsType: new NewsTypeStore(),
        tag: new TagStore(),
        product: new ProductStore(),
        clothingType: new ClothingTypeStore(),
        color: new ColorStore(),
        size: new SizeStore(),
        collection: new CollectionStore(),
      });
    };

    loadStores();
  }, []);

  if (!stores) {
    return <LoadingIndicator />; // Use custom loading indicator
  }

  // Сохраняем экземпляр хранилища для доступа из других модулей
  storeInstance = stores;

  return <Context.Provider value={stores}>{children}</Context.Provider>;
};

export default StoreProvider;
