import typescript from "@rollup/plugin-typescript";
import { terser } from 'rollup-plugin-terser';
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import path from "node:path";
// import dts from 'rollup-plugin-dts'; // 将 ts 声明文件打包成 js

const resolveFile = (filePath) => {

    return path.join(process.cwd(), filePath);
};

const plugins = [
    resolve(),
    commonjs(),
    json({
        compact: true
    }),
    typescript({
        tsconfig: resolveFile("./tsconfig.json"),
        // compilerOptions: { outDir: resolveFile("../dist/roapi.esm.js") },
        include: ["src/**/*.ts"],
        exclude: ["node_modules/**"]
    }),
    // dts(),
    terser()
];

export default {
    input: resolveFile("./src/index.ts"),
    output: [
        {
            file: resolveFile("./dist/roapi.esm.js"),
            format: "esm",
            name: 'roapi',
            // sourcemap: true
        },
        {
            file: resolveFile("./dist/roapi.cjs.js"),
            format: "cjs",
            name: 'roapi',
            // sourcemap: true
        },
        {
            file: resolveFile("./dist/roapi.js"),
            format: "iife",
            name: 'roapi',
            // sourcemap: true
        }
    ],
    plugins
};
