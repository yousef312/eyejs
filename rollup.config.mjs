import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

export default [
  {
    input: 'src/eye.js',
    output: [
      {
        file: 'dist/eye.umd.js',
        format: 'umd',
        name: 'eye',
        sourcemap: true,
      },
      {
        file: 'dist/eye.umd.min.js',
        format: 'umd',
        name: 'eye',
        plugins: [terser()],
        sourcemap: true,
      },
      {
        file: 'dist/eye.esm.js',
        format: 'es',
        sourcemap: true,
      },
      {
        file: 'dist/eye.cjs.js',
        format: 'cjs',
        sourcemap: true,
      }
    ],
    plugins: [
      resolve(),
      commonjs()
    ]
  }
];