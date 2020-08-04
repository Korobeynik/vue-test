<template>
  <v-app id="inspire">
    <v-app-bar
        app
        color="indigo accent-3"
        dark
    >
      <v-toolbar-title class="title ml-3 mr-5">Best Users</v-toolbar-title>
    </v-app-bar>
    <v-main>
      <v-container
          class="fill-height"
          fluid
      >
        <v-row
            align="center"
            justify="center"
        >
          <v-col class="text-center">
            <v-card>
              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <v-card-title>
                    Users table
                  </v-card-title>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                      v-model="searchInTable"
                      append-icon="mdi-magnify"
                      label="Search"
                      single-line
                      hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-dialog v-model="dialog" max-width="500px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                          color="primary"
                          dark
                          class="mb-2"
                          v-bind="attrs"
                          v-on="on"
                      >New User</v-btn>
                    </template>
                    <v-card>
                      <v-card-text>
                        <v-form ref="form">
                          <v-row>
                            <v-col cols="12" sm="6" md="6">
                              <v-text-field :rules="nameRules" v-model="editedItem.name" label="User name"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <v-text-field :rules="emailRules" v-model="editedItem.email" label="Email"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                              <v-text-field v-model="editedItem.address.street" label="Address"></v-text-field>
                            </v-col>
                          </v-row>
                        </v-form>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                        <v-btn color="blue darken-1" text @click="save">Save</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-col>
              </v-row>
              <v-data-table
                  :headers="headers"
                  :items="usersList"
                  :search="searchInTable"
                  :loading="loader"
                  item-key="index"
                  class="elevation-1"
              >
                <template v-slot:item.actions="{ item }">
                  <div class="my-2">
                    <v-btn @click="deleteItem(item)" small color="error">Delete</v-btn>
                  </div>
                </template>
              </v-data-table>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <v-footer
        color="indigo accent-3"
        app
    >
      <span class="white--text">&copy; 2020</span>
    </v-footer>
  </v-app>
</template>

<script>
  export default {
    data: () => ({
      dialog: false,
      searchInTable: '',
      loader: true,
      nameRules: [
        v => !!v || 'Name is required',
      ],
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      headers: [
        {text: 'Name', align: 'start',  value: 'name',},
        {text: 'Email', value: 'email'},
        {text: 'Address', value: 'address.street'},
        {text: 'Actions', value: 'actions', sortable: false },
      ],
      users: [],
      editedIndex: -1,
      editedItem: {
        name: '',
        email: '',
        address: {
          street: ''
        }
      }
    }),

    watch: {
      dialog (val) {
        val || this.close()
      },
    },

    created () {
      this.initialize()
    },


    computed: {
      usersList() {
        return this.$store.getters.usersList
      }
    },

    methods: {
      async initialize () {
        this.loader = true;
        try {
          await this.$store.dispatch("getUsers");
          this.loader = false;
        } catch (e) {
          console.log(e)
        }
      },

      deleteItem (item) {
        const index = this.usersList.indexOf(item)
        if(confirm('Are you sure you want to delete this item?')) {
          const data = {
            index: index
          }
          this.$store.dispatch('deleteUser', data)
        }
      },

      close () {
        this.dialog = false
      },

      reset () {
        this.$refs.form.reset()
      },

      save () {
        if(!this.$refs.form.validate()) {
          return
        }
        if (this.editedIndex > -1) {
          Object.assign(this.users[this.editedIndex], this.editedItem)
        } else {
          const data = {
            name: this.editedItem.name,
            email: this.editedItem.email,
            address: {
              street: this.editedItem.address.street
            }
          };
          this.$store.dispatch('addUser', data)
          this.reset()
        }
        this.close()
      }

    }
  }
</script>
