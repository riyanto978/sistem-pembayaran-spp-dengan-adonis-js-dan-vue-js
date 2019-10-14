<template>
  <v-container>
    <v-layout row wrap>
      <v-snackbar
        v-model="snackbar"
        :left="true"
        :bottom="true"
        :timeout="timeout"
        :multi-line="true"
        :color="color"
        :auto-height="true"
      >
        {{ text }}
        <v-btn color="pink" flat @click="snackbar = false">Close</v-btn>
      </v-snackbar>
      <!-- {{ proses }} -->
      <!-- {{ waktu() }} -->
      <br>
      <!-- <digital-clock :blink="true" displaySeconds="true" /> -->
      <v-flex xs12 sm12 lg12>
        <v-toolbar flat class="grey lighten-5">
          <v-toolbar-title>Daftar Proses</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-text-field v-model="cari" placeholder="Cari"></v-text-field>
          <v-dialog v-model="dialog" max-width="600px">
            <v-btn slot="activator" color="blue" dark class="mb-2">New Proses</v-btn>
            <v-card>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>
                <v-card-text>
                  <v-container grid-list-md>
                    <v-layout wrap align-center>
                      <v-flex xs12 sm6 md12>
                        <v-text-field
                          required
                          :rules="[v => !!v || 'Nama Harus Diisi']"
                          v-model="editedItem.nama_proses"
                          label="Nama Proses"
                          autofocus
                        ></v-text-field>

                        <v-select
                          required
                          :rules="[v => !!v || 'Item is required']"
                          :items="combo_manual"
                          v-model="editedItem.group_laporan"
                          label="grup"
                        ></v-select>
                        <v-select
                          required
                          :rules="[v => !!v || 'Item is required']"
                          :items="combo_tipe"
                          v-model="editedItem.tipe"
                          label="Tipe"
                        ></v-select>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" flat :disabled="!valid" @click="save">Save</v-btn>
                  <v-btn color="blue darken-1" flat @click="close">Cancel</v-btn>
                </v-card-actions>
              </v-form>
            </v-card>
          </v-dialog>
        </v-toolbar>
        <br>
        <!-- :style="{backgroundColor: (props.item.tipe == 'reguler' ? 'blue lighten-1' : 'transparent' ) }" -->
        <!-- :class="props.item.tipe == 'reguler' ? 'green lighten-4' : 'transparent'" -->                  
        <v-data-table
          :headers="headers"
          :items="filterProses"
          :rows-per-page-items="row"
          class="elevation-1"        
          id="table1"
        >
          <template slot="items" slot-scope="props">
            <tr >
              <td>{{ props.index + 1 }}</td>
              <td>{{ props.item.nama_proses }}</td>
              <td>{{ props.item.group_laporan }}</td>
              <td>{{ props.item.tipe }}</td>
              <td>{{ getDate(props.item.created_at) }}</td>
              <td>{{ getTime(props.item.created_at) }}</td>
              <td>{{ getTime(props.item.updated_at) }}</td>
              <td>
                <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
                <v-icon small @click="deleteItem(props.item)">delete</v-icon>
              </td>
            </tr>
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
import DigitalClock from "vue-digital-clock"

export default {
  components: {
    DigitalClock
  },
  middleware: 'authLogin',
  async asyncData({ $axios, store }) {
    return $axios
      .$get('/proses', {
        headers: {
          Authorization: 'Bearer ' + store.state.auth.token.token
        }
      })
      .then(res => {
        return { proses: res.data }
      })
  },
  data() {
    return {
      valid: true,
      snackbar: false,
      text: '',
      timeout: 5000,
      color: '',
      loader: false,
      dialog: false,
      cari: '',
      combo_manual: [
        'reguler',
        'ktp'        
      ],
      combo_tipe: ['tombol', 'upload_file'],
      row: [
        
        25,
        { text: '$vuetify.dataIterator.rowsPerPageAll', value: -1 }
      ],
      alert: false,
      headers: [
        { text: 'No', value: 'No', sortable: false },
        {
          text: 'Nama Proses',
          align: 'left',
          sortable: true,
          value: 'nama_proses',
          sortable: true
        },
        { text: 'grup', value: 'grup', sortable: true },
        { text: 'tipe', value: 'tipe', sortable: true },
        { text: 'Tanggal', value: 'tanggal', sortable: true },
        { text: 'Jam mulai', value: 'created_at', sortable: true },
        { text: 'Jam Selesai', value: 'updated_at', sortable: true },
        { text: 'Actions', value: 'name', sortable: false }
      ],

      editedIndex: -1,
      editedItem: {
        id_proses: '',
        nama_proses: null,
        group_laporan: 'reguler',
        tipe: 'tombol',
        updated_at: '',
        created_at: ''
      },
      defaultItem: {
        id_proses: '',
        nama_proses: null,
        group_laporan: 'reguler',
        tipe: 'tombol',
        updated_at: '',
        created_at: ''
      },
      breadcrumbs: [
        {
          text: 'home',
          disabled: false,
          href: '/'
        },
        {
          text: 'proses',
          disabled: false,
          href: '/proses'
        }
      ]
    }
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
    filterProses() {
      return this.proses.filter(pros => {
        return pros.nama_proses.toLowerCase().match(this.cari)
      })
    }
  },

  watch: {
    dialog(val) {
      val || this.close()
    }
  },

  created() {
    this.$store.commit('CHANGE_BREAD', { list: this.breadcrumbs })
    this.$store.commit('SET_JUDUL', 'Proses')
  },

  methods: {
    tampilAlert(alert, color) {
      this.text = alert
      this.color = color
      this.snackbar = true
    },
    editItem(item) {
      this.editedIndex = this.proses.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      this.snackbar = false
      const index = this.proses.indexOf(item)
      var self = this

      if (confirm('Are you sure you want to delete this item?')) {
        this.$axios
          .delete('/proses/' + item.id_proses, {
            headers: {
              Authorization: 'Bearer ' + this.$store.state.auth.token.token
            }
          })
          .then(function(response) {
            self.proses.splice(index, 1)
            self.tampilAlert('Berhasil Dihapus', 'red')
          })
      }
    },

    close() {
      this.$refs.form.reset()
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },
    getTime(time) {
      var d = new Date(time)
      return d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
    },
    getDate(time) {
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
    },
    waktu(){
      var d = new Date( (new Date)*1 - 1000*3600*7 )
      return d.toLocaleDateString('en-gb') + ' ' + d.toLocaleTimeString('en-gb')
    },
    save() {
      if (this.$refs.form.validate()) {
        if (this.editedIndex > -1) {
          this.snackbar = false
          var id_proses = this.editedItem.id_proses
          var index = this.editedIndex
          var self = this
          this.$axios
            .$put(
              '/proses/' + id_proses,
              {
                nama_proses: this.editedItem.nama_proses,
                group_laporan: this.editedItem.group_laporan,
                tipe: this.editedItem.tipe
              },
              {
                headers: {
                  Authorization: 'Bearer ' + this.$store.state.auth.token.token
                }
              }
            )
            .then(response => {
              Object.assign(self.proses[index], response.proses)
              this.tampilAlert('Berhasil Diupdate', 'blue')
              this.close()
            })
        } else {
          this.snackbar = false

          this.$axios
            .$post(
              '/proses',
              {
                nama_proses: this.editedItem.nama_proses,
                group_laporan: this.editedItem.group_laporan,
                tipe: this.editedItem.tipe
              },
              {
                headers: {
                  Authorization: 'Bearer ' + this.$store.state.auth.token.token
                }
              }
            )
            .then(response => {
              this.proses.push(response.proses)
              this.tampilAlert('Berhasil Disimpan', 'success')
              this.close()
            })
            .catch(error => {
              console.log(error)
              this.close()
            })
        }
      }
    }
  }
}
</script>

<style scope>
  #table1{    
    border-collapse: separate;
    border-spacing: 15px 50px;
  }
</style>



