  <template>
<v-card>
<v-card-text v-if="is_login===true">


        <v-row justify="center" align="center" v-if="partes.seccion1===true">
          <v-col cols="12" md="12">
            Fecha de Toma: {{formato.fecha_toma}}
          </v-col>
          <v-col cols="12"  md="10">
          <h2> Captura de datos Covid 19</h2>
          </v-col>
          
          
          <v-col cols="12" md="10">
                  <label>Nombre</label>
                  <v-text-field  v-model="formato.nombre" ></v-text-field>
          </v-col>
           <v-col cols="12" md="10">
                  <label>Correo Electronico</label>
                  <v-text-field   v-model="formato.email" ></v-text-field>
          </v-col>  
          <!---<v-col cols="12" md="10">
                  <label>Fecha de Nacimiento</label>
                  <v-text-field type="Date"  v-model="formato.fecha" ></v-text-field>
          </v-col>  ---->
          <v-col cols="12" md="10">
                  <label>Teléfono</label>
                  <v-text-field type="Number"  v-model="formato.telefono"  ></v-text-field>
          </v-col>    
      
             <v-col cols="6" md="5" >
               Resultado de Prueba:<br />
           <v-switch 
           v-model="formato.positivo"
           :label="formato.positivo===true ? 'Positivo' : 'Negativo'"
           inset  
             >
           </v-switch>      
          
          </v-col>


           <v-col cols="6" md="5" >

           <v-switch 
           v-model="formato.pruebares"
           :label="formato.pruebares===true ? 'Prueba PCR' : 'Antigeno de SARS-COVID'"
           inset  
             >
           </v-switch>      
          
          </v-col>  
               <v-col col="12" md="12" >
                  <v-card>
                        <v-card-text class="text-center">
                        <h3>Los datos se registraron correctamente</h3>
                            <v-btn class="primary white--text" @click="crearPDFResultado()">Crear Archivo PDF</v-btn><br />
                        </v-card-text>
                  </v-card>
                </v-col>
           </v-row>



           <v-row justify="center" align="center" v-if="partes.seccion2===true">
                <v-col col="12" md="12" >
                  <v-card>
                        <v-card-text class="text-center">
                        <h3>Los datos se registraron correctamente</h3>
                            <v-btn v-if="compartewhatsapp===true"  class="secondary white--text" @click="descargarPDF()">Descargar</v-btn>
                           <br />

                     

                           <v-btn class="green white--text" @click="compartirWhatsapp()" v-if="compartewhatsapp===true"  >Enviar Mensaje Whatsapp</v-btn>
                          <br />
                        
                            <v-btn class="primary white--text" @click="guardaparteIni()">Iniciar nueva prueba</v-btn>
                        </v-card-text>
                  </v-card>
              </v-col>
           </v-row>

  </v-card-text>

  <v-card-text v-if="is_login===false" class="ma-auto text-center">

    <v-btn class="primary white--text" @click="$router.push('/login')">Ingresa al sistema</v-btn>

  </v-card-text>
 </v-card> 
</template>

<script>
import { jsPDF } from "jspdf";
import { mapState , mapMutations } from 'vuex'
export default {
  data(){
    return {
      formato:{
        nombre:"",
        email:"",
        telefono:"",
        edad:"",
        positivo:true,
        fecha_toma:"",
        sexo:"",
        desc:"",
        pruebares:true

      },
      partes:{
        seccion1:true,
        seccion2:false,
        seccion3:false,
        seccion4:false
      },
      numwhats:"",
      compartewhatsapp:false,
      iddata:"",
     
    }
  },
  computed:{
    ...mapState(['is_login']),
  },
  created(){
    var idfecha=new Date();
    this.iddata='resultadoCovid'+this._uid+idfecha.getDay()+idfecha.getMonth()+idfecha.getFullYear()+idfecha.getSeconds()+idfecha.getMilliseconds();
      this.formato.fecha_toma=idfecha.toISOString().split('T')[0];
    
  },
  mounted(){

    this.validuser()
  },
  methods:{
        ...mapMutations(['statelogin']),
    validuser(){
      var user=this.$fire.auth.currentUser
      if(user!=null){
        this.statelogin(true)

      }else{
 
      }
    },
     guardaparte1(){
        this.partes.seccion1=false
        this.partes.seccion2=true
    
    },
    guardaparte2(){
        this.partes.seccion2=false
        this.partes.seccion3=true
    },

    guardaparte3(){
        this.partes.seccion3=false
        this.partes.seccion4=true
    },
    guardaparteIni(){
        this.partes.seccion1=true
        this.partes.seccion2=false
        this.partes.seccion3=false
        this.partes.seccion4=false
        this.formato={}   
    },
  async crearPDFResultado(){
 this.partes.seccion1=false 
 this.partes.seccion2=true
///// inicio crea formato pdf 

        const doc = new jsPDF();
      doc.addImage('images/logo_hospital_puebla.png','png', 5, 5, 20,25);
      doc.addImage('images/logo_hospital_angeles.png','png', 25, 5, 25, 25);
      doc.setFontSize(10);
      doc.text(60, 15, 'DR. CHRISTIAN IVAN MARTINEZ.');
      doc.text(60, 20, 'BENEMERITA UNIVERSIDAD AUTONOMA DE PUEBLA');
      doc.text(60, 25, 'CED.PROF.5367052 CERTIFICACION CONAMEGE 7832');

      doc.line(8, 40, 200, 40);
      doc.line(8, 42, 200, 42);
      var fechahoy=new Date();
      doc.setFontSize(10);

       doc.setFontSize(12);  
     /* doc.text(10, 50, 'Fecha de Nacimiento');
      doc.text(100, 50, this.formato.fecha);*/  
      doc.text(10, 55, 'Paciente');
      doc.text(50, 55, this.formato.nombre);
      doc.text(10, 70, 'Fecha de toma');
      doc.text(50, 70, this.formato.fecha_toma);
      /*  doc.text(10, 65, 'Sexo');
      doc.text(100, 65, this.formato.sexo);
      doc.text(10, 70, 'Edad');
      doc.text(100, 70, this.formato.edad.toString());
      doc.text(85, 80, 'Descripción');*/

      /*doc.setTextColor(100);  
      doc.text(10, 85, this.formato.desc.substr(0,110));
      doc.text(10, 90, this.formato.desc.substr(110,110));
      doc.text(10, 95, this.formato.desc.substr(220,110));
      doc.text(10, 100, this.formato.desc.substr(330,110));
      doc.text(10, 105, this.formato.desc.substr(440,110));*/
      doc.setTextColor(0);
          doc.setFontSize(15);  
      //doc.text(10, 110, 'PRUEBA PCR  Y ANTIGENO DE SARS-COV2 (COVID-19)');
      doc.text(10, 90, this.formato.pruebares===true ? 'PRUEBA PCR' : 'ANTIGENO PRUEBA RAPIDA' );

      doc.text(10, 100, 'RESULTADO: ');
      doc.text(50, 100, this.formato.positivo === true ? 'POSITIVO' :  'NEGATIVO' );
///// fin crea formato pdf
      doc.line(8, 135, 200, 135); 
      doc.line(8, 137, 200, 137);

       doc.setFontSize(8);
      doc.text(5, 140, 'Un resultado positivo indica que a sido detectado el antigeno del virus SARS-COV 2, en la muestra analizada');
      doc.text(5, 145, 'Un resultado negativocon presencia de sintomas, se sugiere realizar pruebas complementarias para confirmar resultado');
      
      
      doc.text(5, 150, 'Este resultado debe interpretarse por el medico en el contexto clinico, No debe ser utilizado como unica base para el diagnostico');
      doc.text(5, 155, 'toma de decisiones de manejo y tratamiento del paciente ');

      doc.text(5, 160, 'Tipo de muestra : Exudado Faringeo ');
      doc.text(5, 165, 'Metodo :Inmunocromatografia ');
      doc.text(5, 170, 'Kit de deteccion :Sars-cov 2 Pcr y Antigeno test Roche Diagnostics ');
      doc.text(5, 175, 'Sensibilidad :96.52%');
      doc.text(5, 180, 'Especificidad:99.68%');


      doc.text(5, 190, 'validado :Q.F.B Alejandra Juarez Rojas');
      doc.text(5, 195, 'responsable de laboratorio CED. PROF 9592468');

      doc.addImage('images/fdocmartinez.png','png', 100, 170, 30, 30);

      doc.text(5, 255, 'HOSPITAL PUEBLA: AVENIDA ATLIXCAYOTL EDIFICIO RAMBLAS CONSULTORIO 928');
      doc.text(5, 260, 'CONSULTORIO PARTICULAR');
      doc.text(5, 265, 'DR.IVAN.MARTINEZ.@HOTMAIL.COM');

      const file = doc.output("blob");
      
      this.uploadFile(file);

    },
  async uploadFile(file){
    
       const metadata = {
            contentType: file.type
          }

 this.$fire.firestore.collection('datos').add(this.formato)
        .then((res)=>{
          console.log(res)
          this.formato.uid=res.id
            this.compartewhatsapp=true
        });


      const storage =this.$fire.storage

      const imageRef = await storage.ref('pdfs/'+this.iddata+'/'+this.iddata+'.pdf')
       const uploadTask = imageRef.put(file, metadata).then((snapshot) => {
        // Once the image is uploaded, obtain the download URL, which
        // is the publicly accessible URL of the image.
        return snapshot.ref.getDownloadURL().then((url) => {
          this.formato.dirpdf=url

      this.$fire.firestore.collection('datos').doc(this.formato.uid)
      .update(this.formato)
      this.guardaparte3()
        return url
        })
      }).catch((error) => {
        console.error('Error uploading image', error)
      })

      // When the upload ends, set the value of the blog image URL
      // and signal that uploading is done.
      await uploadTask.then((url) => {
               
      })
    },
  compartirWhatsapp(){
    var urlhost=window.location.port ? window.location.protocol+"//"+window.location.hostname+":"+window.location.port : window.location.protocol+"//"+window.location.hostname

   window.open("https://api.whatsapp.com/send?phone=52"+this.formato.telefono+"&text=Descargue la liga de sus resultados en el siguiente enlace "+urlhost+"/descargarachivo?uid="+this.formato.uid,'_blank')
  },
  descargarPDF(){
    window.open(this.formato.dirpdf,'_blank')
  } 
  }
}
</script>
