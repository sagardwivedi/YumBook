import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  client: '@hey-api/client-fetch',
  input: './openapi.json',
  output: {
    path: 'src/client',
    format: 'biome',
    lint: 'biome',
  },
  schemas: false,
  plugins: ['@tanstack/react-query'],
  types: {
    dates: 'types+transform',
    enums: 'typescript+namespace',
  },
});
