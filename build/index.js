import typescript from "@rollup/plugin-typescript";
import { terser } from 'rollup-plugin-terser';
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import path from "node:path";
import { nodeExternals } from 'rollup-plugin-node-externals'


const resolveFile = (filePath) => {
    return path.join(process.cwd(), filePath);
};

const plugins = [
    resolve(),
    nodeExternals(),
    commonjs(),
    json({
        compact: true
    }),
    typescript({
        tsconfig: resolveFile("./tsconfig.json"),
        include: ["src/**/*.ts"],
        exclude: ["node_modules/**"]
    }),
    terser()
];

const createConfig = (format) => {
    const isIIFE = format === 'iife';
    return {
        input: resolveFile("./src/index.ts"),
        output: {
            file: format === 'esm' ? resolveFile("./dist/index.js")
                : format === 'cjs' ? resolveFile("./dist/rokapi.cjs.js")
                    : resolveFile("./dist/rokapi.min.js"),
            format,
            name: 'rokapi',
            globals: {
                'spark-md5': 'SparkMD5', // 指定全局变量名
            },
        },
        external: isIIFE ? [] : ['spark-md5'],
        plugins,
    }
}

export default [
    createConfig('esm'),
    createConfig('cjs'),
    createConfig('iife')
]


// export default {
//     input: resolveFile("./src/index.ts"),
//     output: [
//         {
//             file: resolveFile("./dist/index.js"),
//             format: "esm",
//             name: 'rokapi',
//             globals: {
//                 'spark-md5': 'SparkMD5', // 指定全局变量名
//             },
//             // sourcemap: true
//         },
//         {
//             file: resolveFile("./dist/rokapi.cjs.js"),
//             format: "cjs",
//             name: 'rokapi',
//             globals: {
//                 'spark-md5': 'SparkMD5', // 指定全局变量名
//             },
//             // sourcemap: true
//         },
//         {
//             file: resolveFile("./dist/rokapi.min.js"),
//             format: "iife",
//             name: 'rokapi',
//             globals: {
//                 'spark-md5': 'SparkMD5', // 指定全局变量名
//             },
//             // sourcemap: true
//         }
//     ],
//     plugins
// };
