import Category from "~/Models/categoryModel"
import Ingredient from "~/Models/ingredientModel"

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