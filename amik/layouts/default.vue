<template>
  <v-app>
    <v-snackbar
      v-model="snackbar"
      :left="true"
      :bottom="true"
      :timeout="5000"
      :multi-line="true"
      :color="color"
      :auto-height="true"
    >
      {{ text }}
      <v-btn color="pink" flat @click="snackbar = false">Close</v-btn>
    </v-snackbar>
    
    <sidebar ref="sidebar"></sidebar>
    <!-- <v-navigation-drawer id="app-drawer" v-model="drawer" fixed floating persistent app width="230">
      <v-toolbar color="blue darken-3 white--text" height="50px">
        <v-toolbar-title class="ml-0 pl-3">
          <v-icon small color="white">home</v-icon>
          <span class="hidden-sm-and-down">Perso</span>
        </v-toolbar-title>
      </v-toolbar>
      <v-layout class="fill-height" tag="v-list" column>
        <v-list>
          <v-list-tile
            v-for="(item, i) in filterItems"
            active-class="blue"
            :key="i"
            :to="item.to"
            router
            exact
            avatar
          >
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title v-text="item.title"/>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-layout>
    </v-navigation-drawer>-->
    
    <v-toolbar
      :clipped-left="clipped"
      fixed
      app
      :color="`${$store.state.warna} darken-1 white--text`"
      height="50px"
    >
      <v-toolbar-side-icon flat color="white" @click="sidebar"/>      
      
      <v-spacer></v-spacer>
      <digital-clock :blink="true" displaySeconds="true"></digital-clock>
      <!-- <v-img
        max-height="50px"
        max-width="50px"
        height="40px"
        width="60px"
        style="border-radius : 30%"
        :src="`http://localhost:3333/foto/${$store.state.auth.user.foto}`"
      ></v-img> -->
      <v-menu offset-y origin="center center" :nudge-bottom="10" transition="scale-transition">
        <v-btn icon large flat slot="activator">
          <v-icon color="white">list</v-icon>
        </v-btn>
        <v-list class="pa-0">
          <v-list-tile>            
            <v-list-tile-content>
              <nuxt-link to="/admin/user"><v-btn flat>user</v-btn></nuxt-link>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile>            
            <v-list-tile-content>
              <v-btn flat @click="logout">logout</v-btn>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar>
    <v-content>
      <v-toolbar class="elevation-0 transparent media-toolbar" height="50px">
        <v-layout row class="align-center">
          <div class="page-header-left">
            <h2 class="pr-3">{{ $store.state.judul }}</h2>
          </div>
          <v-spacer></v-spacer>
          <div class="page-header-right">
            <v-breadcrumbs :items="breadcrumb" router class="justify-end">
              <v-icon slot="divider">chevron_right</v-icon>
            </v-breadcrumbs>
          </div>
        </v-layout>
      </v-toolbar>
      <v-divider></v-divider>
      <nuxt/>
    </v-content>
    <v-navigation-drawer v-model="rightDrawer" :right="right" temporary fixed hide-overlay>
      <v-list>
        <v-list-tile>
          <v-list-tile-title>Setting</v-list-tile-title>
        </v-list-tile>
        <v-list-tile-content>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-container>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-text-field
                    label="nama"
                    v-model="user.name"
                    :rules="[v=> !!v || 'harus diisi']"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    label="username"
                    v-model="user.username"
                    :rules="[v=> !!v || 'harus diisi']"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field type="password" v-model="user.password" label="password"></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <input type="file" id="file" ref="file">
                </v-flex>
                <v-btn color="blue darken-1" :disabled="!valid" @click="save">Save</v-btn>
              </v-layout>
            </v-container>
          </v-form>
        </v-list-tile-content>
      </v-list>
      <filters></filters>
    </v-navigation-drawer>
    <v-btn
      small
      fab
      dark
      falt
      fixed
      bottom
      right="right"
      class="setting-fab"
      color="red"
      @click.native="rightDrawer = !rightDrawer"
    >
      <v-icon>settings</v-icon>
    </v-btn>
    <v-footer :fixed="fixed" app>      
      <span>&copy; Riyanto Nugroho 2019</span>
    </v-footer>
  </v-app>
</template>

<script>
import DigitalClock from 'vue-digital-clock'
import sidebar from '~/components/sidebar'
import filters from '~/components/Filter'
// import menu from '@/plugins/menu'

// import Ws from '@adonisjs/websocket-client'
// const ws = Ws('ws://localhost:3333')

// const chat = ws.subscribe('chat').connect()

// import io from 'socket.io-client'

export default {
  components: {
    DigitalClock,
    sidebar,
    filters
  },
  data() {
    return {
      message : 'sadas',
      messages : [],
      backgroundImage: '/sidebar-2.32103624.jpg',
      clipped: false,
      valid: true,
      text: '',
      snackbar: false,
      color: '',
      seting: false,
      drawer: true,
      fixed: false,
      mini: false,
      miniVariant: false,
      right: true,
      rightDrawer: false,
      user: {},
      title: '',
      file: '',
      // socket: io('http://localhost:3333'),
      items: [
        {
          icon: 'home',
          title: 'Beranda',
          to: '/',
          level: ['admin', 'reguler']
        },
        {
          icon: 'bubble_chart',
          title: 'Proses',
          to: '/admin/proses',
          level: ['admin', 'reguler']
        },
        {
          icon: 'list',
          title: 'laporan',
          to: '/laporan',
          level: ['admin', 'reguler']
        },
        {
          icon: 'lock',
          title: 'user',
          to: '/admin/user',
          level: ['admin']
        },
        {
          icon: 'lock',
          title: 'resume',
          to: '/admin/resume',
          level: ['admin']
        },
        {
          icon: 'lock',
          title: 'monitoring',
          to: '/admin/monitoring',
          level: ['admin']
        }
      ]
    }
  },
  computed: {
    breadcrumb() {
      return this.$store.state.list
    },
    filterItems() {
      return this.items.filter(pros =>
        pros.level.includes(this.$store.state.auth.user.level)
      )
    }
  },

  created() {
    this.user = this.$store.state.auth.user      
  },

  methods: {
    logout() {
      this.$store.commit('DELETE_USER', 'sasd')
      this.$router.push('/login')
    },
    tampilAlert(alert, color) {
      this.text = alert
      this.color = color
      this.snackbar = true
    },
    sidebar() {
      this.$refs.sidebar.drawer()
    },    
    save() {
      if (this.$refs.form.validate()) {
        var file = this.$refs.file.files[0]
        this.snackbar = false
        var id = this.user.id
        let formData = new FormData()
        formData.append('foto', file)
        formData.append('name', this.user.name)
        formData.append('username', this.user.username)
        formData.append('password', this.user.password)

        this.$axios
          .put('user/' + id, formData, {
            headers: {
              Authorization: 'Bearer ' + this.$store.state.auth.token.token,
              'Content-Type': 'multipart/form-data'
            }
          })
          .then(response => {
            this.user = response.data.data
            this.tampilAlert('Berhasil Diupdate', 'blue darken-2')
          })
          .catch(error => {
            this.tampilAlert('gagal Diupdate', 'red darken-2')
          })
      }
    }
  }
}
</script>

