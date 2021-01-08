const path = require("path");
const fs = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const SKETCH_PATH = path.resolve(__dirname, "./src/sketches");

const sketchFiles = fs
    .readdirSync(SKETCH_PATH)
    .map((filePath) => ({ name: filePath.split(".")[0], filePath }));

const sketchEntries = sketchFiles.reduce(
    (acc, { name, filePath }) => ({
        ...acc,
        [name]: path.join(SKETCH_PATH, filePath),
    }),
    {},
);

const sketchHtmlFiles = sketchFiles.map(
    ({ name }) =>
        new HtmlWebpackPlugin({
            filename: `${name}.html`,
            title: `${name} sketch`,
            chunks: [name],
        }),
);

module.exports = {
    mode: "development",
    devtool: "inline-source-map",
    devServer: {
        open: true,
        hot: true,
        contentBase: "./dist",
    },
    entry: sketchEntries,
    output: {
        path: path.resolve(__dirname, "./dist"),
        filename: "[name].bundle.js",
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    plugins: [...sketchHtmlFiles],
};
