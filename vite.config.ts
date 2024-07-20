import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  resolve: {
    dedupe: ['vue'],
  },
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue', '@vueuse/core'],
      dts: resolve('src/auto-imports.d.ts'),
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [
        IconsResolver({
          enabledCollections: ['ep']
        }),
        ElementPlusResolver({
          importStyle: 'sass'
        })
      ],
      extensions: ['vue', 'md'],
      include: [/\.vue$/, /\.tsx$/, /\.vue\?vue/, /\.md$/],
      dts: 'components.d.ts',
      directoryAsNamespace: true
    }),
    Icons({
      autoInstall: true
    }),
  ],
  server: {
    watch: {
      ignored: ['!**/node_modules/@vue-flow/**/*'],
    },
  },
  optimizeDeps: {
    exclude: ['@vue-flow/core', '@vue-flow/minimap', '@vue-flow/controls', '@vue-flow/background'],
  },
})
