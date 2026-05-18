export type Subcategory = {
  id: string;
  slug: string;
  title: string;
  label?: string;
  description?: string;
};

export type Category = {
  description: string;
  id: string;
  image?: string;
  slug: string;
  subcategories?: Subcategory[];
  tags?: string[];
  title: string;
};
