export interface UserInfo {
    id: number;
    username: string;
    
    telegramId: number;
}

// News related types
export interface News {
    id: number;
    title: string;
    description?: string;
    content: string;
    links: string[];
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    newsTypeId: number;
    authorId: number;
    publishedAt?: string;
    createdAt: string;
    updatedAt: string;
    newsType?: NewsType;
    author?: {
        id: number;
        email: string;
    };
    tags?: Tag[];
    mediaFiles?: MediaFile[];
}

export interface NewsType {
    id: number;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Tag {
    id: number;
    name: string;
    color?: string;
    createdAt: string;
    updatedAt: string;
}

export interface MediaFile {
    id: number;
    fileName: string;
    originalName: string;
    mimeType: string;
    size: number;
    bucket: string;
    url?: string;
    entityType: string;
    entityId: number;
    userId: number;
    createdAt: string;
    updatedAt: string;
}

export interface NewsFilters {
    status?: string;
    newsTypeId?: number;
    tagId?: number;
    authorId?: number;
    page?: number;
    limit?: number;
    published?: boolean;
}

export interface NewsResponse {
    news: News[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
}

export interface NewsTypeResponse {
    newsTypes: NewsType[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
}

export interface TagResponse {
    tags: Tag[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
}

// Product related types
export interface Product {
    id: number;
    gender: 'MAN' | 'WOMAN';
    name: string;
    priceKZT: number;
    priceUSD: number;
    description?: string;
    color?: string;
    ingredients?: string;
    status: 'AVAILABLE' | 'SOLD' | 'DELETED';
    clothingTypeId?: number;
    collectionId?: number;
    createdAt: string;
    updatedAt: string;
    clothingType?: ClothingType;
    collection?: Collection;
    sizes?: Size[];
    colors?: Color[];
    mediaFiles?: MediaFile[];
}

export interface ClothingType {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export interface Collection {
    id: number;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Size {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export interface Color {
    id: number;
    name: string;
    hexCode?: string;
    createdAt: string;
    updatedAt: string;
}