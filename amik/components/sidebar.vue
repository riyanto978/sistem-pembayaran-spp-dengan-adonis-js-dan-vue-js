<template>
  <v-navigation-drawer
    id="app-drawer"
    v-model="sidebar"
    app
    dark
    floating
    persistent
    mobile-break-point="991"
    width="230"
  >
    <v-img height="100%">
      <v-layout class="fill-height" tag="v-list" column>
        <v-toolbar :color="`${$store.state.warna} darken-3 white--text`" height="50px">
          <v-toolbar-title class="ml-0 pl-3">
            <v-icon small color="white">home</v-icon>
            <span class="hidden-sm-and-down">AMIK</span>
          </v-toolbar-title>
        </v-toolbar>
        <v-divider></v-divider>
        <v-list-tile
          v-for="(link, i) in filterItems"
          :key="i"
          :to="link.to"
          :active-class="ambilWarna"
          avatar
          class="v-list-item"
        >
          <v-list-tile-action>
            <v-icon>{{ link.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-title v-text="link.title"/>
        </v-list-tile>
      </v-layout>
    </v-img>
  </v-navigation-drawer>
</template>

<script>
export default {
  data: () => ({
    logo: './img/vuetifylogo.png',
    sidebar: true,
    image: '/sidebar-4.3b7e38ed.jpg',
    items: [
      {
        icon: 'home',
        title: 'Beranda',
        to: '/',
        level: ['admin', 'kasir']
      },
      {
        icon: 'card_travel',
        title: 'Sub Bayar',
        to: '/admin/sub_bayar',
        level: ['admin', 'kasir']
      },
      {
        icon: 'assignment',
        title: 'Angkatan',
        to: '/admin/angkatan',
        level: ['admin', 'kasir']
      },
      {
        icon: 'face',
        title: 'Mahasiswa',
        to: '/admin/mahasiswa',
        level: ['admin', 'kasir']
      },
      {
        icon: 'shopping_cart',
        title: 'pembayaran',
        to: '/pembayaran',
        level: ['admin', 'kasir']
      },      
      {
        icon: 'description',
        title: 'resume',
        to: '/resume',
        level: ['admin', 'kasir']
      }
    ],
    responsive: false
  }),
  computed: {
    filterItems() {
      return this.items.filter(pros =>
        pros.level.includes(this.$store.state.auth.user.level)
      )
    },
    ambilWarna() {
      return this.$store.state.warna
    }
  },
  mounted() {
    this.onResponsiveInverted()
    window.addEventListener('resize', this.onResponsiveInverted)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResponsiveInverted)
  },
  methods: {
    onResponsiveInverted() {
      if (window.innerWidth < 991) {
        this.responsive = true
      } else {
        this.responsive = false
      }
    },
    drawer() {
      this.sidebar = !this.sidebar
    }
  }
}
</script>

<style lang="scss" >
#app-drawer {
  .v-list__tile {
    border-radius: 4px;

    &--buy {
      margin-top: 0px;
      margin-bottom: 0px;
    }
  }

  .v-image__image--contain {
    top: 9px;
    height: 60%;
  }
}
</style>
<style lang="scss" scoped>
@import '~/assets/index.scss';
</style>