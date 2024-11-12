import Ingredient from "./ingredientModel"


interface Nutrition {
id: number,
ingredient: Ingredient,
imageUrl: string,
name: string,
description: string,
vitamin: string,
healthValue: string,
nutrition1: string,
isDeleted: boolean
}
export default Nutrition