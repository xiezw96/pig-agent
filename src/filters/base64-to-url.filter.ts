export function b64toUrl(val: string) {
  if (!val) return '';

  return atob(val);
}
