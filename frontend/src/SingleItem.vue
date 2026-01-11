<template>
    <em v-if="item.loading">Loading item...</em>

    <div v-else>
        <p>Item name: {{ item.name }}</p>
        <p>Item description: {{ item.descrpition }}</p>

        <hr />
        <p>All item info (for debugging during development)</p>
        <p>{{ item }}</p>
    </div>

    <div v-if="error">
        {{ error }}
    </div>
</template>






<script>
import { coreService } from './services/coreService'

export default {
    data() {
        return {
            item: {},
            error: ""
        }
    },
    mounted() {
        this.item.loading = true

        coreService.getSingleItem(this.$route.params.id)
        .then((item) => {
            this.item = item
        })
        .catch(error => this.error = error)
    }
}

</script>
