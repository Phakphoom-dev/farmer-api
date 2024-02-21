export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function envOrDefault(key: string, defaultValue: string): string {
  return process.env[key] || defaultValue;
}
