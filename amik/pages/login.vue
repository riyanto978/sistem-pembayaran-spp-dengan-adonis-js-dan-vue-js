<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-snackbar
        v-model="snackbar"
        :left="true"
        :bottom="true"
        :timeout="5000"
        :multi-line="true"
        :color="color"
        :auto-height="true"
      >
        {{ text }}
        <v-btn color="pink" flat @click="snackbar = false">Close</v-btn>
      </v-snackbar>
      <v-flex xs12 sm8 md4 lg4>
        <v-card class="elevation-1 pa-3">
          <v-card-text>
            <div class="layout column align-center">
              <img src="@/static/logo.png" alt="Vue Material Admin" width="120" height="120">
              <h1 class="flex my-4 primary--text">AMIK JTC Semarang</h1>
            </div>
            <v-form>
              <v-text-field
                autofocus
                append-icon="person"
                name="login"
                label="Login"
                type="text"
                v-model="user.username"
              ></v-text-field>
              <v-text-field
                @keypress.enter="login"
                append-icon="lock"
                name="password"
                label="Password"
                id="password"
                type="password"
                v-model="user.password"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn block color="success" @click="login" :loading="loading">Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  layout: 'loginTemplate',
  middleware: 'sudahLogin',
  data: () => ({
    loading: false,
    text : '',
    snackbar : false,
    color : '',
    user: {
      username: '',
      password: ''
    }
  }),
  computed: {},
  methods: {
    async login() {
      
      try {
        const auth = await this.$axios.$post(
          'http://127.0.0.1:3333/api/login',
          this.user
        )
        this.$store.commit('SET_USER', auth)
        this.$router.push('/')
      } catch (e) {
        this.tampilAlert("Login Salah", "red");
        this.user.username = ''
        this.user.password = ''
      }    
    },
  tampilAlert(alert, color) {
      this.text = alert;
      this.color = color;
      this.snackbar = true;
    },
  }
}
</script>

