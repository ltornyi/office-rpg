export const oneDecimal = (value: number) => {
  return (Math.floor(value * 10) / 10).toFixed(1);
}