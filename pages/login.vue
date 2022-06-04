<template>
    <v-card max-width="600" class="ma-auto">
        <v-card-title class="primary white--text">
            Acceso a Sistema Covid 
        </v-card-title>
        <v-card-text>
            

                <v-text-field label="Correo" v-model="loginform.user"></v-text-field>
                <v-text-field label="Contraseña" type="password" v-model="loginform.pass" ></v-text-field>
                <v-btn class="primary white--text" @click="loginAuth()">Acceder</v-btn> <v-btn class="secondary white--text" @click="registrarUsuario()">Registrar</v-btn>
               
               <br />
               Code: {{errorCode==='auth/user-not-found' ? 'El usuario no existe debe registrarse' : ''}} <br />
               Mensaje:<b> {{Message}}</b>
        </v-card-text>
    </v-card>
</template> 
<script>
import { mapState, mapMutations } from 'vuex'
export default {
    data() {
        return {
            loginform:{},
            errorCode:"",
          Message:""
        }
        },
    computed:{
       ...mapState(['is_login'])
    },
    methods:{

        ...mapMutations(['statelogin']),
       async loginAuth(){
            var getAuth = await this.$fire.auth
         getAuth.signInWithEmailAndPassword(this.loginform.user.trim(),this.loginform.pass)
            .then((res)=>{
          this.$fire.firestore
            .collection('autorizados')
            .where('correo', '==', res.user.email)
            .get()
            .then((user) => {
            
                if(user.docs[0].data().status===true){
                 this.errorCode=""
                 this.Message = "Usuario logeado correctamente";
                 this.$router.push("/")
                     this.statelogin(true);
                }else{
                this.errorCode=""
                 this.Message = "Usuario logeado correctamente pero no cuenta con los permisos necesarios";
                    setTimeout(()=>{
                      this.$fire.auth.signOut()
                            this.statelogin(false);
                            this.$router.push('login')
                    },3000)
                }
              })
            })
             .catch((error) => {
                    this.errorCode = error.code;
  
                });
        },
        registrarUsuario(){
             var getAuth = this.$fire.auth
            getAuth.createUserWithEmailAndPassword(this.loginform.user,this.loginform.pass)
                .then((userCredential) => {
                       this.$fire.firestore
            .collection('autorizados')
            .where('correo', '==', res.user.email)
            .get()
            .then((user) => {
                     if(user.docs[0].data().status===true){

                     // Signed in
                    const user = userCredential.user;
                    // ...
                     this.errorCode=""
                    
                     this.Message = "Usuario registrado correctamente";
                     this.$router.push("/")           

                }else{
                     this.errorCode=""
                 this.Message = "Usuario logeado correctamente pero no cuenta con los permisos necesarios";
                 setTimeout(()=>{
                      this.$fire.auth.signOut()
                        this.statelogin(false);
                     this.$router.push('login')
                 },3000)
                }
            })
                })
                .catch((error) => {
                    this.errorCode = error.code;
                    // ..
                });
        }
    }
}
</script>
