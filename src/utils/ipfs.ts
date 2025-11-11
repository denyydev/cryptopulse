export function ipfsToHttp(
  u?: string,
  gateway = "https://ipfs.io/ipfs/"
): string | undefined {
  if (!u) return u;
  if (u.startsWith("ipfs://")) return gateway + u.slice("ipfs://".length);
  if (u.startsWith("ipfs/")) return gateway + u.slice("ipfs/".length);
  return u;
}
