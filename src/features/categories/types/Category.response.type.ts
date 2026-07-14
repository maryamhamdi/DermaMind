// Pagination metadata type
export type PaginationMetadata ={
  currentPage: number;
  numberOfPages: number;
  limit: number;
  nextPage?: number;
}

// Category item type
export type Category= {
  _id: string;
  name: string;
  slug: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

// Generic API response type
export type ApiResponse ={
  results: number;
  metadata: PaginationMetadata;
  data: Category[];
}


