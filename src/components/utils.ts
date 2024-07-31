export const randomize = (items: any[]): { item: object; index: number } => {
  const index = Math.floor(Math.random() * items.length);

  return { item: items[index], index };
};
