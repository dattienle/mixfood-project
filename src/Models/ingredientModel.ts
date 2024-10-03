import IngredientType from "~/Models/ingredientTypeModel";

interface Ingredient {
  id: number,
  name: string,
  price: number,
  calo: number,
  description: string,
  imageUrl: string,
  isDeleted: boolean,
  ingredientType: IngredientType,
  
}


export default Ingredient;