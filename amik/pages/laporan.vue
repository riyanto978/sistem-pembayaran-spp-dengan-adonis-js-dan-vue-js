<template>
  <v-container align-center>
    <v-layout row wrap>
      <!-- <v-toolbar flat>
          <v-toolbar-title>Daftar Pol</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-text-field v-model="cari" placeholder="cari Pol" @keyup="waitInput"></v-text-field>
      </v-toolbar>-->
      <!-- {{ laporanReguler }} -->
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

      <v-flex xs12 sm12 md12 lg12>
        <v-toolbar color="white" >
          <v-toolbar-title>
            <v-text-field append-icon="search" v-if="step == 1" v-model="cari" placeholder="cari Pol" @keyup="waitInput"></v-text-field>
            <v-btn v-if="step == 2" @click="step = 1" color="orange lighten-3">
              <v-icon>arrow_back</v-icon>Daftar Pol
            </v-btn>
            <v-btn v-if="step == 3" @click="step = 2" color="orange lighten-3">
              <v-icon>arrow_back</v-icon>Daftar Proses
            </v-btn>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-layout align-end justify-center row>
              <v-text-field v-if="step > 1" label="kode Pol" v-model="pol.kode_pol" readonly></v-text-field>
              <v-text-field v-if="step > 1" label="nama Pol" v-model="pol.nama_pol" readonly></v-text-field>
              <v-text-field
                v-if="step > 2"
                label="nama Proses"
                v-model="proses.nama_proses"
                readonly
              ></v-text-field>
              <v-text-field v-if="step > 2" label="proses_ke" v-model="proses_ke" readonly></v-text-field>
            </v-layout>
          </v-toolbar-items>
        </v-toolbar>
        <v-stepper v-model="step">
          <v-stepper-header>
            <v-stepper-step :complete="step > 1" step="1">Pilih Pol</v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step :complete="step > 2" step="2">Pilih Proses</v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step step="3">Laporan</v-stepper-step>
          </v-stepper-header>
          <v-stepper-items>
            <v-stepper-content step="1">
              <v-data-table
                :headers="headersPol"
                :items="allPol"
                :loading="loading"
                hide-actions
                class="elevation-1"
              >
                <template slot="items" slot-scope="props">
                  <td>{{ (page-1)*5+ props.index+1 }}</td>
                  <td>{{ props.item.kode_pol }}</td>
                  <td>{{ props.item.nama_pol }}</td>
                  <td>{{ props.item.jumlah_order }} / {{ props.item.per_iner }}</td>
                  <td>{{ Math.ceil(props.item.jumlah_order/props.item.per_iner) }}</td>
                  <td>
                    <v-btn
                      color="blue lighten-4"
                      target="blank"
                      :href="`http://localhost/qc/acuan/lampiran/${props.item.lampiran}`"
                    >Lampiran</v-btn>
                  </td>
                  <td>
                    <v-btn color="success" @click="pilihPol(props.item)">Kerjakan</v-btn>
                  </td>
                </template>
                <template slot="no-data">
                  <div class="text-xs-center">Tidak Ada Data</div>
                </template>
              </v-data-table>
              <div class="text-xs-center pt-2">
                <v-pagination v-model="page" :length="pages" @input="ambilPol"></v-pagination>
              </div>
            </v-stepper-content>
            <v-stepper-content step="2">
              <v-btn color="primary" dark @click="dialogLot = true">Lot</v-btn>
              <v-dialog
                v-model="dialogLot"
                fullscreen
                hide-overlay
                transition="dialog-bottom-transition"
              >
                <v-card tile>
                  <v-toolbar card dark color="primary">
                    <v-btn icon dark @click="dialogLot = false">
                      <v-icon>close</v-icon>
                    </v-btn>
                    <v-toolbar-title>Input Lot</v-toolbar-title>
                  </v-toolbar>
                  <v-card-text>
                    <v-layout row wrap v-if="dialogLot == true">
                      <v-flex xs2>kode pol</v-flex>
                      <v-flex xs10>{{ pol.kode_pol }}</v-flex>
                      <v-flex xs2>Nama pol</v-flex>
                      <v-flex xs10>{{ pol.nama_pol }}</v-flex>
                      <v-flex xs2>jumlah Order</v-flex>
                      <v-flex xs10>{{ pol.jumlah_order }} / {{ pol.per_iner }}</v-flex>
                      <v-flex xs2>Total Lot masuk</v-flex>
                      <v-flex xs10>{{ totalLot }}</v-flex>
                      <v-flex xs12>
                        <v-dialog v-model="dialogTambahLot" max-width="600px">
                          <v-btn slot="activator" color="blue" dark class="mb-2">New Lot</v-btn>
                          <v-card>
                            <v-form ref="form" v-model="validLot" lazy-validation>
                              <v-card-title>
                                <span class="headline">{{ formTitleLot }}</span>
                              </v-card-title>
                              <v-card-text>
                                <v-container grid-list-md>
                                  <v-layout wrap align-center>
                                    <v-flex xs12 sm6 md12>
                                      <v-text-field
                                        required
                                        :rules="[v => !!v || 'Harus Diisi']"
                                        v-model="editedItemLot.kd_lot"
                                        label="kode Lot"
                                        autofocus
                                      ></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm6 md12>
                                      <v-text-field
                                        required
                                        :rules="[v => !!v || 'Harus Diisi']"
                                        v-model="editedItemLot.jumlah"
                                        label="jumlah"
                                        autofocus
                                      ></v-text-field>
                                    </v-flex>
                                  </v-layout>
                                </v-container>
                              </v-card-text>
                              <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn
                                  color="blue darken-1"
                                  flat
                                  :disabled="!validLot"
                                  @click="saveLot"
                                >Save</v-btn>
                                <v-btn color="blue darken-1" flat @click="closeLot">Cancel</v-btn>
                              </v-card-actions>
                            </v-form>
                          </v-card>
                        </v-dialog>
                      </v-flex>
                      <v-flex xs12>
                        <br>
                        <v-divider></v-divider>
                      </v-flex>
                      <v-flex xs12>
                        <v-data-table :headers="headersLot" :items="allLot" class="elevation-1">
                          <template slot="items" slot-scope="props">
                            <td>{{ props.index+1 }}</td>
                            <td>{{ props.item.kd_lot }}</td>
                            <td>{{ props.item.jumlah }}</td>
                            <td>{{ props.item.reject }}</td>
                            <td>{{ props.item.good }}</td>
                            <td>{{ getWaktu(props.item.created_at) }}</td>
                            <td>{{ getWaktu(props.item.updated_at) }}</td>
                            <td>
                              <v-icon small class="mr-2" @click="editItemLot(props.item)">edit</v-icon>
                              <v-icon small @click="deleteLot(props.item)">delete</v-icon>
                            </td>
                          </template>
                          <template slot="no-data">
                            <div class="text-xs-center">Tidak Ada Data</div>
                          </template>
                        </v-data-table>
                      </v-flex>
                    </v-layout>
                  </v-card-text>
                </v-card>
              </v-dialog>

              <v-data-table
                :headers="headersProses"
                :items="allProses"
                hide-actions
                class="elevation-1"
              >
                <template slot="items" slot-scope="props">
                  <td>{{ props.index+1 }}</td>
                  <td>{{ props.item.nama_proses }}</td>
                  <td>
                    <v-btn color="success" @click="pilihProses(props.item,props.index+1)">Pilih</v-btn>
                  </td>
                </template>
                <template slot="no-data">
                  <div class="text-xs-center">Tidak Ada Data</div>
                </template>
              </v-data-table>
            </v-stepper-content>
            <v-stepper-content step="3">
              <v-form ref="formLaporan" v-model="validLaporan" lazy-validation>
                <v-layout row wrap>
                  <v-flex xs2 md2 sm2 lg2>
                    <v-dialog
                      v-if="proses_ke == 1"
                      v-model="dialogInerPertama"
                      max-width="800px"
                      align-start
                      fill-height
                    >
                      <v-btn slot="activator" color="green white--text" dark>Inner</v-btn>
                      <v-card v-if="loadingIner == false">
                        <v-card-title
                          class="headline"
                          primary-title
                        >Inner {{ pol.kode_pol }} {{ pol.nama_pol }} {{ proses.nama_proses }}</v-card-title>
                        <v-card-text>
                          <v-divider></v-divider>
                          <v-text-field v-model="cariIner" label="Cari Iner"></v-text-field>
                          <v-btn
                            v-for="(iner,index) in filterIner"
                            :title="iner.isi + ' PCs'"
                            small
                            :class="iner.isi==250?'primary':'green'"
                            fab
                            @click="pilihIner(iner)"
                            :key="index"
                          >{{ iner.iner }}</v-btn>
                        </v-card-text>
                      </v-card>
                      <v-card v-if="loadingIner==true">
                        <v-card-text>
                          <v-layout align-center justify-center>
                            <v-progress-circular
                              :size="70"
                              :width="7"
                              indeterminate
                              color="primary"
                            ></v-progress-circular>
                          </v-layout>
                        </v-card-text>
                      </v-card>
                    </v-dialog>
                    <v-dialog
                      v-else
                      v-model="dialogInerDst"
                      align-start
                      fill-height
                      max-width="1000"
                    >
                      <v-btn slot="activator" color="green white--text" dark>Inner</v-btn>
                      <v-card v-if="loadingIner==false">
                        <v-card-title
                          class="headline"
                          primary-title
                          style="border-bottom : 0.1px solid grey;"
                        >
                          {{ pol.kode_pol }} {{ pol.nama_pol }}
                          <v-spacer></v-spacer>
                          <v-icon @click="dialogInerDst = false">close</v-icon>
                        </v-card-title>
                        <v-card-text style="min-height : 400px;">
                          <!-- {{ allProses[proses_ke-1].nama_proses }} -->
                          <v-text-field v-model="cariIner" label="cari"></v-text-field>
                          <v-data-table
                            :headers="headersInerDst"
                            :items="listIner"
                            :search="cariIner"
                            class="elevation-1"                                                        
                          >
                            <template slot="items" slot-scope="props">
                              <tr>
                                <td>{{ allProses[proses_ke-2].nama_proses }}</td>
                                <td>{{ props.item.iner }}</td>
                                <td>{{ props.item.operator }}</td>
                                <td>{{ getDate(props.item.created_at) }}</td>
                                <td>{{ getTime(props.item.created_at) }}</td>
                                <td>{{ getTime(props.item.updated_at) }}</td>
                                <td>
                                  <v-btn color="primary" @click="pilihIner(props.item)">
                                    <v-icon small class="mr-2">check_circle</v-icon>pilih
                                  </v-btn>
                                </td>
                              </tr>
                            </template>
                            <template slot="no-data">
                              <div class="text-xs-center">Tidak Ada Data</div>
                            </template>
                          </v-data-table>
                        </v-card-text>
                      </v-card>
                      <v-card v-if="loadingIner==true">
                        <v-card-text>
                          <v-layout align-center justify-center>
                            <v-progress-circular
                              :size="70"
                              :width="7"
                              indeterminate
                              color="primary"
                            ></v-progress-circular>
                          </v-layout>
                        </v-card-text>
                      </v-card>
                    </v-dialog>
                  </v-flex>
                  <v-flex xs1 md1 sm1 lg1>
                    <v-text-field
                      :rules="[v => !!v || 'Harus Diisi']"
                      label="Inner"
                      disabled="disabled"
                      v-model="laporanReguler.iner"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs1 sm1 md1 lg1>
                    <v-text-field
                      label="isi"
                      value="500"
                      v-model="laporanReguler.isi"
                      disabled="disabled"
                      :rules="[v => !!v || 'Harus Diisi']"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs1 sm1 md1 lg1>
                    <v-select
                      :rules="[v => !!v || 'Harus Diisi']"
                      :items="itemShift"
                      label="Shift"
                      v-model="laporanReguler.shift"
                    ></v-select>
                  </v-flex>
                  <v-flex xs1 sm1 md1 lg1>
                    <v-select
                      :rules="[v => !!v || 'Harus Diisi']"
                      :items="itemLine"
                      label="Line"
                      v-model="laporanReguler.line"
                    ></v-select>
                  </v-flex>
                  <v-flex xs2 sm2 md2 lg2>
                    <v-btn
                      color="primary"
                      class="black--text"
                      :disabled="!validLaporan"
                      @click="saveLaporan"
                    >Mulai</v-btn>
                  </v-flex>
                  <v-flex xs12>
                    <v-toolbar dense color="blue lighten-4">Sementara</v-toolbar>
                    <v-data-table
                      :headers="headersLaporanSaved"
                      hide-actions
                      :items="allLaporanTemp"
                      class="elevation-1"
                    >
                      <template slot="items" slot-scope="props">
                        <td>
                          <v-icon small @click="deleteLaporan(props.item)">delete</v-icon>
                        </td>
                        <td>{{ props.item.iner }}</td>
                        <td>{{ props.item.shift }}</td>
                        <td>{{ props.item.line }}</td>
                        <td>{{ props.item.isi }}</td>
                        <td>{{ getWaktu(props.item.created_at) }}</td>
                        <td>{{ getWaktu(props.item.updated_at) }}</td>
                        <td>{{ parseInt(props.item.dead) + parseInt(props.item.chip_error) + parseInt(props.item.chip_lemah) + parseInt(props.item.card_body)}}</td>
                        <td>{{ props.item.oplama }}</td>
                        <td>
                          <v-icon small class="mr-2" @click.stop="editLaporan(props.item)">edit</v-icon>
                        </td>
                      </template>
                      <template slot="no-data">
                        <div class="text-xs-center">Tidak Ada Data</div>
                      </template>
                    </v-data-table>
                  </v-flex>
                  <v-flex xs12>
                    <v-toolbar dense color="green lighten-4">Saved</v-toolbar>
                    <v-data-table
                      :headers="headersLaporanSaved"
                      hide-actions
                      :items="allLaporanSaved"
                      class="elevation-1"
                    >
                      <template slot="items" slot-scope="props">
                        <td>
                          <v-icon small @click="deleteLaporan(props.item)">delete</v-icon>
                        </td>
                        <td>{{ props.item.iner }}</td>
                        <td>{{ props.item.shift }}</td>
                        <td>{{ props.item.line }}</td>
                        <td>{{ props.item.isi }}</td>
                        <td>{{ getWaktu(props.item.created_at) }}</td>
                        <td>{{ getWaktu(props.item.updated_at) }}</td>
                        <td>{{ parseInt(props.item.dead) + parseInt(props.item.chip_error) + parseInt(props.item.chip_lemah) + parseInt(props.item.card_body)}}</td>
                        <td>{{ props.item.oplama }}</td>
                        <td>
                          <v-icon small class="mr-2" @click.stop="editLaporan(props.item)">edit</v-icon>
                        </td>
                      </template>
                      <template slot="no-data">
                        <div class="text-xs-center">Tidak Ada Data</div>
                      </template>
                    </v-data-table>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-dialog v-model="dialogUpdateLaporan" width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">Update Laporan</span>
          </v-card-title>
          <v-card-text>
            <v-form ref="formUpdateLaporan" v-model="validUpdateLaporan" lazy-validation>
              <v-layout row wrap align-center>
                <v-flex xs12 sm12 md12>
                  <v-select
                    required
                    min="0"
                    :items="allLot"
                    item-text="kd_lot"
                    item-value="id_lot"
                    label="kode Lot"
                    v-model="laporanReguler.id_lot"
                    :rules="[v => !!v || 'Item is required']"
                  ></v-select>
                </v-flex>
                <v-flex xs5>
                  <v-text-field
                    min="0"
                    label="dead"
                    type="number"
                    v-model="laporanReguler.dead"
                    autofocus
                  ></v-text-field>
                </v-flex>
                <v-flex xs5 offset-xs2>
                  <v-text-field
                    min="0"
                    label="chip lemah"
                    type="number"
                    v-model="laporanReguler.chip_lemah"
                    autofocus
                  ></v-text-field>
                </v-flex>
                <v-flex xs5>
                  <v-text-field
                    min="0"
                    label="card body"
                    type="number"
                    v-model="laporanReguler.card_body"
                    autofocus
                  ></v-text-field>
                </v-flex>
                <v-flex xs5 offset-xs2>
                  <v-text-field
                    min="0"
                    label="chip error"
                    type="number"
                    v-model="laporanReguler.chip_error"
                    autofocus
                  ></v-text-field>
                </v-flex>
                <v-checkbox label="Log ?" v-model="checkbox"></v-checkbox>
                <input type="file" ref="log" required>
              </v-layout>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="blue darken-1"
              flat
              :disabled="!validUpdateLaporan"
              @click="updateLaporan"
            >Save</v-btn>
            <!-- <v-btn color="blue darken-1" flat @click="close">Cancel</v-btn> -->
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  middleware: 'authLogin',
  //   async asyncData({ $axios, store }) {
  //     return $axios
  //       .$get('/pol', {
  //         headers: {
  //           Authorization: 'Bearer ' + store.state.auth.token.token
  //         }
  //       })
  //       .then(res => {
  //         return { pol: res.data.data }
  //       })
  //   },
  data() {
    return {
      loadingIner: false,
      snackbar: false,
      text: '',
      timeout: 4000,
      color: '',
      step: 1,
      cari: '',      
      validLot: true,
      validLaporan: true,
      validUpdateLaporan: true,
      dialogInerPertama: false,
      dialogInerDst: false,
      dialogLot: false,
      dialogTambahLot: false,
      dialogUpdateLaporan: false,
      log: '',
      headersProses: [
        { text: 'No', value: 'No', sortable: false },
        {
          text: 'Nama proses',
          value: 'nama_proses',
          sortable: false,
          width: '600px'
        },
        { text: 'Actions', value: 'name', sortable: false }
      ],
      headersPol: [
        { text: 'No', value: 'No', sortable: false },
        { text: 'kode pol', value: 'kode_pol', sortable: false },
        { text: 'nama pol', value: 'nama_pol', sortable: false },
        { text: 'jumlah order', value: 'jumlah_order', sortable: false },
        { text: 'total iner', value: 'total_iner', sortable: false },
        { text: 'lampiran', value: 'lampiran', sortable: false },
        { text: 'Actions', value: 'name', sortable: false }
      ],
      headersLot: [
        { text: 'No', value: 'No', sortable: false },
        { text: 'kode Lot', value: 'kode_lot', sortable: true },
        { text: 'Total', value: 'jumlah', sortable: true },
        { text: 'Reject', value: 'reject', sortable: true },
        { text: 'Good', value: 'goodt', sortable: true },
        { text: 'dibuat', value: 'created_at', sortable: true },
        { text: 'diubah', value: 'updated_at', sortable: true },
        { text: 'Actions', value: 'action', sortable: false }
      ],
      headersLaporanSaved: [
        { text: '', value: '', sortable: false },
        { text: 'iner', value: 'iner', sortable: true },
        { text: 'shift', value: 'shift', sortable: true },
        { text: 'line', value: 'line', sortable: true },
        { text: 'isi', value: 'isi', sortable: true },
        { text: 'created_at', value: 'created_at', sortable: true },
        { text: 'updated_at', value: 'updated_at', sortable: true },
        { text: 'reject', value: 'reject', sortable: true },
        { text: 'op lama', value: 'op_lama', sortable: true },
        { text: 'Actions', value: 'action', sortable: false }
      ],
      headersInerDst: [
        { text: 'nama proses', value: 'nama_proses', sortable: false },
        { text: 'iner', value: 'iner', sortable: true },
        { text: 'operator', value: 'operator', sortable: true },
        { text: 'Tanggal', value: 'tanggal', sortable: true },
        { text: 'jam mulai', value: 'jam_mulai', sortable: true },
        { text: 'jam selesai', value: 'jam_selesai', sortable: true },
        { text: 'Actions', value: 'action', sortable: false }
      ],
      loading: false,
      allPol: [],
      allProses: [],
      allLot: [],
      allLaporan: [],
      listIner: [],
      cariIner: '',
      proses: {},
      pol: {},
      proses_ke: null,
      page: 1,
      totalItems: 0,
      timer: 0,
      checkbox: true,
      laporanReguler: {
        id_laporan: '',
        id_pol: '',
        iner: '',
        isi: '',
        id_proses: '',
        proses_ke: '',
        shift: '',
        line: '',
        operator: '',
        id_lot: '',
        dead: '',
        chip_lemah: '',
        card_body: '',
        chip_error: '',
        log: '',
        old: '',
        status: '',
        created_at: '',
        updated_at: ''
      },
      DefaultlaporanReguler: {
        id_laporan: '',
        id_pol: '',
        iner: '',
        isi: '',
        id_proses: '',
        proses_ke: '',
        shift: '',
        line: '',
        operator: '',
        id_lot: '',
        dead: '',
        chip_lemah: '',
        card_body: '',
        chip_error: '',
        log: '',
        old: '',
        status: '',
        created_at: '',
        updated_at: ''
      },
      itemLine: [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20
      ],
      editedIndexLot: -1,
      editedItemLot: {
        id_lot: '',
        id_pol: '',
        kd_lot: '',
        jumlah: '',
        reject: '',
        good: '',
        created_at: '',
        updated_at: ''
      },
      defaultItemLot: {
        id_lot: '',
        id_pol: '',
        kd_lot: '',
        jumlah: '',
        reject: '',
        good: '',
        created_at: '',
        updated_at: ''
      },
      itemShift: [1, 2],
      breadcrumbs: [
        {
          text: 'home',
          disabled: false,
          href: ''
        },
        {
          text: 'Laporan',
          disabled: false,
          href: ''
        }
      ]
    }
  },
  computed: {
    allLaporanSaved() {
      return this.allLaporan.filter(kd => kd.status > 1)
    },
    allLaporanTemp() {
      return this.allLaporan.filter(kd => kd.status == 1)
    },
    formTitleLot() {
      return this.editedIndexLot === -1 ? 'New Lot' : 'Edit Lot'
    },
    // filterPol() {
    //   return this.allPol.filter(pros => {
    //     return pros.kode_pol.toLowerCase().match(this.cari)
    //   })
    // },
    pages() {
      return Math.ceil(this.totalItems / 5)
    },
    filterIner() {
      return this.listIner.filter(kd => kd.iner.toString().match(this.cariIner))
    },
    totalLot() {
      return this.allLot.reduce((acc, item) => acc + item.jumlah, 0)
    }
  },
  watch: {
    dialogInerPertama(val) {
      if (val) {
        this.ambilInerPertama()
      }
      this.closeIner()
    },
    dialogInerDst(val) {
      if (val) {
        this.ambilInerDst()
      }
      this.closeIner()
    },
    dialogLot(val) {
      this.ambilLot()
    }
  },
  created() {
    this.$store.commit('CHANGE_BREAD', { list: this.breadcrumbs })
    this.$store.commit('SET_JUDUL', 'Laporan')
    this.ambilPol()
  },
  methods: {
    ambilPol() {
      this.loading = true
      if (this.cari == '') {
        var cari = null
      } else {
        var cari = this.cari
      }
      this.$axios
        .$get('/data/pol/reguler/' + cari + '/' + this.page, {
          headers: {
            Authorization: 'Bearer ' + this.$store.state.auth.token.token
          }
        })
        .then(res => {
          this.allPol = res.data.data
          this.totalItems = res.data.total
          this.loading = false
        })
    },
    ambilInerPertama() {
      this.loadingIner = true
      this.$axios
        .$get('/laporan/iner/reguler/pertama/' + this.pol.id_pol, {
          headers: {
            Authorization: 'Bearer ' + this.$store.state.auth.token.token
          }
        })
        .then(res => {
          this.listIner = res.data
          this.loadingIner = false
        })
    },
    ambilInerDst() {
      this.loadingIner = true
      var ke = parseInt(this.proses_ke) - 1
      this.$axios
        .$get('/laporan/iner/reguler/' + ke + '/' + this.pol.id_pol, {
          headers: {
            Authorization: 'Bearer ' + this.$store.state.auth.token.token
          }
        })
        .then(res => {
          this.listIner = res.data
          this.loadingIner = false
        })
    },
    closeIner() {
      this.listIner = []
      this.cariIner = ''
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
    closeLot() {
      // this.$refs.form.reset()
      this.dialogTambahLot = false
      this.editedItemLot = Object.assign({}, this.defaultItemLot)
      this.editedIndexLot = -1
    },
    tampilAlert(alert, color) {
      this.text = alert
      this.color = color
      this.snackbar = true
    },
    waitInput() {
      this.page = 1
      this.loading = true
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
      this.timer = setTimeout(() => {
        this.ambilPol()
      }, 800)
    },
    ambilProses(id_pol) {
      this.$axios
        .$get('/pol/resume/' + id_pol, {
          headers: {
            Authorization: 'Bearer ' + this.$store.state.auth.token.token
          }
        })
        .then(res => {
          this.allProses = res.data
        })
    },
    ambilLot() {
      this.$axios
        .$get('/Lot/data/' + this.pol.id_pol, {
          headers: {
            Authorization: 'Bearer ' + this.$store.state.auth.token.token
          }
        })
        .then(res => {
          this.allLot = res.data
        })
    },
    ambilLaporanReguler() {
      this.$axios
        .$get(
          '/laporan/reguler/' +
            this.pol.id_pol +
            '/' +
            this.proses_ke +
            '/' +
            this.$store.state.auth.user.id,
          {
            headers: {
              Authorization: 'Bearer ' + this.$store.state.auth.token.token
            }
          }
        )
        .then(res => {
          this.allLaporan = res.data
        })
    },
    pilihPol(item) {
      this.step = 2
      this.ambilProses(item.id_pol)
      this.pol = item
    },
    pilihProses(item, ke) {
      this.proses = item
      this.proses_ke = ke
      this.step = 3
      this.ambilLaporanReguler()
    },
    pilihIner(iner) {
      this.laporanReguler.iner = iner.iner
      this.laporanReguler.isi = iner.isi
      this.laporanReguler.old = iner.id_laporan || ''
      this.laporanReguler.proses_ke = this.proses_ke
      this.laporanReguler.id_pol = this.pol.id_pol
      this.laporanReguler.id_proses = this.proses.id_proses
      this.laporanReguler.operator = this.$store.state.auth.user.id
      this.dialogInerPertama = false
      this.dialogInerDst = false
    },
    editItemLot(item) {
      this.editedIndexLot = this.allLot.indexOf(item)
      this.editedItemLot = Object.assign({}, item)
      this.dialogTambahLot = true
    },
    saveLot() {
      if (this.$refs.form.validate()) {
        if (this.editedIndexLot > -1) {
          this.snackbar = false
          var index = this.editedIndexLot
          this.$axios
            .$put(
              '/lot/' + this.editedItemLot.id_lot,
              {
                kd_lot: this.editedItemLot.kd_lot,
                jumlah: this.editedItemLot.jumlah
              },
              {
                headers: {
                  Authorization: 'Bearer ' + this.$store.state.auth.token.token
                }
              }
            )
            .then(response => {
              Object.assign(this.allLot[index], response.lot)
              this.tampilAlert('Berhasil Diupdate', 'blue')
              this.closeLot()
            })
            .catch(response => {
              this.tampilAlert('gagal di update', 'red')
              this.closeLot()
            })
        } else {
          this.snackbar = false
          this.$axios
            .$post(
              '/lot',
              {
                id_pol: this.pol.id_pol,
                kd_lot: this.editedItemLot.kd_lot,
                jumlah: this.editedItemLot.jumlah,
                reject: 0,
                good: this.editedItemLot.jumlah
              },
              {
                headers: {
                  Authorization: 'Bearer ' + this.$store.state.auth.token.token
                }
              }
            )
            .then(response => {
              this.allLot.push(response.lot)
              this.tampilAlert('Berhasil Disimpan', 'success')
              this.closeLot()
            })
            .catch(error => {
              console.log(error)
              this.closeLot()
            })
        }
      }
    },
    deleteLot(item) {
      this.snackbar = false
      const index = this.allLot.indexOf(item)

      if (confirm('Are you sure you want to delete this item?')) {
        this.$axios
          .delete('/lot/' + item.id_lot, {
            headers: {
              Authorization: 'Bearer ' + this.$store.state.auth.token.token
            }
          })
          .then(response => {
            this.allLot.splice(index, 1)
            this.tampilAlert('Berhasil Dihapus', 'red')
          })
      }
    },
    deleteLaporan(item) {
      this.snackbar = false
      var index = this.allLaporan.findIndex(
        x => x.id_laporan == item.id_laporan
      )

      if (confirm('Are you sure you want to delete this item?')) {
        this.$axios
          .delete('/reguler/' + item.id_laporan, {
            headers: {
              Authorization: 'Bearer ' + this.$store.state.auth.token.token
            }
          })
          .then(response => {
            this.allLaporan.splice(index, 1)
            this.tampilAlert('Berhasil Dihapus', 'red')
          })
      }
    },
    saveLaporan() {
      if (this.$refs.formLaporan.validate()) {
        var cek = this.allLaporan.filter(kd => kd.status == 1)

        if (cek.length > 0) {
          this.tampilAlert('selesaikan yang sudah ada dahulu', 'info')
        } else {
          this.laporanReguler.status = 1
          this.snackbar = false
          this.$axios
            .$post('/reguler', this.laporanReguler, {
              headers: {
                Authorization: 'Bearer ' + this.$store.state.auth.token.token
              }
            })
            .then(res => {
              this.allLaporan.push(res.reguler)
              this.tampilAlert('Berhasil Disimpan', 'success')
              this.closeLaporan()
            })
            .catch(error => {
              this.tampilAlert('Iner Sudah Pernah diinput', 'red')
              this.closeLaporan()
            })
        }
      }
    },
    closeLaporan() {
      this.DefaultlaporanReguler.shift = this.laporanReguler.shift
      this.DefaultlaporanReguler.line = this.laporanReguler.line
      this.laporanReguler = Object.assign({}, this.DefaultlaporanReguler)
    },
    editLaporan(item) {
      this.ambilLot()
      this.laporanReguler = Object.assign({}, item)
      this.dialogUpdateLaporan = true
    },
    updateLaporan() {
      if (this.$refs.formUpdateLaporan.validate()) {
        if (this.checkbox == true) {
          var log = 'this.$refs.log.files[0] == undefined'
        } else {
          var log = 'false'
        }

        if (eval(log)) {
          alert('Log belum dipilih')
        } else {
          this.log = this.$refs.log.files[0]
          let formData = new FormData()
          formData.append('id_lot', this.laporanReguler.id_lot)
          formData.append('dead', this.laporanReguler.dead)
          formData.append('chip_lemah', this.laporanReguler.chip_lemah)
          formData.append('chip_error', this.laporanReguler.chip_error)
          formData.append('card_body', this.laporanReguler.card_body)
          formData.append('log', this.log)

          this.$axios
            .$put('/reguler/' + this.laporanReguler.id_laporan, formData, {
              headers: {
                Authorization: 'Bearer ' + this.$store.state.auth.token.token,
                'Content-Type': 'multipart/form-data'
              }
            })
            .then(response => {
              var index = this.allLaporan.findIndex(
                x => x.id_laporan == this.laporanReguler.id_laporan
              )
              Object.assign(this.allLaporan[index], response.reguler)
              this.tampilAlert('Berhasil Diupdate', 'blue')
              this.closeLaporan()
              this.dialogUpdateLaporan = false
            })
            .catch(response => {
              this.tampilAlert('gagal di update', 'red')
            })
        }
      }
    },
    getWaktu(date){
    var d = new Date(new Date(date) * 1 + 1000 * 3600 * 7)
    //  return d.getFullYear()+'-'+d.getMonth()+'-'+d.getDay()+' '+d.getHours() + ':' + d.getMinutes() + ':'+d.getSeconds()
    return d.toLocaleString('en-gb')
    }
  }
}
</script>