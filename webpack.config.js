const path = require("path");
const fs = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { getIndexTemplate } = require("./index.html");

const SKETCH_PATH = path.resolve(__dirname, "./src/sketches");
const sketches = fs.readdirSync(SKETCH_PATH);

const sketchEntries = sketches.reduce(
    (entries, sketch) => ({
        ...entries,
        [sketch]: path.join(SKETCH_PATH, sketch, "index.ts"),
    }),
    {},
);

const sketchHtmlFiles = sketches.map(
    (sketch) =>
        new HtmlWebpackPlugin({
            filename: `${sketch}.html`,
            title: `${sketch} sketch`,
            chunks: [sketch],
        }),
);

/**
 * Gathers everything from /sketches, creates an html file for each
 * and an index page to navigate between them
 */
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
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    plugins: [
        ...sketchHtmlFiles,
        new HtmlWebpackPlugin({
            filename: "index.html",
            templateContent: getIndexTemplate(sketches),
            chunks: [],
        }),
    ],
};
