// WordPress API Response Types
export interface WPPost {
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  comment_status: string;
  ping_status: string;
  sticky: boolean;
  template: string;
  format: string;
  meta: Record<string, unknown>;
  categories: number[];
  tags: number[];
  _embedded?: {
    'wp:featuredmedia'?: WPMedia[];
    author?: WPAuthor[];
    'wp:term'?: Array<Array<WPCategory | WPTag>>;
  };
  _links: {
    'wp:featuredmedia'?: Array<{
      href: string;
    }>;
    'wp:attachment'?: Array<{
      href: string;
    }>;
    'wp:term'?: Array<{
      href: string;
      taxonomy: string;
    }>;
  };
}

export interface WPMedia {
  id: number;
  date: string;
  slug: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  author: number;
  caption: {
    rendered: string;
  };
  alt_text: string;
  media_type: string;
  mime_type: string;
  media_details: {
    width: number;
    height: number;
    file: string;
    sizes?: {
      thumbnail?: {
        file: string;
        width: number;
        height: number;
        mime_type: string;
        source_url: string;
      };
      medium?: {
        file: string;
        width: number;
        height: number;
        mime_type: string;
        source_url: string;
      };
      large?: {
        file: string;
        width: number;
        height: number;
        mime_type: string;
        source_url: string;
      };
    };
  };
  source_url: string;
}

export interface WPCategory {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  parent: number;
  meta: Record<string, unknown>;
}

export interface WPTag {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  meta: Record<string, unknown>;
}

export interface WPAuthor {
  id: number;
  name: string;
  url: string;
  description: string;
  link: string;
  slug: string;
  avatar_urls: {
    24: string;
    48: string;
    96: string;
  };
}

export interface WPPostResponse {
  data: WPPost[];
  headers: Headers;
  status: number;
}

export interface WPPaginationInfo {
  total: number;
  totalPages: number;
  currentPage: number;
  perPage: number;
}

// Enhanced Blog Post Type for Frontend
export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  date: string;
  modified: string;
  author?: WPAuthor;
  categories: WPCategory[];
  tags: WPTag[];
  featuredImage?: WPMedia;
  link: string;
  status: string;
  commentStatus: string;
}

// Blog List Response Type
export interface BlogListResponse {
  posts: BlogPost[];
  pagination: WPPaginationInfo;
}

// Search and Filter Types
export interface BlogSearchParams {
  search?: string;
  category?: string;
  tag?: string;
  author?: number;
  perPage?: number;
  page?: number;
  status?: string;
  orderBy?: 'date' | 'title' | 'modified';
  order?: 'asc' | 'desc';
}

// WordPress API Configuration
export interface WordPressConfig {
  url: string;
  username?: string;
  password?: string;
  perPage?: number;
}