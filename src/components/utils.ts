export const randomize = <T>(items: T[]): { item: T; index: number } => {
  const index = Math.floor(Math.random() * items.length);

  return { item: items[index], index };
};
