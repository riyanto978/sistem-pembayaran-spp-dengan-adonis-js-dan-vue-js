import Vue from 'vue'
//  import ws from 'adonis-websocket-client'
//  const wsVuePlugin = function (Vue, url, options) { Vue.prototype.$io = ws(url, options) }
//   Vue.use(wsVuePlugin, 'http://localhost:3333/', {})


// //   import Ws from '@adonisjs/websocket-client'
// // const ws = Ws('ws://localhost:3333')

import VueSocketIO from 'vue-socket.io'

// Vue.use(VueSocketio, 'http://localhost:3333')

Vue.use(new VueSocketIO({
  connection: 'http://localhost:3333', //options object is Optional
  })
)