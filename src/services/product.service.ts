import { Product } from "@/models";

export class ProductService {
    async getProducts({ 
        search,
        category_id,
    }: {
        search: string | undefined;
        category_id: string | undefined;
    }): Promise<Product[]> {
        
        let url = `${process.env.CATALOG_API_URL}/product`;

        if(category_id){
            url += `/category/${category_id}`
        }

        const response = await fetch(url,  {
            next: {
                revalidate: 1,
            },
        });
        let data = await response.json();
        data = !data ? [] : data;
        if (search) {
            return data.filter((product: Product) => {
                return product.name.toLowerCase().includes(search.toLowerCase());
            });
        }

        return data;
    }
    async getProduct(productId: string): Promise<Product[]> {
        const response = await fetch(`${process.env.CATALOG_API_URL}/product/${productId}`, {
            next: {
                revalidate: 1,
            },
        });
        return response.json();
    }
}