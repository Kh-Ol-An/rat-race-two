<script setup>
import { computed } from "vue";
import { mapGetters } from "../store/helpers.js";
import Blank from '../components/Blank.vue'

const { getBlank } = mapGetters()
const show = computed(() => !!getBlank.value)
</script>

<template>
    <Blank v-if="show" />
</template>
