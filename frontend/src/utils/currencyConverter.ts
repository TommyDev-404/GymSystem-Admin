
export const toPHP = (value: string) => {
  const num = Number(value);
  return new Intl.NumberFormat('en-PH', {
    style: "currency", currency: "PHP"
  }).format(num);
}