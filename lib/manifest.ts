export type Asset = {
  id: string;
  type: string;
  path: string;
  bytes: number;
  sha256: string;
};

export type DataManifest = {
  version: string;
  assets: Asset[];
};

export async function getDataManifest(): Promise<DataManifest> {
  const response = await fetch('data/manifest.json', { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Failed to load manifest (status ${response.status})`);
  }
  return (await response.json()) as DataManifest;
}

export async function getAssetManifest(ids: string[]): Promise<Asset[]> {
  const manifest = await getDataManifest();
  const wanted = new Set(ids);
  return manifest.assets.filter((asset) => wanted.has(asset.id));
}
