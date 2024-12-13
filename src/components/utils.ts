export const randomize = <T>(items: T[]): { item: T; index: number } => {
  const index = Math.floor(Math.random() * items.length);

  if (items.length === 0) {
    throw new Error('The items array is empty');
  }

  return { item: items[index]!, index };
};
