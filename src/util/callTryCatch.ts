export type Try<T, E extends Error = Error> = T | E;

export const callTryCatch = <T, E extends Error = Error>(
  p: () => PromiseLike<T>
): PromiseLike<Try<T, E>> =>
  p().then(
    (x: T) => x,
    (err: E) => err
  );
