const MAGENTO_BASE_URL = process.env.NEXT_PUBLIC_MAGENTO_BASE_URL || 'http://127.0.0.1:8082';
const MAGENTO_API_URL = process.env.NEXT_PUBLIC_MAGENTO_API_URL || 'http://127.0.0.1:8082/api.php';

// Interface for raw API response items
interface ApiProductItem {
  id: number;
  sku: string;
  name: string;
  price: string;
  type_id: string;
  status: number;
  image: string;
  description?: string;
  short_description?: string;
}

export interface MagentoProduct {
  id: number;
  sku: string;
  name: string;
  attribute_set_id: number;
  price: number;
  status: number;
  visibility: number;
  type_id: string;
  weight: number;
  custom_attributes: Array<{
    attribute_code: string;
    value: string | number | boolean;
  }>;
}

export interface MagentoCategory {
  id: number;
  parent_id: number;
  name: string;
  is_active: boolean;
  position: number;
  level: number;
  product_count: number;
  children_data?: MagentoCategory[];
}

export interface SearchCriteria {
  filterGroups?: Array<{
    filters: Array<{
      field: string;
      value: string;
      condition_type?: string;
    }>;
  }>;
  sortOrders?: Array<{
    field: string;
    direction: 'ASC' | 'DESC';
  }>;
  pageSize?: number;
  currentPage?: number;
  search?: string;
  category_id?: number;
}

class MagentoAPI {
  private baseUrl: string;
  private apiUrl: string;

  constructor() {
    this.baseUrl = MAGENTO_BASE_URL;
    this.apiUrl = MAGENTO_API_URL;
  }

  private async fetchAPI(params: Record<string, string> = {}): Promise<Record<string, unknown>> {
    const searchParams = new URLSearchParams(params);
    const url = `${this.apiUrl}?${searchParams}`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(`API Error: ${data.error}`);
    }

    return data;
  }

  private buildSearchCriteria(criteria: SearchCriteria = {}): string {
    const params = new URLSearchParams();

    if (criteria.filterGroups) {
      criteria.filterGroups.forEach((group, groupIndex) => {
        group.filters.forEach((filter, filterIndex) => {
          params.append(`searchCriteria[filterGroups][${groupIndex}][filters][${filterIndex}][field]`, filter.field);
          params.append(`searchCriteria[filterGroups][${groupIndex}][filters][${filterIndex}][value]`, filter.value);
          if (filter.condition_type) {
            params.append(`searchCriteria[filterGroups][${groupIndex}][filters][${filterIndex}][condition_type]`, filter.condition_type);
          }
        });
      });
    }

    if (criteria.sortOrders) {
      criteria.sortOrders.forEach((sort, index) => {
        params.append(`searchCriteria[sortOrders][${index}][field]`, sort.field);
        params.append(`searchCriteria[sortOrders][${index}][direction]`, sort.direction);
      });
    }

    if (criteria.pageSize) {
      params.append('searchCriteria[pageSize]', criteria.pageSize.toString());
    }

    if (criteria.currentPage) {
      params.append('searchCriteria[currentPage]', criteria.currentPage.toString());
    }

    return params.toString();
  }

  async getProducts(criteria: SearchCriteria = {}): Promise<{
    items: MagentoProduct[];
    search_criteria: SearchCriteria;
    total_count: number;
  }> {
    const params: Record<string, string> = {
      action: 'products'
    };

    if (criteria.pageSize) {
      params.limit = criteria.pageSize.toString();
    }

    if (criteria.currentPage) {
      params.page = criteria.currentPage.toString();
    }

    const result = await this.fetchAPI(params);

    // Transform the simplified API response to match MagentoProduct interface
    const transformedItems: MagentoProduct[] = ((result.items as unknown as ApiProductItem[]) || []).map((item: ApiProductItem) => ({
      id: item.id,
      sku: item.sku,
      name: item.name,
      attribute_set_id: 4, // Default attribute set
      price: parseFloat(item.price) || 0,
      status: item.status || 1,
      visibility: 4, // Catalog and Search
      type_id: item.type_id || 'simple',
      weight: 1, // Default weight
      custom_attributes: [
        {
          attribute_code: 'image',
          value: item.image || ''
        },
        {
          attribute_code: 'description',
          value: item.description || ''
        },
        {
          attribute_code: 'short_description',
          value: item.short_description || ''
        }
      ]
    }));

    return {
      items: transformedItems,
      search_criteria: criteria,
      total_count: (result.total_count as number) || 0
    };
  }

  async getProductBySku(sku: string): Promise<MagentoProduct> {
    const item = await this.fetchAPI({
      action: 'product',
      sku: encodeURIComponent(sku)
    }) as unknown as ApiProductItem;

    // Transform the simplified API response to match MagentoProduct interface
    return {
      id: item.id,
      sku: item.sku,
      name: item.name,
      attribute_set_id: 4, // Default attribute set
      price: parseFloat(item.price) || 0,
      status: item.status || 1,
      visibility: 4, // Catalog and Search
      type_id: item.type_id || 'simple',
      weight: 1, // Default weight
      custom_attributes: [
        {
          attribute_code: 'image',
          value: item.image || ''
        },
        {
          attribute_code: 'description',
          value: item.description || ''
        },
        {
          attribute_code: 'short_description',
          value: item.short_description || ''
        }
      ]
    };
  }

  async getCategories(): Promise<MagentoCategory> {
    const result = await this.fetchAPI({ action: 'categories' });
    return {
      id: 1,
      parent_id: 0,
      name: 'Root',
      is_active: true,
      position: 0,
      level: 0,
      product_count: 0,
      children_data: result as unknown as MagentoCategory[]
    };
  }

  async getCategoryById(categoryId: number): Promise<MagentoCategory> {
    // For now, return a mock category since we don't have this endpoint yet
    return {
      id: categoryId,
      parent_id: 1,
      name: `Category ${categoryId}`,
      is_active: true,
      position: 0,
      level: 1,
      product_count: 0
    };
  }

  async searchProducts(query: string, limit: number = 20): Promise<{
    items: MagentoProduct[];
    search_criteria: SearchCriteria;
    total_count: number;
  }> {
    const result = await this.fetchAPI({
      action: 'products',
      search: query,
      limit: limit.toString()
    });

    // Transform the simplified API response to match MagentoProduct interface
    const transformedItems: MagentoProduct[] = ((result.items as unknown as ApiProductItem[]) || []).map((item: ApiProductItem) => ({
      id: item.id,
      sku: item.sku,
      name: item.name,
      attribute_set_id: 4, // Default attribute set
      price: parseFloat(item.price) || 0,
      status: item.status || 1,
      visibility: 4, // Catalog and Search
      type_id: item.type_id || 'simple',
      weight: 1, // Default weight
      custom_attributes: [
        {
          attribute_code: 'image',
          value: item.image || ''
        },
        {
          attribute_code: 'description',
          value: item.description || ''
        },
        {
          attribute_code: 'short_description',
          value: item.short_description || ''
        }
      ]
    }));

    return {
      items: transformedItems,
      search_criteria: { search: query },
      total_count: (result.total_count as number) || 0
    };
  }

  async getProductsByCategory(categoryId: number, limit: number = 20, page: number = 1): Promise<{
    items: MagentoProduct[];
    search_criteria: SearchCriteria;
    total_count: number;
  }> {
    // For now, return all products since we don't have category filtering yet
    const result = await this.fetchAPI({
      action: 'products',
      limit: limit.toString(),
      page: page.toString()
    });

    // Transform the simplified API response to match MagentoProduct interface
    const transformedItems: MagentoProduct[] = ((result.items as unknown as ApiProductItem[]) || []).map((item: ApiProductItem) => ({
      id: item.id,
      sku: item.sku,
      name: item.name,
      attribute_set_id: 4, // Default attribute set
      price: parseFloat(item.price) || 0,
      status: item.status || 1,
      visibility: 4, // Catalog and Search
      type_id: item.type_id || 'simple',
      weight: 1, // Default weight
      custom_attributes: [
        {
          attribute_code: 'image',
          value: item.image || ''
        },
        {
          attribute_code: 'description',
          value: item.description || ''
        },
        {
          attribute_code: 'short_description',
          value: item.short_description || ''
        }
      ]
    }));

    return {
      items: transformedItems,
      search_criteria: { category_id: categoryId },
      total_count: (result.total_count as number) || 0
    };
  }

  getImageUrl(imagePath: string): string {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `${this.baseUrl}/pub/media/catalog/product${imagePath}`;
  }
}

export const magentoAPI = new MagentoAPI();