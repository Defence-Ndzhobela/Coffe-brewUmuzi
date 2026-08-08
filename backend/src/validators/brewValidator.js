const ALLOWED_METHODS = [
  "Aeropress",
  "Drip coffee",
  "V60",
  "French Press",
  "Chemex",
];

const validateBrewPayload = (payload) => {
  const errors = [];

  if (!payload || typeof payload !== "object") {
    return ["Invalid request body."];
  }

  if (!payload.beans || !String(payload.beans).trim()) {
    errors.push("beans is required.");
  }

  if (!ALLOWED_METHODS.includes(payload.method)) {
    errors.push("method must be one of the allowed brew methods.");
  }

  const coffee = Number(payload.coffeeGrams);
  const water = Number(payload.waterGrams);
  const rating = Number(payload.rating);

  if (!Number.isFinite(coffee) || coffee <= 0) {
    errors.push("coffeeGrams must be a positive number.");
  }

  if (!Number.isFinite(water) || water <= 0) {
    errors.push("waterGrams must be a positive number.");
  }

  if (!Number.isFinite(rating) || rating < 0 || rating > 5) {
    errors.push("rating must be between 0 and 5.");
  }

  return errors;
};

module.exports = {
  ALLOWED_METHODS,
  validateBrewPayload,
};
