<template>
  <v-app id="login">    
    
    <v-img :gradient="gradient" dark >
      <v-container >
        <v-layout align-center>
          <v-flex text-xs-center>
            <v-content>
              <nuxt/>
            </v-content>
          </v-flex>
        </v-layout>
      </v-container>
    </v-img>
  </v-app>
</template>

<script>
export default {
  
  data: () => ({
    gradient: "to top, #7B1FA2, #E1BEE7",
    
  })
};
</script>

<style scoped lang="css">
#login {
  background: url(~assets/Paperless-work-order-VisualFactory.jpg) no-repeat center fixed;
  /* height: 50%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  content: "";
  z-index: 0; */
}
</style>
