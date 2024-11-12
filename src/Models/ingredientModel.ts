import IngredientType from "~/Models/ingredientTypeModel";

interface Ingredient {
  id: number,
  name: string,
  price: number,
  calo: number,
  description: string,
  quantity: number,
  urlInfo: string,
  imageUrl: string,
  isDeleted: boolean,
  isApproved: boolean,
  ingredientType: IngredientType,
  
}


export default Ingredient;