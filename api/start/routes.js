'use strict'
const Helpers = use('Helpers')
const Route = use('Route')


//user
Route.group(()=>{
  Route.post('login', 'Auth/AuthenticationController.login')
  Route.post('register', 'Auth/AuthenticationController.register')
  Route.get('me', 'Auth/AuthenticationController.me').middleware(['auth'])
  Route.get('userAll/:cari/:page', 'Auth/AuthenticationController.all').middleware(['auth'])
  Route.delete('user/:id', 'Auth/AuthenticationController.delete').middleware(['auth'])
  Route.put('user/:id', 'Auth/AuthenticationController.update').middleware(['auth'])

}).prefix('api')

Route.group(() => {
  //pol
  Route.resource('subBayar', 'subBayarController')  
  Route.get('pol/resume/:id_pol', 'PolController.resume')

  Route.get('angkatan/aktif', 'angkatanController.aktif')
  Route.resource('angkatan', 'angkatanController')  
  
  Route.resource('users', 'usersController')
  Route.get('users/:cari/:page', 'usersController.all')

  Route.resource('mahasiswa', 'mahasiswaController')  
  Route.get('mahasiswa/:cari/:page', 'mahasiswaController.all')
  Route.get('resume/mahasiswa/:cari/:page/:angkatan', 'mahasiswaController.resume')

  Route.get('kuitansi/resume/:id_mahasiswa', 'pembayaranController.kuitansiResume')
  Route.get('kuitansi/riwayat/:cari/:page', 'pembayaranController.riwayat')
  Route.get('kuitansi/:awal/:akhir', 'pembayaranController.tanggal')
  Route.post('kuitansi', 'pembayaranController.store')
  Route.delete('kuitansi/:nomor_kuitansi', 'pembayaranController.delete')

}).prefix('api').middleware(['auth'])
