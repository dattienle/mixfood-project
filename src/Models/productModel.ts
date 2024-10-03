import Ingredient from "~/Models/ingredientModel"

interface Product {
    id: number
    name: string
    price: number
   productTemplate: number,
   quantity: number,
   ingredients: Ingredient[]

}
export default Product