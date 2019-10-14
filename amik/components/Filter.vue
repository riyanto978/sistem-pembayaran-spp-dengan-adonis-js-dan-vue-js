<template>
    <v-card>
      <v-container grid-list-xl>
        <v-layout wrap>
          <v-flex xs12>
            <div class="text-xs-center body-2 text-uppercase sidebar-filter">Sidebar Warna</div>
            <v-layout justify-center>
              
              <v-btn v-for="c in colors"
                :key="c"
                fab
                small
                :color="c"                
                size="40"                
                @click="setColor(c)">

              </v-btn>
            </v-layout>
            <v-divider class="mt-3"/>
          </v-flex>
          <v-flex xs12>
            <div class="text-xs-center body-2 text-uppercase sidebar-filter">Images</div>
          </v-flex>
          <v-flex v-for="img in images" :key="img" xs3>
            <v-img
              :class="[image === img ? 'image-active' : '']"
              :src="img"
              height="120"
              @click.native="setImage(img)"
            />
          </v-flex>          
        </v-layout>
      </v-container>
    </v-card>
  
</template>

<script>
export default {
  data: () => ({
    color: 'primary',
    image: '/sidebar-4.3b7e38ed.jpg',
    colors: ['blue','amber','lime','pink','purple'],
    images: [
      '/sidebar-1.23832d31.jpg',
      '/sidebar-2.32103624.jpg',
      '/sidebar-3.3a54f533.jpg',
      '/sidebar-4.3b7e38ed.jpg'
    ]
  }),

  computed: {},

  methods: {
    setColor(item){
      this.$store.commit('SET_WARNA', item)
    },
    setImage(img){
      this.$store.commit('SET_IMAGE', img)
    }

  }
}
</script>


