import { defineConfig } from 'vite';
import path from 'path';
import vue from '@vitejs/plugin-vue';
import viteCompression from 'vite-plugin-compression';
import ViteComponents, { kebabCase } from 'vite-plugin-components';
import vueJsx from '@vitejs/plugin-vue-jsx';
import legacy from '@vitejs/plugin-legacy';
import styleImport from 'vite-plugin-style-import';
import { generateModifyVars } from './build/style/generateModifyVars';
// import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
// pwa配置，如果需要pwa，就把这个配置加入到plugins中
/**
 * VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: "纸贵科技",
        short_name: "纸贵科技",
        display: "standalone",
        icons: [
          { src: "/logo*512.png", type: "image/png", sizes: "512x512" },
          { src: "/logo*256.png", type: "image/png", sizes: "256x256" },
          { src: "/logo*128.png", type: "image/png", sizes: "128x128" },
          { src: "/logo*64.png", type: "image/png", sizes: "64x64" },
        ],
        start_url: "/",
        background_color: "#F9F9F9",
        theme_color: "#3A3F51",
      },
      workbox: {},
    }),
 */

interface IMatcher {
  pattern: RegExp;
  styleDir: string;
}

const matchComponents: IMatcher[] = [
  {
    pattern: /^Avatar/,
    styleDir: 'avatar'
  },
  {
    pattern: /^AutoComplete/,
    styleDir: 'auto-complete'
  },
  {
    pattern: /^Anchor/,
    styleDir: 'anchor'
  },

  {
    pattern: /^Badge/,
    styleDir: 'badge'
  },
  {
    pattern: /^Breadcrumb/,
    styleDir: 'breadcrumb'
  },
  {
    pattern: /^Button/,
    styleDir: 'button'
  },
  {
    pattern: /^Checkbox/,
    styleDir: 'checkbox'
  },
  {
    pattern: /^Card/,
    styleDir: 'card'
  },
  {
    pattern: /^Collapse/,
    styleDir: 'collapse'
  },
  {
    pattern: /^Descriptions/,
    styleDir: 'descriptions'
  },
  {
    pattern: /^RangePicker|^WeekPicker|^MonthPicker/,
    styleDir: 'date-picker'
  },
  {
    pattern: /^Dropdown/,
    styleDir: 'dropdown'
  },

  {
    pattern: /^Form/,
    styleDir: 'form'
  },
  {
    pattern: /^InputNumber/,
    styleDir: 'input-number'
  },

  {
    pattern: /^Input|^Textarea/,
    styleDir: 'input'
  },
  {
    pattern: /^Statistic/,
    styleDir: 'statistic'
  },
  {
    pattern: /^CheckableTag/,
    styleDir: 'tag'
  },
  {
    pattern: /^Layout/,
    styleDir: 'layout'
  },
  {
    pattern: /^Menu|^SubMenu/,
    styleDir: 'menu'
  },

  {
    pattern: /^Table/,
    styleDir: 'table'
  },
  {
    pattern: /^Radio/,
    styleDir: 'radio'
  },

  {
    pattern: /^Image/,
    styleDir: 'image'
  },

  {
    pattern: /^List/,
    styleDir: 'list'
  },

  {
    pattern: /^Tab/,
    styleDir: 'tabs'
  },
  {
    pattern: /^Mentions/,
    styleDir: 'mentions'
  },

  {
    pattern: /^Mentions/,
    styleDir: 'mentions'
  },

  {
    pattern: /^Step/,
    styleDir: 'steps'
  },
  {
    pattern: /^Skeleton/,
    styleDir: 'skeleton'
  },

  {
    pattern: /^Select/,
    styleDir: 'select'
  },
  {
    pattern: /^TreeSelect/,
    styleDir: 'tree-select'
  },
  {
    pattern: /^Tree|^DirectoryTree/,
    styleDir: 'tree'
  },
  {
    pattern: /^Typography/,
    styleDir: 'typography'
  },
  {
    pattern: /^Timeline/,
    styleDir: 'timeline'
  }
];

export default defineConfig({
  server: {
    port: 8990,
    host: '0.0.0.0',
    open: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@types': path.resolve(__dirname, 'src/@types')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@/assets/styles/app.scss";'
      },
      less: {
        modifyVars: generateModifyVars(),
        javascriptEnabled: true
      }
    }
  },
  build: {
    target: 'es2015',
    rollupOptions: {
      output: {
        // 配置额外的入口
        manualChunks: {
          antdv: ['ant-design-vue']
        }
      }
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11']
    }),
    viteCompression({
      verbose: true,
      algorithm: 'gzip',
      threshold: 10240
    }),
    styleImport({
      libs: [
        {
          libraryName: 'ant-design-vue',
          esModule: true,
          resolveStyle: (name) => {
            return `ant-design-vue/es/${name}/style/index`;
          }
        }
      ]
    }),
    ViteComponents({
      customComponentResolvers: [
        (name) => {
          if (name.match(/^A[A-Z]/)) {
            //Ant-Design-Vue
            const importStyle = true;
            const importName = name.slice(1);
            let styleDir;
            if (importStyle) {
              const total = matchComponents.length;
              for (let i = 0; i < total; i++) {
                const matcher = matchComponents[i];
                if (importName.match(matcher.pattern)) {
                  styleDir = matcher.styleDir;
                  break;
                }
              }

              if (!styleDir) {
                styleDir = kebabCase(importName);
              }
            }
            return {
              importName: importName,
              path: `ant-design-vue/es`,
              sideEffects: importStyle ? `ant-design-vue/es/${styleDir}/style` : undefined
            };
          }
          return null;
        }
      ],
      globalComponentsDeclaration: true
    }),
    vue(),
    vueJsx()
  ]
});
