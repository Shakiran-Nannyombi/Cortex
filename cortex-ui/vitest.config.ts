import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
    viteConfig,
    defineConfig({
        test: {
            globals: true,
            environment: 'jsdom',
            setupFiles: ['./src/__tests__/setup.ts'],
            coverage: {
                provider: 'v8',
                reporter: ['text', 'json', 'html', 'lcov'],
                exclude: [
                    'node_modules/',
                    'src/__tests__/',
                    '**/*.test.ts',
                    '**/*.test.tsx',
                    '**/index.ts',
                ],
                lines: 80,
                functions: 80,
                branches: 75,
                statements: 80,
            },
        },
    })
);
