<template>
  <v-container fluid>
    <!-- {{ editedIndex }} -->
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

      <v-flex xs12 sm12 lg12>
        <v-toolbar flat color="white">
          <v-toolbar-title>Daftar mahasiswa</v-toolbar-title>
          <v-divider class="mx-2" inset vertical></v-divider>
          <v-btn color="green" dark class="mb-2" @click="generatePdf">laporan mahasiswa</v-btn>
          <v-spacer></v-spacer>
          <v-flex xs2>
            {{ totalItems }} mahasiswa
            <span>{{ cari != ''?'disaring':'total ' }}</span>
          </v-flex>

          <v-text-field
            append-icon="search"
            v-model="cari"
            placeholder="cari mahasiswa"
            @keyup="waitInput"
          ></v-text-field>
          <v-dialog v-model="dialog" max-width="600px">
            <v-btn slot="activator" color="blue" dark class="mb-2">New mahasiswa</v-btn>
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
                          
                          type="number"
                          v-model="editedItem.nim"
                          :rules="[v=> !!v || 'harus diisi']"
                          label="nim"
                        ></v-text-field>
                        <v-text-field                          
                          v-model="editedItem.nama_mahasiswa"
                          :rules="[v=> !!v || 'harus diisi']"
                          label="nama mahasiswa"
                        ></v-text-field>
                        <v-text-field
                          
                          v-model="editedItem.alamat"
                          :rules="[v=> !!v || 'harus diisi']"
                          label="alamat"
                        ></v-text-field>
                        <v-select
                          v-model="editedItem.jenis_kelamin"
                          :rules="[v=> !!v || 'harus diisi']"
                          :items="['laki-laki','perempuan']"
                          label="jenis kelamin"
                        ></v-select>
                        <v-select
                          v-model="editedItem.agama"
                          :rules="[v=> !!v || 'harus diisi']"
                          :items="['islam','kristen','katholik','budha','hindu']"
                          label="agama"
                        ></v-select>
                        <v-select
                          v-model="editedItem.program_studi"
                          :rules="[v=> !!v || 'harus diisi']"
                          :items="['mi','ka']"
                          label="program studi"
                        ></v-select>
                        <v-text-field                          
                          type="number"
                          v-model="editedItem.telepon"
                          min="0"
                          :rules="[v=> !!v || 'harus diisi']"
                          label="telepon"
                        ></v-text-field>
                        <v-select
                          v-model="editedItem.angkatan"
                          :rules="[v=> !!v || 'harus diisi']"
                          :items="allAngkatan"
                          item-text="nama_angkatan"
                          item-value="id_angkatan"
                          label="angkatan"
                        ></v-select>
                        <v-text-field
                          required
                          v-model="editedItem.kelas"
                          :rules="[v=> !!v || 'harus diisi']"
                          label="kelas"
                        ></v-text-field>
                        <label for="file">Foto</label>
                        <input type="file" ref="file" />
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
        <!-- {{ editedItem }} -->
        <v-data-table
          :headers="headers"
          :items="allmahasiswa"
          hide-actions
          class="elevation-1"
          :loading="loading"
          :expand="expand"
          item-key="id_mahasiswa"
        >
          <template slot="items" slot-scope="props">
            <td>
              <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
              <v-icon small @click="deleteItem(props.item)">delete</v-icon>
            </td>
            <td>{{ (page-1)*5+ props.index+1 }}</td>
            <td>
              <img
                :src="`http://localhost:3333/foto/${props.item.foto}`"
                alt="Vue Material Admin"
                width="100"
                height="100"
              />
            </td>
            <td>{{ props.item.nim }}</td>
            <td>{{ props.item.nama_mahasiswa }}</td>
            <td>{{ props.item.program_studi }}</td>
            <td>{{ props.item.angkatan }}</td>
            <td>{{ props.item.kelas }}</td>
            <td>
              <v-icon @click="props.expanded = !props.expanded" color="primary">info</v-icon>
            </td>
          </template>
          <template slot="expand" slot-scope="props">
            <thead>
              <th></th>
              <th>alamat</th>
              <th>agama</th>
              <th>telepon</th>
              <th>jenis_kelamin</th>
            </thead>
            <tr>
              <td></td>
              <td>{{ props.item.alamat }}</td>
              <td>{{ props.item.agama }}</td>
              <td>{{ props.item.telepon }}</td>
              <td>{{ props.item.jenis_kelamin }}</td>
            </tr>
          </template>
          <template slot="no-data">
            <div class="text-xs-center">Tidak Ada Data</div>
          </template>
        </v-data-table>
        <div class="text-xs-center pt-2">
          <v-pagination v-model="page" :length="pages" @input="ambilmahasiswa"></v-pagination>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  middleware: 'authLogin',
  data() {
    return {
      Judul: 'Tambah mahasiswa',
      valid: true,
      snackbar: false,
      text: '',
      timeout: 5000,
      color: '',
      loader: false,
      dialog: false,
      file: '',
      page: 1,
      rules: [v => !!v || 'harus diisi'],
      allmahasiswa: [],
      totalItems: 0,
      mahasiswa: [],
      cari: '',
      loading: false,
      row: [
        10,
        25,
        { text: '$vuetify.dataIterator.rowsPerPageAll', value: -1 }
      ],
      alert: false,
      expand: false,
      headers: [
        { text: 'Actions', value: 'name', sortable: false },
        { text: 'No', value: 'No' },
        { text: 'foto', value: 'foto' },
        { text: 'nim', value: 'nim' },
        { text: 'nama_mahasiswa', value: 'nama_mahasiswa' },
        { text: 'program_studi', value: 'program_studi' },
        { text: 'angkatan', value: 'angkatan' },
        { text: 'kelas', value: 'kelas' },
        { text: '', value: '' }
      ],
      data: '',
      editedIndex: -1,
      allAngkatan: [],
      editedItem: {
        id_mahasiswa: '',
        nim: '',
        nama_mahasiswa: '',
        jenis_kelamin: 'laki-laki',
        alamat: '',
        agama: 'islam',
        program_studi: 'mi',
        telepon: '',
        angkatan: '',
        kelas: '',
        foto: '',
        dibuat_tgl: '',
        diubah_tgl: ''
      },
      defaultItem: {
        id_mahasiswa: '',
        nim: '',
        nama_mahasiswa: '',
        jenis_kelamin: 'laki-laki',
        alamat: '',
        agama: 'islam',
        program_studi: 'mi',
        telepon: '',
        angkatan: '',
        kelas: '',
        foto: '',
        dibuat_tgl: '',
        diubah_tgl: ''
      },
      breadcrumbs: [
        {
          text: 'home',
          disabled: false,
          href: '/home'
        },
        {
          text: 'mahasiswa',
          disabled: true,
          href: ''
        }
      ]
    }
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New mahasiswa' : 'Edit mahasiswa'
    },
    pages() {
      return Math.ceil(this.totalItems / 5)
    }
  },

  watch: {
    dialog(val) {
      val || this.close()
    }
  },

  created() {
    this.$store.commit('CHANGE_BREAD', { list: this.breadcrumbs })
    this.$store.commit('SET_JUDUL', 'Tambah mahasiswa')
    this.ambilAngkatan()
    this.ambilmahasiswa()
  },

  methods: {
    ambilAngkatan() {
      this.$axios
        .$get('/angkatan/aktif/', {
          headers: {
            Authorization: 'Bearer ' + this.$store.state.auth.token.token
          }
        })
        .then(res => {
          this.allAngkatan = res.data
        })
    },
    ambilmahasiswa() {
      if (this.cari == '') {
        var cari = null
      } else {
        var cari = this.cari
      }
      this.$axios
        .get('mahasiswa/' + cari + '/' + this.page, {
          headers: {
            Authorization: 'Bearer ' + this.$store.state.auth.token.token
          }
        })
        .then(response => {
          this.totalItems = response.data.data.total
          this.allmahasiswa = response.data.data.data
          this.loading = false
        })
        .catch(error => {
          console.log(error)
          this.loading = false
        })
    },
    tampilAlert(alert, color) {
      this.text = alert
      this.color = color
      this.snackbar = true
    },
    editItem(item) {
      this.editedIndex = this.allmahasiswa.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      this.snackbar = false
      const index = this.mahasiswa.indexOf(item)
      if (
        confirm(
          'Apakah anda ingin menghapus mahasiswa name' + item.nama_mahasiswa
        )
      ) {
        this.$axios
          .delete('mahasiswa/' + item.id_mahasiswa, {
            headers: {
              Authorization: 'Bearer ' + this.$store.state.auth.token.token,
              'Content-Type': 'multipart/form-data'
            }
          })
          .then(response => {
            this.allmahasiswa.splice(index, 1)
            this.totalItems = this.totalItems - 1
            this.tampilAlert('Berhasil Dihapus', 'red')
          })
      }
    },

    close() {
      this.dialog = false
      this.editedItem = Object.assign({}, this.defaultItem)
      this.editedIndex = -1
    },
    save() {
      if (this.$refs.form.validate()) {
        if (this.editedIndex == -1) {
          var log = 'this.$refs.file.files[0] == undefined'
        } else {
          var log = 'false'
        }

        if (eval(log)) {
          alert('foto belum dipilih')
        } else {
          if (this.editedIndex > -1) {
            this.snackbar = false
            var id = this.editedItem.id_mahasiswa
            var index = this.editedIndex

            let formData = new FormData()
            var file = this.$refs.file.files[0]
            formData.append('foto', file)
            formData.append('nim', this.editedItem.nim)
            formData.append('nama_mahasiswa', this.editedItem.nama_mahasiswa)
            formData.append('alamat', this.editedItem.alamat)
            formData.append('jenis_kelamin', this.editedItem.jenis_kelamin)
            formData.append('agama', this.editedItem.agama)
            formData.append('program_studi', this.editedItem.program_studi)
            formData.append('telepon', this.editedItem.telepon)
            formData.append('angkatan', this.editedItem.angkatan)
            formData.append('kelas', this.editedItem.kelas)

            this.$axios
              .put('mahasiswa/' + id, formData, {
                headers: {
                  Authorization: 'Bearer ' + this.$store.state.auth.token.token,
                  'Content-Type': 'multipart/form-data'
                }
              })
              .then(response => {
                Object.assign(this.allmahasiswa[index], response.data.data)
                this.tampilAlert('Berhasil Diupdate', 'blue darken-2')
                this.close()
              })
              .catch(error => {
                this.close()
              })
          } else {
            this.snackbar = false
            let formData = new FormData()
            var file = this.$refs.file.files[0]
            formData.append('foto', file)
            formData.append('nim', this.editedItem.nim)
            formData.append('nama_mahasiswa', this.editedItem.nama_mahasiswa)
            formData.append('alamat', this.editedItem.alamat)
            formData.append('jenis_kelamin', this.editedItem.jenis_kelamin)
            formData.append('agama', this.editedItem.agama)
            formData.append('program_studi', this.editedItem.program_studi)
            formData.append('telepon', this.editedItem.telepon)
            formData.append('angkatan', this.editedItem.angkatan)
            formData.append('kelas', this.editedItem.kelas)

            this.$axios
              .post('mahasiswa', formData, {
                headers: {
                  Authorization: 'Bearer ' + this.$store.state.auth.token.token,
                  'Content-Type': 'multipart/form-data'
                }
              })
              .then(response => {
                this.allmahasiswa.push(response.data.data)
                this.totalItems = this.totalItems + 1
                this.tampilAlert('Berhasil Disimpan', 'success')
                this.close()
              })
              .catch(error => {
                this.tampilAlert('error', 'red')
                this.close()
              })

            //this.mahasiswa.push(this.editedItem)
          }
        }
      }
    },
    generatePdf() {
      var pdfMake = require('pdfmake/build/pdfmake.js')
      if (pdfMake.vfs == undefined) {
        var pdfFonts = require('pdfmake/build/vfs_fonts.js')
        pdfMake.vfs = pdfFonts.pdfMake.vfs
      }
      const rows = [
        [
          'no',          
          'nim',
          'nama_mahasiswa',
          'program_studi',
          'angkatan',
          'kelas',
          'alamat',
          'agama',          
          'telepon',
          'jenis_kelamin'
        ]
      ]
      var no = 1
      // const image2base64 = require('image-to-base64')

      for (const x of this.allmahasiswa) {
        var row = []
        row.push(no)
        // image2base64('http://localhost:3333/foto/' + x.foto) // you can also to use url
        //   .then(response => {
        //     row.push(response)
        //   })      
        row.push(x.nim)
        row.push(x.nama_mahasiswa)
        row.push(x.program_studi)
        row.push(x.angkatan)
        row.push(x.kelas)
        row.push(x.alamat)
        row.push(x.agama)
        row.push(x.telepon)
        row.push(x.jenis_kelamin)
        rows.push(row)
        no++
      }

      var docDefinition = {
        defaultStyle: {
          fontSize: 12
        },
        styles: {
          header: {
            fontSize: 14,
            bold: true
          },
          anotherStyle: {
            fontSize: 10
            // italics: true,
            // alignment: 'right'
          }
        },
        content: [
          {
            image:
              'data:image/jpeg;base64,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',
            width: 70,
            height: 70,
            absolutePosition: { x: 25, y: 25 }
          },
          {
            text: 'AKADEMI MANAJEMEN INFORMATIKA DAN KOMPUTER',
            style: 'header',
            absolutePosition: { x: 250, y: 30 }
          },
          {
            text: 'JAKARTA TEKNOLOGI CIPTA',
            style: 'header',
            absolutePosition: { x: 325, y: 50 }
          },
          {
            text: 'Jl. Kelud Raya No. 10 Semarang Telp 024-8310002',
            style: 'anotherStyle',
            absolutePosition: { x: 320, y: 70 }
          },
          {
            absolutePosition: { x: 30, y: 130 },
            table: {
              headerRows: 1,
              // widths: [25,100, 200, 100, 100,200],
              body: rows
            }
          }
        ],
        pageSize: 'A4',
        pageOrientation: 'landscape'
      }
      pdfMake.createPdf(docDefinition).open()
    },
    waitInput() {
      this.page = 1
      this.loading = true
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
      this.timer = setTimeout(() => {
        this.ambilmahasiswa()
      }, 800)
    },
    toDataURL(url, callback) {
      var xhr = new XMLHttpRequest()
      xhr.onload = function() {
        var reader = new FileReader()
        reader.onloadend = function() {
          callback(reader.result)
        }
        reader.readAsDataURL(xhr.response)
      }
      xhr.open('GET', url)
      xhr.responseType = 'blob'
      xhr.send()
    }
  }
}
</script>
