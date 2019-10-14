<template>
  <v-container grid-list-xs fluid>
    <v-layout row wrap>
      <v-flex xs12>
        <v-btn @click="print">a</v-btn>
        
        <v-toolbar flat color="white">
          <v-toolbar-title>Riwayat</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-text-field
            append-icon="search"
            v-model="cari"
            placeholder="cari mahasiswa Nim / nomor kuitansi"
            @keyup="waitInput"
          ></v-text-field>
        </v-toolbar>
        <div ref="printMe">
        <v-data-table
        
          :headers="headers"
          :items="allRiwayat"
          hide-actions
          class="elevation-1"
          :loading="loading"          
        >
          <template slot="items" slot-scope="props">           
            <td>{{ (page-1)*10+ props.index+1 }}</td>
            <td>
              <img
                :src="`http://localhost:3333/foto/${props.item.foto}`"
                alt="Vue Material Admin"
                width="50"
                height="50"
              >
            </td>
            <td>{{ props.item.nim }}</td>
            <td>{{ props.item.nama_mahasiswa }}</td>
            <td>{{ props.item.program_studi }}</td>
            <td>{{ props.item.guna_pembayaran }}</td>
            <td>{{ props.item.jumlah_tagihan }}</td>
            <td>{{ props.item.jumlah_bayar }}</td>
            <td><a  @click="generatePdf(props.item.nomor_kuitansi)">{{ props.item.nomor_kuitansi }}</a> </td>
             <td>              
              <v-icon small @click="deleteItem(props.item)">delete</v-icon>
            </td>
          </template>
        </v-data-table>
        </div>
        <div class="text-xs-center pt-2">
          <v-pagination v-model="page" :length="pages" @input="ambilRiwayat"></v-pagination>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      headers: [
        
        { text: 'No', value: 'No' },
        { text: 'Foto', value: 'Foto' },
        { text: 'Nim', value: 'Nim' },
        { text: 'Nama_mahasiswa', value: 'Nama_mahasiswa' },
        { text: 'Program_studi', value: 'Program_studi' },
        { text: 'Guna ', value: 'Guna' },
        { text: 'Jumlah tagihan', value: 'Jumlah tagihan' },
        { text: 'Total Bayar', value: 'Total Bayar' },
        { text: 'Kuitansi', value: '' },
        { text: '', value: '' }
      ],
      allRiwayat: [],
      page: 1,
      totalItems : 0,
      cari : '',
      output : null,
      breadcrumbs: [
        {
          text: 'home',
          disabled: false,
          href: '/home'
        },
        {
          text: 'riwayat',
          disabled: true,
          href: ''
        }
      ]
    }
  },
  created() {
    this.$store.commit('CHANGE_BREAD', { list: this.breadcrumbs })
    this.$store.commit('SET_JUDUL', 'Riwayat')
      this.ambilRiwayat()
  },

  computed: {
    pages() {
      return Math.ceil(this.totalItems / 10)
    }
  },

  methods: {
    ambilRiwayat() {
      if (this.cari == '') {
        var cari = null
      } else {
        var cari = this.cari
      }
      this.$axios
        .get('kuitansi/riwayat/' + cari + '/' + this.page, {
          headers: {
            Authorization: 'Bearer ' + this.$store.state.auth.token.token
          }
        })
        .then(response => {
          this.totalItems = response.data.kuitansi.total
          this.allRiwayat = response.data.kuitansi.data
          this.loading = false
        })
        .catch(error => {
          console.log(error)
          this.loading = false
        })
    },
    waitInput() {
      this.page = 1
      this.loading = true
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
      this.timer = setTimeout(() => {
        this.ambilRiwayat()
      }, 800)
    },    
    async print() {
      const el = this.$refs.printMe
      const options = {
        type: 'dataURL'
      }
      this.output = await this.$html2canvas(el, options)
      this.generatePdf()
    },
    generatePdf() {
      var pdfMake = require('pdfmake/build/pdfmake.js')
      if (pdfMake.vfs == undefined) {
        var pdfFonts = require('pdfmake/build/vfs_fonts.js')
        pdfMake.vfs = pdfFonts.pdfMake.vfs
      }      
      
      var docDefinition = {
        content: [
          {
            image: this.output,            
          },          
        ],
        pageSize: 'A3',
        pageOrientation: 'landscape'
      }

      pdfMake.createPdf(docDefinition).open()
    },
    deleteItem(item) {
      this.snackbar = false      
      if (
        confirm(
          'Apakah anda ingin menghapus Kuitansi ' + item.nomor_kuitansi
        )
      ) {
        this.$axios
          .delete('kuitansi/' + item.nomor_kuitansi, {
            headers: {
              Authorization: 'Bearer ' + this.$store.state.auth.token.token,
              'Content-Type': 'multipart/form-data'
            }
          })
          .then(response => {
            this.ambilRiwayat()            
          })
      }
    },
  }
}
</script>