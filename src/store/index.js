import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    users: []
  },
  mutations: {
    setUsers(state, content) {
      state.users = content
    },
    setNewUser(state, content) {
        state.users.unshift(content)
    },
    deleteUserId( state, content) {
        let index = content.index
        state.users.splice(index, 1)
    }
  },
  actions: {
      getUsers: async (context) => {
          await axios
              .get(`https://jsonplaceholder.typicode.com/users`)
              .then(resp => {
                console.log(resp.data);
                const content = resp.data;
                context.commit('setUsers', content);
              })
              .catch(error => {
                console.log(error);
              });
        },
      addUser: async (context, state) => {
          await context.commit('setNewUser', state);
      },
      deleteUser: async (context, state) => {
        await context.commit('deleteUserId', state);
      }
  },
  getters: {
      usersList: state => {
      return state.users
    }
  }
})
