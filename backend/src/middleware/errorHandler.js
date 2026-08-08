const errorHandler = (error, _req, res, _next) => {
  const status = Number(error?.status) || 500;
  const message = error?.message || "Internal server error";

  if (status === 404 && error?.success === false) {
    return res.status(404).json({ success: false, error: message });
  }

  if (status === 400 && Array.isArray(error?.errors)) {
    return res.status(400).json({ errors: error.errors });
  }

  return res.status(status).json({ error: message });
};

module.exports = { errorHandler };
