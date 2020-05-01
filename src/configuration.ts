function get() {
  return {
    PORT: (process.env.PORT || '9000'),
  };
}

export {
  get,
};
