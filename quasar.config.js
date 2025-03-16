/* eslint-env node */
module.exports = function (ctx) {
  return {
    supportTS: true,
    boot: ['i18n', 'axios', 'theme', 'pinia'],
    css: ['app.scss'],
    extras: ['material-icons'],
    build: {
      target: {
        browser: ['es2019', 'edge88', 'firefox78', 'chrome87', 'safari13.1'],
        node: 'node16'
      },
      vueRouterMode: 'history'
    },
    devServer: {
      open: true,
      port: 8080
    },
    framework: {
      config: {},
      plugins: ['Notify', 'Dialog']
    },
    animations: [],
    sourceFiles: {
      rootComponent: 'src/App.vue',
      router: 'src/router/index',
      store: 'src/stores/index',
      indexHtmlTemplate: 'src/index.template.html'
    }
  }
}