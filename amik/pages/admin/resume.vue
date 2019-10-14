<template>
  <v-container align-center>
    <v-layout row wrap>
      <!-- {{ dateAwal }}       -->
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
            @change="ambilResume"
            v-model="dateAwal"
            @input="$refs.menu.save(dateAwal)"
          ></v-date-picker>
        </v-menu>
      </v-flex>
      <v-flex xs1 offset-xs1>
        <v-select
        @change="ambilResume"
          :items="[1,2]"
          label="Shift"
          v-model="shift"
        ></v-select>
      </v-flex>
      <br>
      <v-flex xs12 v-for="(data,index) in allLaporan" :key="index">
        <!-- {{data.data}} -->
        <v-toolbar dense :color="warna(index)">Pol : {{ data.pol }} | {{ data.nama_pol }}</v-toolbar>
        <v-data-table
          :headers="headersLaporanSaved"
          hide-actions
          :items="data.data"
          class="elevation-1"
        >
          <template slot="items" slot-scope="props">
            <td>{{ props.index+1 }}</td>
            <td>{{ props.item.operator }}</td>
            <td>{{ props.item.nama_proses }}</td>
            <td>{{ props.item.iner }}</td>
            <td>{{ props.item.shift }}</td>
            <td>{{ props.item.line }}</td>
            <td>{{ props.item.isi }}</td>
            <td>{{ getWaktu(props.item.created_at) }}</td>
            <td>{{ getWaktu(props.item.updated_at) }}</td>
            <td>{{ parseInt(props.item.dead) + parseInt(props.item.chip_error) + parseInt(props.item.chip_lemah) + parseInt(props.item.card_body)}}</td>
            <td>{{ status(props.item.status) }}</td>
          </template>
          <template slot="no-data">
            <div class="text-xs-center">Tidak Ada Data</div>
          </template>
        </v-data-table>
        <br>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  layout: 'default',
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
      menu1: false,
      shift: 2,
      headersLaporanSaved: [
        { text: 'no', value: 'no', sortable: false, width: '5%' },
        { text: 'operator', value: 'operator', sortable: false, width: '15%'  },
        { text: 'proses', value: 'proses', sortable: false, width: '15%'  },
        { text: 'iner', value: 'iner', sortable: true, width: '5%'  },
        { text: 'shift', value: 'shift', sortable: true, width: '5%'  },
        { text: 'line', value: 'line', sortable: true, width: '5%'  },
        { text: 'isi', value: 'isi', sortable: true, width: '5%'  },
        { text: 'created_at', value: 'created_at', sortable: true, width: '15%'  },
        { text: 'updated_at', value: 'updated_at', sortable: true, width: '15%'  },
        { text: 'reject', value: 'reject', sortable: true, width: '5%'  },
        { text: 'status', value: 'status', sortable: false, width: '10%'  }
      ],
      allLaporan: [],
      color: ['blue lighten-4', 'green lighten-4', 'orange lighten-4'],
      breadcrumbs: [
        {
          text: 'home',
          disabled: true,
          href: ''
        },
        {
          text: 'resume',
          disabled: true,
          href: ''
        }
      ]
    }
  },
  created() {
    this.$store.commit('CHANGE_BREAD', { list: this.breadcrumbs })
    this.$store.commit('SET_JUDUL', 'Resume')
    this.ambilResume()
  },
  methods: {
    warna(index) {
      if (index > 2) {
        var ind = index - 3
      } else {
        var ind = index
      }
      return this.color[ind]
    },
    ambilResume() {
      this.$axios
        .$get('/laporan/'+ this.shift + '/' + this.dateAwal + '/resume', {
          headers: {
            Authorization: 'Bearer ' + this.$store.state.auth.token.token
          }
        })
        .then(res => {
          this.allLaporan = res.data
        })
        .catch(err => {})
    },
    status(status) {
      var stat = null
      if (status == 1) {
        stat = 'temp'
      } else if (status == 2) {
        stat = 'saved'
      } else {
        stat = 'used'
      }
      return stat
    },
    getWaktu(date) {
      var d = new Date(new Date(date) * 1 + 1000 * 3600 * 7)
      //  return d.getFullYear()+'-'+d.getMonth()+'-'+d.getDay()+' '+d.getHours() + ':' + d.getMinutes() + ':'+d.getSeconds()
      return d.toLocaleString('en-gb')
    }
  }
}
</script>
