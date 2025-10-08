# Dev import notes

During development, you can import stub JSON files from `/public/data` into IndexedDB using the helpers in `lib/loaders.ts`. Production builds will lean on the Offline Manager to hydrate the database from a manifest, but this utility can speed up local testing.
