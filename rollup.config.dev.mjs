import serve from 'rollup-plugin-serve';
import baseConfig from  './rollup.config.mjs'
export default {
  ...baseConfig,
  plugins: [
    ...baseConfig.plugins,
    serve({
      open: true,
      contentBase: 'build',
      port: 3000,
    }),
  ],
};
