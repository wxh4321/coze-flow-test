import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

export default defineConfig({
  base: '/coze-flow-test/',
  resolve: {
    dedupe: ['vue'],
    alias: {
      '@': resolve('src'),
    },
  },
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue', '@vueuse/core'],
      dts: resolve('src/auto-imports.d.ts'),
      resolvers: [
        ElementPlusResolver(),
        IconsResolver({
          prefix: 'Icon'
        })
      ],
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
    createSvgIconsPlugin({
      iconDirs: [resolve(process.cwd(), 'src/WorkFlow/svg')],
      symbolId: 'icon-[dir]-[name]'
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
