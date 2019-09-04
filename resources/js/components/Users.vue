<template>

    <div class="container">
        <div class="row pt-5" v-if="$gate.isAdminOrAuthor()">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Users Table</h3>

                        <div class="card-tools">
                            <button class="btn btn-success" @click="NewModal">
                                Add New
                                <i class="fa fa-user-plus fa-fw"></i>
                            </button>
                        </div>
                    </div>
                    <!-- /.card-header -->
                    <div class="card-body table-responsive p-0">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Type</th>
                                    <th>Date Registered</th>
                                    <th>Modify</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="user in users.data" :key="user.id">
                                    <td>{{user.id}}</td>
                                    <td>{{user.name}}</td>
                                    <td>{{user.email}}</td>
                                    <td>{{user.type | ProperCase}}</td>
                                    <td>{{user.created_at | customDate}}</td>
                                    <td>
                                        <a href="#" @click="EditModal(user)">
                                            <i class="fa fa-edit text-blue"></i>
                                        </a>
                                        /
                                        <a href="#" @click="deleteUser(user.id)">
                                            <i class="fa fa-trash text-red"></i>
                                        </a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <!-- /.card-body -->
                    <div class="card-footer">
                        <pagination :data="users" @pagination-change-page="getResults"></pagination>
                    </div>
                </div>

                <!-- /.card -->
            </div>
        </div>

        <div v-if="!$gate.isAdminOrAuthor()">
            <not-found></not-found>
        </div>

        <!-- Modal -->
        <div class="modal fade" id="addNewUserModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
            aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 v-show="!editmode" class="modal-title" id="exampleModalLabel">Add New</h5>
                        <h5 v-show="editmode" class="modal-title" id="exampleModalLabel">Update User's Information</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>

                    <form @submit.prevent="editmode ? updateUser() : createUser()">
                        <div class="modal-body">
                            <div class="form-group">
                                <input v-model="form.name" placeholder="Name" type="text" name="name" autocomplete="off"
                                    class="form-control" :class="{ 'is-invalid': form.errors.has('name') }" />
                                <has-error :form="form" field="name"></has-error>
                            </div>

                            <div class="form-group">
                                <input v-model="form.email" placeholder="Email Address" type="text" name="email"
                                    autocomplete="off" class="form-control"
                                    :class="{ 'is-invalid': form.errors.has('email') }" />
                                <has-error :form="form" field="email"></has-error>
                            </div>

                            <div class="form-group">
                                <textarea v-model="form.bio" id="bio" placeholder="Short for user (Optional)"
                                    type="text" name="email" class="form-control"
                                    :class="{ 'is-invalid': form.errors.has('bio') }"></textarea>
                                <has-error :form="form" field="email"></has-error>
                            </div>

                            <div class="form-group">
                                <select v-model="form.type" id="type" name="type" class="form-control"
                                    :class="{ 'is-invalid': form.errors.has('type') }">
                                    <option value>Select User Role</option>
                                    <option value="admin">Admin</option>
                                    <option value="user">Standard User</option>
                                    <option value="author">Author</option>
                                </select>
                                <has-error :form="form" field="type"></has-error>
                            </div>

                            <div class="form-group">
                                <input v-model="form.password" id="password" type="password" name="password"
                                    class="form-control" :class="{ 'is-invalid': form.errors.has('password') }" />
                                <has-error :form="form" field="password"></has-error>
                            </div>
                        </div>

                        <div class="modal-footer">
                            <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                            <button v-show="!editmode" type="submit" class="btn btn-primary">Create</button>
                            <button v-show="editmode" type="submit" class="btn btn-success">Save Changes</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
    export default {
        data() {
            return {
                editmode: false,
                users: {},
                form: new Form({
                    id: "",
                    name: "",
                    email: "",
                    password: "",
                    type: "",
                    bio: "",
                    photo: ""
                })
            };
        },
        methods: {
            loadUsers() {
                if (this.$gate.isAdminOrAuthor()) {
                    axios.get('api/user').then(({
                        data
                    }) => (this.users) = data);
                }
            },
            // Our method to GET results from a Laravel endpoint
            getResults(page = 1) {
                axios.get('api/user?page=' + page)
                    .then(response => {
                        this.users = response.data;
                    });
            },
            createUser() {
                this.$Progress.start();
                this.form.post('api/user').then(() => {
                    $('#addNewUserModal').modal('hide')
                    Toast.fire({
                        type: 'success',
                        title: 'User created successfully'
                    })
                    this.$Progress.finish();
                    evt.$emit('fnLoadUsers');
                }).catch(() => {
                    this.$Progress.fail();
                })
            },
            updateUser() {
                this.$Progress.start();
                this.form.put('api/user/' + this.form.id)
                    .then(() => {
                        $('#addNewUserModal').modal('hide')
                        Toast.fire({
                            type: 'success',
                            title: 'User updated successfully'
                        })
                        this.$Progress.finish();
                        evt.$emit('fnLoadUsers');
                    })
                    .catch(() => {
                        this.$Progress.fail();
                    });
            },
            EditModal(user) {
                this.editmode = true;
                this.form.reset();
                $('#addNewUserModal').modal('show');
                this.form.fill(user);
            },
            NewModal() {
                this.editmode = false;
                this.form.reset()
                $('#addNewUserModal').modal('show');
            },
            deleteUser(id) {
                Swal.fire({
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!'
                }).then((result) => {
                    if (result.value) {
                        // Send Request to the server
                        this.$Progress.start();
                        this.form.delete('api/user/' + id).then(() => {
                            Swal.fire(
                                'Deleted!',
                                'Your file has been deleted.',
                                'success'
                            )
                            this.$Progress.finish();
                            evt.$emit('fnLoadUsers');
                        }).catch(() => {
                            this.$Progress.fail();
                        })
                    }
                })
            }
        },
        created() {
            this.loadUsers();
            evt.$on('fnLoadUsers', () => {
                this.loadUsers();
            });
        }
    };

</script>
