<script setup>
import { computed } from 'vue'
import ActionSell from '../../plugins/ActionSell.vue'
import { addingSpaces } from '../../../helpers/formating-values.js'

const props = defineProps({
    blankShare: {
        type: Array,
        required: true,
    },
    subType: {
        type: String,
        required: true,
    },
})

const emit = defineEmits(['sell'])

const cost = computed(() =>
    props.blankShare.reduce((total, share) => (total += share.cost), 0)
)
const quantity = computed(() =>
    props.blankShare.reduce((total, share) => (total += share.quantity), 0)
)
const price = computed(() => {
    const result = cost.value / quantity.value
    if (Number.isInteger(result)) {
        return Math.round(result)
    }

    return `~${Math.round(result)}`
})

const sell = (price) => emit('sell', props.subType, quantity.value * price)
</script>

<template>
    <li
        v-if="blankShare.length > 1"
        class="relative grid grid-cols-12 items-center gap-2 border-t-2 border-slate-700 py-2 pr-12 text-center font-bold"
    >
        <div class="col-span-6 flex items-center justify-center">
            <ActionSell input-id="sell-all-shares" @sell="sell">
                <span class="text-slate-500">
                    {{ addingSpaces(price) }}
                </span>
            </ActionSell>
        </div>

        <span class="col-span-3 text-slate-500">
            {{ addingSpaces(quantity) }}
        </span>

        <span class="col-span-3 text-slate-500">
            {{ addingSpaces(cost) }}
        </span>
    </li>
</template>
