export function getRandomNumber(minValue, maxValue) {
  return Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
}

export function removeNullAttributes(obj) {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }
  const cleanedObject = Object.fromEntries(
    Object.entries(obj)
      .filter(([_, value]) => value !== null)
      .map(([key, value]) => [key, removeNullAttributes(value)])
  );

  return cleanedObject;
}

export function isValidJSON(string){
  try {
    JSON.parse(string);
    return true;
  } catch (error) {
    return false;
  }
}