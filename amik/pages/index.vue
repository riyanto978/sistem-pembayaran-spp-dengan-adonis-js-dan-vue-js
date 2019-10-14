<template>
  <v-container align-center fluid>
    <v-layout row wrap>
      <!-- {{ data }} -->
      <v-flex xs2>
        <v-menu
          ref="menu"
          :close-on-content-click="false"
          v-model="menu"
          :nudge-right="40"
          :return-value.sync="firstDay"
          lazy
          transition="scale-transition"
          offset-y
          full-width
        >
          <v-text-field
            label="Tanggal Awal"
            slot="activator"
            v-model="firstDay"
            prepend-icon="event"
            readonly
          ></v-text-field>
          <v-date-picker
            format="dd/mm/yyyy"
            no-title
            v-model="firstDay"
            @input="$refs.menu.save(firstDay)"
          ></v-date-picker>
        </v-menu>
      </v-flex>
      <v-flex xs2>
        <v-menu
          ref="menu1"
          :close-on-content-click="false"
          v-model="menu1"
          :nudge-right="40"
          :return-value.sync="lastDay"
          lazy
          transition="scale-transition"
          offset-y
          full-width
        >
          <v-text-field
            label="Tanggal Akhir"
            slot="activator"
            v-model="lastDay"
            prepend-icon="event"
            readonly
          ></v-text-field>
          <v-date-picker
            format="dd/mm/yyyy"
            no-title
            v-model="lastDay"
            @input="$refs.menu1.save(lastDay)"
          ></v-date-picker>
        </v-menu>
      </v-flex>
      <v-flex xs12>
        <v-card-text>
          <ve-histogram :data="chartData" :extend="chartExtend" :settings="chartSettings"></ve-histogram>
        </v-card-text>
      </v-flex>
      <v-flex xs12>
        <v-data-table :headers="headersLaporan" hide-actions :items="data" class="elevation-1">
          <template slot="items" slot-scope="props">
            <td>{{ props.index+1 }}</td>
            <td>{{ waktu(props.item.tgl) }}</td>
            <td>{{ props.item.tagihan }}</td>
          </template>
          <template slot="no-data">
            <div class="text-xs-center">Tidak Ada Data</div>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import moment from 'moment'
const COLOR_LIST = ['#ff0', '#0f0', '#0ff', '#f00']
export default {
  layout: 'default',
  middleware: 'authLogin',
  async asyncData({}) {
    return {
      
    }
  },
  data() {
    return {
      menu: false,
      menu1: false,
      firstDay: '',
      lastDay: '',
      chartData: {
        columns: ['tgl', 'tagihan'],
        rows: []
      },
      colors: ['#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
      data: [],
      headersLaporan: [
        { text: 'no', value: 'no', sortable: false },
        { text: 'tanggal', value: 'tgl', sortable: false },
        { text: 'total tagihan', value: 'tagihan', sortable: true }
      ],
      allLaporan: [],
      color: ['blue lighten-4', 'green lighten-4', 'orange lighten-4'],
      breadcrumbs: [
        {
          text: 'home',
          disabled: true,
          href: ''
        }
      ]
    }
  },
  created() {
    this.$store.commit('CHANGE_BREAD', { list: this.breadcrumbs })
    this.$store.commit('SET_JUDUL', 'Beranda')
    this.firstDay = moment()
      .startOf('month')
      .format('YYYY-MM-DD');
    this.lastDay = moment()
      .endOf('month')
      .format('YYYY-MM-DD');
    this.ambilData();
    this.chartSettings = {}
    this.chartExtend = {
      series(item) {        
        item[0].data = item[0].data.map((v, index) => ({
          value: v,
          itemStyle: { color: COLOR_LIST[index] }
        }))
        return item
      }
    }
  },
  methods: {
    ambilData() {
      this.$axios
        .$get('/kuitansi/' + this.firstDay + '/' + this.lastDay, {
          headers: {
            Authorization: 'Bearer ' + this.$store.state.auth.token.token
          }
        })
        .then(res => {
          this.data = res.data
          this.chartData.rows = []          
          for (const item of res.data) {
            const obje = {
              tgl: this.waktu(item.tgl),
              tagihan: item.tagihan
            }
            this.chartData.rows.push(obje)
          }
        })
    },
    waktu(time) {
      var d = new Date(time)
      var month = new Array()
      month[0] = 'Januari'
      month[1] = 'Februari'
      month[2] = 'Maret'
      month[3] = 'April'
      month[4] = 'Mei'
      month[5] = 'Juni'
      month[6] = 'Juli'
      month[7] = 'Agustus'
      month[8] = 'September'
      month[9] = 'Oktober'
      month[10] = 'November'
      month[11] = 'Desember'

      return d.getDay() + ' ' + month[d.getMonth()] + ' ' + d.getFullYear()
    }
  }
}
</script>


