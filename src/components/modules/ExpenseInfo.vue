<script setup>
import { ref } from 'vue'
import InfoField from '../plugins/InfoField.vue'
import Input from '../plugins/Input.vue'
import ReturnIcon from '../../assets/images/icons/ReturnIcon.vue'
import CheckIcon from '../../assets/images/icons/CheckIcon.vue'
import {
    removingSpaces,
    addingSpaces,
} from '../../helpers/formating-values.js'

defineProps({
    debt: {
        type: Number,
        required: true,
    },
    expenses: {
        type: Number,
        required: true,
    },
})

const emit = defineEmits(['repay'])

const showRepay = ref(false)
const repayDebt = ref('')
const hidRepay = () => {
    showRepay.value = false
    repayDebt.value = ''
}
const repay = () => {
    showRepay.value = false
    emit('repay', Number(removingSpaces(repayDebt.value)))
    repayDebt.value = ''
}
</script>

<template>
    <InfoField label-classes="text-opposite" label="Борги:">
        <span class="ml-2 whitespace-nowrap text-slate-400">
            {{ addingSpaces(debt) }}
        </span>

        <div v-if="showRepay" class="relative ml-6">
            <Input
                id="repay-debt"
                v-model:value="repayDebt"
                placeholder="Повернути борг"
                small-label
            />
            <button
                class="absolute top-1/2 right-3 -translate-y-1/2 rotate-45 text-2xl font-bold text-opposite"
                type="button"
                title="Скасувати"
                @click="hidRepay"
            >
                &#43;
            </button>
        </div>

        <button
            v-if="!showRepay"
            class="ml-4 outline-0"
            type="button"
            title="Повернути борг"
            @click="showRepay = true"
        >
            <ReturnIcon :color="debt > 0 ? 'fill-primary' : 'fill-slate-400'" />
        </button>
        <button
            v-else
            class="ml-4 outline-0"
            :class="[
                'outline-0',
                repayDebt.length === 0 && 'cursor-not-allowed',
            ]"
            type="button"
            :title="`Повернути ${addingSpaces(repayDebt)}`"
            :disabled="repayDebt.length === 0"
            @click="repay"
        >
            <CheckIcon
                :color="
                    repayDebt.length === 0 ? 'fill-slate-400' : 'fill-primary'
                "
            />
        </button>
    </InfoField>

    <InfoField label-classes="text-opposite" label="Загальні витрати:">
        <span class="ml-2 text-slate-400">
            {{ addingSpaces(expenses) }}
        </span>
    </InfoField>
</template>
