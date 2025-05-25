const delay = async (ms: number, errorOut: boolean = false): Promise<void> => {
  return new Promise((resolve, reject) => {
    return setTimeout(() => {
      if (errorOut) reject('Simulated error');
      else resolve();
    }, ms);
  });
};

export { delay };
