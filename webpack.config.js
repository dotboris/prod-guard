import { readFile } from "node:fs/promises";
import path from "path";
import sharp from "sharp";
import CopyPlugin from "copy-webpack-plugin";
import CleanPlugin from "webpack-clean-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";

const ICON_SIZES = [16, 24, 32, 48, 64, 96, 128];

function isProd() {
  return process.env.NODE_ENV === "production";
}

async function patchManifest(manifestContent) {
  const packageJson = JSON.parse(
    await readFile(path.join(import.meta.dirname, "package.json")),
  );

  const manifest = JSON.parse(manifestContent);

  let darkIcons = ICON_SIZES.map((size) => [
    String(size),
    pngIconPath("dark", size),
  ]);
  darkIcons = Object.fromEntries(darkIcons);

  const themeIcons = ICON_SIZES.map((size) => ({
    size,
    light: pngIconPath("light", size),
    dark: pngIconPath("dark", size),
  }));

  manifest.version = packageJson.version;
  manifest.icons = darkIcons;
  manifest.action.default_icon = darkIcons;
  manifest.action.theme_icons = themeIcons;

  return JSON.stringify(manifest);
}

function pngIconPath(type, size) {
  return `icon/icon-${type}-${size}.png`;
}

function copyPluginIconPatterns() {
  const res = ["dark", "light"].flatMap((type) =>
    ICON_SIZES.map((size) => {
      return {
        from: `icon/${type}-icon.svg`,
        to: pngIconPath(type, size),
        async transform(content) {
          return sharp(content).resize(size).png().toBuffer();
        },
      };
    }),
  );

  return res;
}

export default async () => ({
  mode: isProd() ? "production" : "development",

  context: path.resolve(import.meta.dirname, "src"),
  entry: {
    "content-script": "./content-script",
    background: "./background",
    popup: "./popup",
  },

  plugins: [
    new CleanPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: "manifest.json",
          to: "manifest.json",
          async transform(content) {
            return await patchManifest(content);
          },
        },
        ...copyPluginIconPatterns(),
      ],
    }),
    new HtmlWebpackPlugin({
      chunks: ["popup"],
      filename: "popup.html",
      title: "Prod Guard Settings",
    }),
  ],

  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.svg$/,
        type: "asset/source",
      },
      {
        test: /\.svg$/,
        resourceQuery: /data-uri/,
        type: "asset/inline",
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: "asset/resource",
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
    ],
  },

  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },

  devtool: "source-map",
});
