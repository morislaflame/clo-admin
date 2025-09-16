// src/routes.ts (если у вас массив роутов)
import type { ComponentType } from 'react';
import MainPage from '@/pages/MainPage';
import AuthPage from '@/pages/AuthPage';
import NewsPage from '@/pages/NewsPage';
import TagsPage from '@/pages/TagsPage';
import NewsTypesPage from '@/pages/NewsTypesPage';
import ProductsPage from '@/pages/ProductsPage';
import ClothingTypesPage from '@/pages/ClothingTypesPage';
import ColorsPage from '@/pages/ColorsPage';
import SizesPage from '@/pages/SizesPage';
import { 
  MAIN_ROUTE, 
  AUTH_ROUTE, 
  NEWS_ROUTE, 
  TAGS_ROUTE, 
  NEWS_TYPES_ROUTE,
  PRODUCTS_ROUTE,
  CLOTHING_TYPES_ROUTE,
  COLORS_ROUTE,
  SIZES_ROUTE
} from '@/utils/consts';

interface Route {
  path: string;
  Component: ComponentType;
}

export const publicRoutes: Route[] = [
  { path: MAIN_ROUTE, Component: MainPage },
  { path: AUTH_ROUTE, Component: AuthPage },
];

export const privateRoutes: Route[] = [
  { path: NEWS_ROUTE, Component: NewsPage },
  { path: TAGS_ROUTE, Component: TagsPage },
  { path: NEWS_TYPES_ROUTE, Component: NewsTypesPage },
  { path: PRODUCTS_ROUTE, Component: ProductsPage },
  { path: CLOTHING_TYPES_ROUTE, Component: ClothingTypesPage },
  { path: COLORS_ROUTE, Component: ColorsPage },
  { path: SIZES_ROUTE, Component: SizesPage },
];
