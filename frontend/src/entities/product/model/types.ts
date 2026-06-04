export type Product = {
    id: string
    title: string,
    description?: string,
    price: number,
    rubricId: string,
    images?: Array<string>,
    status?: string,
    seller_id: string,
}