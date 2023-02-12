<template>
    <div>
        <h1>User List</h1>
        <button @click="getUsers">ClickMe</button>
    </div>
</template>

<script>
export default {
    name: "UserList",
    methods: {
        getUsers() {
            this.$axios.get(`/users`).then((response) => {
                console.log(response)
            })
        }
    }
}
</script>