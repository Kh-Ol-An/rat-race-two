<script setup>
import InfoField from '../../plugins/InfoField.vue'
import SellIcon from '../../../assets/images/icons/SellIcon.vue'
import { addingSpaces } from '../../../helpers/formating-values.js'

const props = defineProps({
    id: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    label: {
        type: String,
        required: true,
    },
})

const emit = defineEmits(['sell'])

const sell = () => emit('sell', props.id)
</script>

<template>
    <li class="relative flex items-center gap-2 pr-12">
        <InfoField
            wrap-classes="gap-2"
            label-classes="text-primary"
            :label="label"
        >
            <span class="text-slate-400">
                {{ addingSpaces(price) }}
            </span>
        </InfoField>

        <button
            class="absolute top-1/2 right-0 -translate-y-1/2 px-2 outline-0"
            type="button"
            title="Продати"
            @click="sell"
        >
            <SellIcon color="fill-primary" />
        </button>
    </li>
</template>
