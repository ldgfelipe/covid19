<template>
    <v-card>
        <v-card-title class="primary white--text">
           Pruebas Registradas
        </v-card-title>
        <v-card-text>
            <v-text-field v-model="search" label="Busqueda" />
            <v-data-table :search="search" :items="registros" :headers="cabecera">
                <template v-slot:item.ver='{item}'>
                    <v-btn @click="verpdf(item.dirpdf)"><v-icon>mdi-eye</v-icon></v-btn>
                </template>
                <template v-slot:item.positivo='{item}'>
                        {{item.positivo===true ? 'Positivo' : 'Negativo'}}
                </template>
                <template v-slot:item.eliminar='{item}'>
                        <v-btn class="error white--text" @click="deleteFile(item)"><v-icon>mdi-delete</v-icon></v-btn>
                </template>
                 <template v-slot:item.compartir='{item}'>
                     <v-row>
                        <v-col cols="6" md="6">
                         
                            <v-btn v-if="item.telefono.length>0" class="green white--text" @click="compartirWhatsapp(item)"><v-icon>mdi-whatsapp</v-icon></v-btn>
                            </v-col>
                             <v-col cols="6" md="6">
                         <v-btn  v-if="item.email.length>0" class="white red--text" @click="compartircorreo(item)"><v-icon>mdi-gmail</v-icon></v-btn>
                             </v-col>
                     </v-row>
               
                </template>
            </v-data-table>
        </v-card-text>
        </v-card>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
export default{
    data() {
        return {
            search:"",
            registros:[],
            cabecera:[
                  {
                    text:'uid',
                    value:'uid'
                },
                {
                    text:'Nombre',
                    value:'nombre'
                },
                {
                    text:'Fecha de Toma',
                    value:'fecha_toma'
                },
                {
                    text:"Resultado",
                    value:'positivo'       
                },
                {
                    text:'Compartir',
                    value:'compartir'
                },
                {
                    text:"Ver Resultado",
                    value:"ver"
                },
                {
                    text:'Eliminar',
                    value:'eliminar'
                }
            ] 
        }       
    },
    computed:{
        ...mapState(['is_login'])
    },
    created(){
        this.validasesion()
    },
    mounted(){
       
        this.cargaDatos()
    },
    methods:{
    async  cargaDatos(){
        this.registros=[]
            this.$fire.firestore.collection('datos').get()
            .then((res)=>{
                res.forEach((d)=>{
                    this.registros.push(d.data())
                })
           })
        },
    validasesion(){
        if(this.is_login===false){
            this.$router.push('/login')
        }
    },
    verpdf(a){
        console.log(a)
        window.open(a,'_blank')
        },
    deleteFile(p){
        if(confirm('¿Seguro que desea eliminar la prueba?')){
            ///// elimina el archivo 
             const storage = this.$fire.storage

               const desertRef = storage.refFromURL (p.dirpdf);


               desertRef.delete().then(()=>{
                    console.log('se elimino correctamente el archivo')

                    this.$fire.firestore.collection('datos').doc(p.uid).delete().then((re)=>{
                        console.log('datos eliminados correctamente')
                        this.cargaDatos()
                    })
                    .catch((error)=>{
                        console.log(error)
                    })

                }).catch((error)=>{
                    console.log(error)
                })
         
        }else{
            alert('NO se elimina')
        }
    },
     compartirWhatsapp(p){
    var urlhost=window.location.port ? window.location.protocol+"//"+window.location.hostname+":"+window.location.port : window.location.protocol+"//"+window.location.hostname

   window.open("https://api.whatsapp.com/send?phone=52"+p.telefono+"&text=Descargue la liga de sus resultados en el siguiente enlace "+urlhost+"/descargarachivo?uid="+p.uid,'_blank')
  },  
     compartircorreo(p){
           var urlhost=window.location.port ? window.location.protocol+"//"+window.location.hostname+":"+window.location.port : window.location.protocol+"//"+window.location.hostname
   window.open("mailto:"+p.email+'?subject=Resultados prueba covid19&body=Descargue la liga de sus resultados en el siguiente enlace '+urlhost+'/descargarachivo?uid='+p.uid,'_blank')
  },  
  

    }
}
</script>
