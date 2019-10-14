<template>
  <v-container align-center>
    <v-layout row wrap>      
      <v-flex xs2>
        <v-menu
          ref="menu"
          :close-on-content-click="false"
          v-model="menu"
          :nudge-right="40"
          :return-value.sync="dateAwal"
          lazy
          transition="scale-transition"
          offset-y
          full-width
        >
          <v-text-field
            label="Tanggal Awal"
            readonly
            slot="activator"
            v-model="dateAwal"
            prepend-icon="event"
          ></v-text-field>
          <v-date-picker
            format="dd/mm/yyyy"
            no-title
            @change="ambilMonitoring"
            v-model="dateAwal"
            @input="$refs.menu.save(dateAwal)"
          ></v-date-picker>
        </v-menu>
      </v-flex>
      <v-flex xs1 offset-xs1>
        <v-select @change="ambilMonitoring" :items="[1,2]" label="Shift" v-model="shift"></v-select>
      </v-flex>
      <v-flex xs12>
        
            <v-data-table
              :headers="headersMonitoring"
              hide-actions
              :items="dataMonitoring"
              class="elevation-1"
            >
              <template slot="items" slot-scope="props">
                <tr>
                  <td>{{ props.index + 1 }}</td>
                  <td>{{ props.item.kode_pol }}</td>
                  <td>{{ props.item.nama_pol }}</td>
                  <td>{{ props.item.proses }}</td>
                  <td>{{ props.item.total }}</td>
                  <td>{{ props.item.dead }}</td>
                  <td>{{ props.item.error }}</td>
                  <td>{{ props.item.lemah }}</td>
                </tr>
              </template>
              <template slot="no-data">
                <div class="text-xs-center">Tidak Ada Data</div>
              </template>
            </v-data-table>
            <br>          
      </v-flex>
      <v-flex xs12 v-for="(item,index) in data" :key="index">
        <v-card>
          <!-- <v-card-title :color="warna(index)">{{ item.header.nama_pol }} {{ item.header.nama_proses }}</v-card-title> -->
          <v-toolbar dense :color="warna(index)">Pol : {{ item.header.kode_pol }} {{ item.header.nama_pol }} | {{ item.header.nama_proses }}</v-toolbar>
          <v-card-text>
            <ve-histogram :data="item.line"></ve-histogram>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  middleware: 'authLogin',
  async asyncData({}) {
    return {
      dateAwal: new Date(new Date() * 1 + 1000 * 3600 * 7)
        .toISOString()
        .substr(0, 10)
    }
  },
  data() {
    return {
      menu: false,
      shift: 2,
      dataMonitoring: [],
      headersMonitoring: [
        { text: 'no', value: 'no', sortable: false, width: '5%' },
        { text: 'kode_pol', value: 'kode_pol', sortable: true, width: '15%' },
        { text: 'nama_pol', value: 'nama_pol', sortable: true, width: '15%' },
        { text: 'proses', value: 'proses', sortable: true, width: '5%' },
        { text: 'total', value: 'total', sortable: true, width: '5%' },
        { text: 'dead', value: 'dead', sortable: true, width: '5%' },
        { text: 'error', value: 'error', sortable: true, width: '5%' },
        { text: 'lemah', value: 'lemah', sortable: true, width: '15%' }
      ],
      //   colors : ['#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],      
      color: ['blue lighten-4', 'green lighten-4', 'orange lighten-4'],
      data: [],
      breadcrumbs: [
        {
          text: 'home',
          disabled: true,
          href: ''
        },
        {
          text: 'admin',
          disabled: true,
          href: ''
        },
        {
          text: 'monitoring',
          disabled: true,
          href: ''
        }
      ]
    }
  },
  created() {
    this.$store.commit('CHANGE_BREAD', { list: this.breadcrumbs })
    this.$store.commit('SET_JUDUL', 'Monitoring')
    this.ambilMonitoring()
  },
  methods: {
    ambilMonitoring() {
      this.$axios
        .$get('/laporan/' + this.shift + '/' + this.dateAwal + '/monitoring', {
          headers: {
            Authorization: 'Bearer ' + this.$store.state.auth.token.token
          }
        })
        .then(res => {
          this.dataMonitoring = res.data
          this.data = res.total
        })
        .catch(err => {})
    },
    warna(index) {
      if (index > 2) {
        var ind = index - 3
      } else {
        var ind = index
      }
      return this.color[ind]
    },
  }
}
</script>