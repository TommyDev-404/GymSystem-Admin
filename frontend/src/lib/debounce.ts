export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number = 300,
) {
  let timer: ReturnType<typeof setTimeout>;

  const debounced = (...args: Parameters<T>) => {
    clearTimeout(timer);

    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };

  debounced.cancel = () => {
    clearTimeout(timer);
  };

  return debounced;
}