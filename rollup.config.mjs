import html from '@rollup/plugin-html';
import scss from 'rollup-plugin-scss';
import pug from 'rollup-plugin-pug';
import copy from 'rollup-plugin-copy';
import sass from 'sass'; 

export default {
  input: './src/main.js',
  output: {
    file: './build/bundle.js',
    format: 'es',
    sourcemap: true,
  },
  plugins: [
    pug({
      compileOptions: {
        pretty: true,
      },
    }),
    scss({
      output: './build/bundle.css',
      sass: sass, 
    }),
    html({
        template: () => {
       
          return `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="stylesheet" href="./bundle.css">
              </head>
              <body>
                <div id="template"></div>
                <script type="module" src="./bundle.js"></script>
              </body>
            </html>
          `;
        },
      },
    ),
    copy({
      targets: [
        { src: 'src/images/*', dest: './build/images' },
        { src: 'src/fonts/*', dest: './build/fonts' },
        { src: 'src/styles/*', dest: './build/styles' },
        { src: 'src/ui/*', dest: './build/ui' },
        { src: 'src/views/*', dest: './build/views' },
      ],
    })
  ],
};
