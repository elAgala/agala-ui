import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import path from 'node:path'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      tsconfigPath: './tsconfig.json',
      outDir: 'dist',
      entryRoot: 'src',
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'AgalaCharts',
      fileName: () => 'agala-charts.es.js',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['vue', 'echarts', 'vue-echarts'],
      output: {
        globals: {
          vue: 'Vue',
          echarts: 'echarts',
          'vue-echarts': 'VueECharts',
        },
      },
    },
    cssCodeSplit: true,
    sourcemap: true,
    minify: true,
  },
})
