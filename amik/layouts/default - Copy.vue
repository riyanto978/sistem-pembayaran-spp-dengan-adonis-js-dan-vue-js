<template>
  <v-app>
    <!-- <v-navigation-drawer
      v-model="drawer"
      :mini-variant.sync="mini"
      width="230"
      fixed
      app
      
      class="brown lighten-5"
    >
      <v-toolbar color="blue darken-3 white--text" height="50px">
        <v-toolbar-title class="ml-0 pl-3">
          <v-icon small color="white">home</v-icon>
          <span class="hidden-sm-and-down">Vue Material</span>
        </v-toolbar-title>
      </v-toolbar>

      
    </v-navigation-drawer>-->
    <v-navigation-drawer v-model="drawer" :mini-variant="miniVariant" :clipped="clipped" fixed app width="230">
      <v-toolbar color="blue darken-3 white--text" height="50px">
        <v-toolbar-title class="ml-0 pl-3">
          <v-icon small color="white">home</v-icon>
          <span class="hidden-sm-and-down">Vue Material</span>
        </v-toolbar-title>
      </v-toolbar>
      <v-list dense expand>
        <template v-for="(item, i) in menus">
            <!--group with subitems-->
            <v-list-group v-if="item.items" :key="item.name" :group="item.group" :prepend-icon="item.icon" no-action="no-action">
              <v-list-tile slot="activator" ripple="ripple">
                <v-list-tile-content>
                  <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
              <template v-for="(subItem, i) in item.items">
                <!--sub group-->
                <v-list-group v-if="subItem.items" :key="subItem.name" :group="subItem.group" sub-group="sub-group">
                  <v-list-tile slot="activator" ripple="ripple">
                    <v-list-tile-content>
                      <v-list-tile-title>{{ subItem.title }}</v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-list-tile v-for="(grand, i) in subItem.children" :key="i"  :href="grand.href" ripple="ripple">
                    <v-list-tile-content>
                      <v-list-tile-title>{{ grand.title }}</v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </v-list-group>
                <!--child item-->
                <v-list-tile v-else :key="i" nuxt :to="subItem.name" :disabled="subItem.disabled" :target="subItem.target" ripple="ripple">
                  <v-list-tile-content>
                    <v-list-tile-title><span>{{ subItem.title }}</span></v-list-tile-title>
                  </v-list-tile-content>
                  
                  <v-list-tile-action v-if="subItem.action">
                    <v-icon :class="[subItem.actionClass || 'success--text']">{{ subItem.action }}</v-icon>
                  </v-list-tile-action>
                </v-list-tile>
              </template>
            </v-list-group>
            <v-subheader v-else-if="item.header" :key="i">{{ item.header }}</v-subheader>
            <v-divider v-else-if="item.divider" :key="i"></v-divider>
            <!--top-level link-->
            <v-list-tile v-else :to="!item.href ? { name: item.name } : null" :href="item.href" ripple="ripple" :disabled="item.disabled" :target="item.target" rel="noopener" :key="item.name">
              <v-list-tile-action v-if="item.icon">
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              </v-list-tile-content>              
              <v-list-tile-action v-if="item.subAction">
                <v-icon class="success--text">{{ item.subAction }}</v-icon>
              </v-list-tile-action>
              
            </v-list-tile>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar :clipped-left="clipped" fixed app color="blue darken-1 white--text" height="50px">
      <v-toolbar-side-icon flat color="white" @click="drawer = !drawer"/>
      <v-spacer></v-spacer>
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon color="white">{{ `chevron_${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-btn icon @click.stop="clipped = !clipped">
        <v-icon color="white">web</v-icon>
      </v-btn>
      <v-btn icon @click.stop="fixed = !fixed">
        <v-icon color="white">remove</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title"/>
      <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon color="white">menu</v-icon>
      </v-btn>
      <v-menu offset-y origin="center center" :nudge-bottom="10" transition="scale-transition">
        <v-btn icon large flat slot="activator">
          <v-icon>list</v-icon>
        </v-btn>
        <v-list class="pa-0">
          <v-list-tile>
            <v-list-tile-content>
              <v-list-tile-title>
                <v-btn flat @click="logout">logout</v-btn>
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar>
    <v-content>
      <v-toolbar class="elevation-0 transparent media-toolbar" height="50px">
        <v-layout row class="align-center">
          <div class="page-header-left">
            <h2 class="pr-3">{{title}}</h2>
          </div>
          <v-spacer></v-spacer>
          <div class="page-header-right">
            <v-breadcrumbs :items="breadcrumb" :nuxt-link="true" divider="-" class="justify-end"></v-breadcrumbs>
          </div>
        </v-layout>
      </v-toolbar>
      <v-divider></v-divider>

      <v-container grid-list-xl fluid>
        <!-- <v-layout row wrap >          
          <v-flex lg12 sm12 xs12>     
            <div class="page-header-left">
              <h3 class="pr-3">{{title}}</h3>
          </div>       
            <v-breadcrumbs :items="breadcrumb" :nuxt-link="true"  divider="-" class="justify-end"></v-breadcrumbs>
          </v-flex>
        </v-layout>-->
        <nuxt/>
      </v-container>
    </v-content>
    <v-navigation-drawer v-model="rightDrawer" :right="right" temporary fixed>
      <v-list>
        <v-list-tile @click.native="right = !right">
          <v-list-tile-action>
            <v-icon light>compare_arrows</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Switch drawer (click me)</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-footer :fixed="fixed" app>
      <span>&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapMutations } from 'vuex'
import menu from '@/plugins/menu'

export default {
    
  data() {
    return {
      clipped: false,
      drawer: true,
      fixed: false,
      mini: false,
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js',
      menus: menu,
      admin1: {
        title: 'Log',
        group: 'widgets',
        icon: 'widgets',
        items: [
          { name: '/preperso/log/cariLog', title: 'Cari Log' },
          { name: '/preperso/log/cariUid', title: 'Cari Uid' },
          { name: '/preperso/log/bandingLog', title: 'Banding Log' }
        ]
      },
      admin2: {
        title: 'Other',
        group: 'widgets',
        icon: 'widgets',
        items: [
          { name: '/preperso/other/rekapitulasi', title: 'Rekapitulasi' },
          { name: '/preperso/other/manifest', title: 'Manifest' },
          { name: '/preperso/other/pesan', title: 'Pesan' },
          { name: '/preperso/other/pengiriman', title: 'Pengiriman' },
          { name: '/preperso/other/resume', title: 'Resume' }
        ]
      },
      admin3: {
        title: 'Administrator',
        group: 'widgets',
        icon: 'widgets',
        items: [
          { name: '/preperso/admin/pol', title: 'Tambah Pol' },
          { name: '/preperso/admin/user', title: 'Tambah User' },
          { name: '/preperso/admin/proses', title: 'Tambah Proses' }
        ]
      }
    }
  },
  computed: {
    breadcrumb() {
      return this.$store.state.bread.list
    }
  },

  created() {
    if (this.$store.state.user.auth.level == 1) {
      this.menus.push(this.admin1)
      this.menus.push(this.admin2)
      this.menus.push(this.admin3)
    }

    this.title = this.$store.state.judul
  },

  methods: {
    logout() {
      
      this.$store.commit('user/DELETE_USER')
      this.$router.push('login')
    }
  }
}
</script>
