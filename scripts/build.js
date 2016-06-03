/* eslint-env node */

const rollup = require("rollup")
const babel = require("rollup-plugin-babel")
const npm = require("rollup-plugin-node-resolve")
const string = require("rollup-plugin-string")

rollup.rollup({
  entry: "src/app.js",
  plugins: [
    string({
      extensions: [
        "svg"
      ]
    }),
    npm({
      jsnext: true,
      main: true
    }),
    babel()
  ]
}).then(bundle => {
  bundle.write({
    dest: "build/app.js",
    format: "iife"
  })
})
.catch(error => console.error(error))
