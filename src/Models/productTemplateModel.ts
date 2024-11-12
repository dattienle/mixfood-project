// import Category from "~/Models/categoryModel"

import Category from "./categoryModel"


interface ProductTemplate {
    id: number
    name: string
    size: number
    imageUrl: string
    price: number
    storeId: number
    description: string
    isDeleted: boolean
    category: Category

}
export default ProductTemplate