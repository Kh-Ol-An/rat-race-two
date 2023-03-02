<script setup>
import { mapGetters } from "../store/helpers.js";
import Blank from '../components/Blank.vue'

const { getBlank } = mapGetters()
</script>

<template>
    <Blank v-if="!!getBlank" :downloaded-blank="getBlank" />

    <div v-else class="flex h-screen w-full items-center justify-center">
        <span class="text-center text-2xl font-bold text-opposite">
            Дані з сервера не завантажені. Спробуй перезавантажити сторінку.
        </span>
    </div>
</template>
