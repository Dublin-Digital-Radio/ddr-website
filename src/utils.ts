export function debug(message: string) {
  process.env.DEBUG && console.debug(message);
}
