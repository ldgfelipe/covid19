import Vuex from "vuex";

const createStore = () => {
    return new Vuex.Store({
      state: () => ({
          login:"logeado",
          is_login:false
      }),
      mutations:{
          statelogin(state,data){
            state.is_login=data
          }
      }
    })

}



export default createStore;