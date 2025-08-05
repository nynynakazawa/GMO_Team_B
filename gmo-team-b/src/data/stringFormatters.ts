export const formatPrice = (price: number): string => {
  return `${price.toLocaleString()}円/月`;
};

export const formatDiscount = (discount: number): string => {
  return `${discount}%OFF`;
};

export const formatStepTitle = (stepNumber: number, title: string): string => {
  return `Step${stepNumber}\n${title}`;
};