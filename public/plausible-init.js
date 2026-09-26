window.plausible = window.plausible || function (...args) {
  (window.plausible.q = window.plausible.q || []).push(...args)
}
window.plausible.init = window.plausible.init || function (options) {
  window.plausible.o = options || {}
}
window.plausible.init()
