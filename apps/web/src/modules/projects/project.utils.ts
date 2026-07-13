export const PROJECT_NAME_MAX_LENGTH = 48;

const dateFormatter = new Intl.DateTimeFormat("en-GB");
const numberFormatter = new Intl.NumberFormat("en-US");

export function truncateText(text: string, maxLength: number): string {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
}

export function formatProjectDate(date: string): string {
  return dateFormatter.format(new Date(`${date}T00:00:00`));
}

export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}
