<script setup>
import { ref, onErrorCaptured } from 'vue'
import router from './router/index.js'
import { mapActions, mapGetters } from './store/helpers.js'
import Loading from './components/Loading.vue'

const { checkAuth } = mapActions()
checkAuth()

const { getLoading } = mapGetters()

const error = ref(null)

onErrorCaptured(() => {
    error.value = 'Ой-йо-йой!!! Щось пішло не так...'
})

router.beforeEach((to, from, next) => {
    if (to.name !== 'Auth' && !localStorage.getItem('token')) {
        next({
            path: 'auth',
            replace: true,
        })
    }

    if (to.name === 'Auth' && localStorage.getItem('token')) {
        next({
            path: '/',
            replace: true,
        })
    }

    next()
})
</script>

<template>
    <Loading v-if="getLoading" />

    <notifications/>

    <div v-if="error" class="flex h-screen w-full items-center justify-center">
        <span class="text-center text-2xl font-bold text-opposite">
            {{ error }}
        </span>
    </div>

    <router-view></router-view>
</template>

<style>
/* reset autofill for input */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
    -webkit-box-shadow: inset 0 0 0 1000px #1e293b !important; /* Цвет фона */
    -webkit-text-fill-color: #528d36 !important; /* цвет текста */
    transition: background-color 600000s 0s, color 600000s 0s;
}

/* Removing arrows for the input number */
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

/* Firefox */
input[type='number'] {
    -moz-appearance: textfield;
}

.v-enter-active,
.v-leave-active {
    transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>
