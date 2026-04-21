import { defineConfig } from 'vitest/config'
import { config } from 'dotenv'

config({ path: '.env.test' })

export default defineConfig({
    test: {
        fileParallelism: false,
        globalSetup: './src/test/globalSetup.ts',
        setupFiles: ['./src/test/setup.ts'],
        silent: true,
    },
})