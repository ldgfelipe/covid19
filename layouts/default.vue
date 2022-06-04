<template>
  <v-app>
    <v-row>
      <v-col cols="12">
        <v-toolbar class="primary">

              <v-menu               
            bottom
            left
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                dark
                icon
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-item
                v-for="(item, i) in items"
                :key="i"
              >
                <v-list-item-title>
                <v-btn :to="item.link">  {{ item.title }}</v-btn>
                  </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-spacer></v-spacer>
          <v-btn

            @click="cerrarCesion()"
            class="secondary white--text"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
      </v-col>

      <v-dialog
        v-model="loader"
        persistent
        color="white"
        max-width="300"
        ma="auto"
      >
        <v-card>
          <v-card-text class="text-center">
            <v-progress-circular
              color="primary"
              size="100"
              indeterminate
            ></v-progress-circular>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-col cols="12">
        <v-container>
          <Nuxt />
        </v-container>
      </v-col>
    </v-row>

    <v-footer app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import {mapState,mapMutations   } from 'vuex'
export default {
  name: 'DefaultLayout',
  data() {
    return {
      loader: false,
      user: {},
      items:[
         { title: 'Registrados', link:'registrados' },
          { title: 'Nuevo Registro', link:'/' },
      ]
      
    } 
  },
  computed:{
    ...mapState(['is_login'])
  },
  methods: {
    ...mapMutations(['statelogin']),
    islogin(){
       var user=this.$fire.auth.currentUser
      if(user!=null){
        this.statelogin(true)
      }else{
       this.statelogin(false)
      }
    },
    idAuth() {
      var user = Promise.resolve(this.$fire.auth.currentUser)
      user.then((user) => {
        console.log(user)
        //// verifica si el correo esta autorizado para acceder
 this.loader = false
        if (user === null) {
          console.log('user:null')
         switch(this.$router.currentRoute.path) {
            case  '/login':
            case  '/descargarachivo':

           break;
           default:
            this.$router.push('/login')
           break;
          }
        } else {
          console.log('user:NotNull')
          this.is_login = true
          this.$fire.firestore
            .collection('autorizados')
            .where('correo', '==', user.email)
            .get()
            .then((res) => {
              if (res.empty===false && res.docs[0].data().status === true) {
                this.$router.push("/");
              }else{
                this.cerrarCesion()
             }
          })
        }
      })
    },
    cerrarCesion() {
      this.$fire.auth.signOut()
      window.location.href = '/'
    },
  },
  mounted(){
    this.islogin()
  },
  created() {
   /// this.idAuth()
    console.log(window.location)
  },
}
</script>
