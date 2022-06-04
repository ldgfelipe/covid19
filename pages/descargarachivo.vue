<template>
<v-main>
    <v-card>
        <v-card-text class="ma-auto text-center">
          <h3>  Nombre: <b>{{formato.nombre}}</b> </h3>
          <h3>  Edad: <b>{{formato.edad}}</b> </h3>
           <h3>  Fecha de Toma: <b>{{formato.fecha_toma}}</b> </h3>
          
          <br />

            <v-btn @click="descargarResultado()" class="primary whtie--text"><v-icon>mdi-download</v-icon> Descargar Resultados</v-btn>
        </v-card-text>
    </v-card>
</v-main>
</template>
<script>

export default {
      
    data(){
        return {
            uid:"",
            enlace:"",
            formato:{}
        }
    },
    methods:{
        async cargaurl(){
            await this.$fire.firestore.collection('datos').doc(this.$router.currentRoute.query.uid).get()
            .then((res)=>{
                this.formato=res.data()
                this.enlace=res.data().dirpdf
            })
        },
        descargarResultado(){
            window.open(this.enlace,'_blank')
        }
    },
    created(){
        this.cargaurl()
    }
  
}
</script>
