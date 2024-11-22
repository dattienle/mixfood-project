interface News {
  id: number;
  title: string;
  description: string;
  imageUrl: string |null;
  isDeleted: boolean;
}

export default News;