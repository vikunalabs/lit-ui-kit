import { chromeLauncher } from '@web/test-runner-chrome';
import { esbuildPlugin } from '@web/dev-server-esbuild';

export default {
  rootDir: '.',
  files: 'src/**/*.test.ts',
  nodeResolve: true,
  browsers: [
    chromeLauncher()
  ],
  plugins: [
    esbuildPlugin({ 
      ts: true,
      target: 'auto',
      tsconfig: './tsconfig.json'
    })
  ],
  testFramework: {
    config: {
      timeout: 3000,
      retries: 1
    }
  },
  testsFinishTimeout: 300000, // 300 seconds = 5 minutes
};