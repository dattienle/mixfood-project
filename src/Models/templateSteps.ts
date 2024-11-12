interface AddIngredientRequest {
  dishId: number;
  templateSteps: {
    ingredientTypeId: number;
    ingredientId: number[];
    quantityMin: number;
    quantityMax: number;
  }[];
}
export default AddIngredientRequest;