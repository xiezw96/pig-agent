export function join(valAry: string[], delimiter = '-') {
  if (!Array.isArray(valAry)) return;

  return valAry.filter(val => !!val).join(delimiter);
}
