<script setup>
import { ref, toRef } from 'vue'
import Input from '../plugins/Input.vue'
import ActionAdd from '../plugins/ActionAdd.vue'
import Modal from '../plugins/Modal.vue'
import { removingSpaces } from '../../helpers/formating-values.js'
import { DEPUTY_PRICE } from '../../database/variables.js'

const props = defineProps({
    blankProp: {
        type: Object,
        required: true,
    },
})

const blank = toRef(props, 'blankProp')

const emit = defineEmits(['buy', 'add'])

const showModal = ref(false)
const modalText = ref('')
const showDeputiesPrice = ref(true)

const potentialDeputies = ref('')
const buy = () => {
    const deputiesCost =
        Number(removingSpaces(potentialDeputies.value)) * DEPUTY_PRICE
    if (blank.value.cash < deputiesCost) {
        modalText.value =
            'Депутати із тобою безкоштовно вітатися не будуть, а ти збираєшся з ними домовлятися без грошей...'
        showModal.value = true
        return (potentialDeputies.value = '')
    }

    emit('buy', deputiesCost)
    showDeputiesPrice.value = false
}

const gainedDeputies = ref('')
const add = () => {
    if (
        Number(removingSpaces(gainedDeputies.value)) >
        Number(removingSpaces(potentialDeputies.value))
    ) {
        modalText.value =
            'Так не гарно... У кишеню збираєшся покласти більше, ніж купив.'
        showModal.value = true
        return (gainedDeputies.value = '')
    }

    emit('add', Number(removingSpaces(gainedDeputies.value)))
    potentialDeputies.value = ''
    gainedDeputies.value = ''
    showDeputiesPrice.value = true
}

const placeholder = '"Чесні" депутати'
</script>

<template>
    <h2 class="px-4 text-center text-xl font-bold text-primary">Депутати</h2>

    <div v-if="showDeputiesPrice" class="mt-2 flex items-center gap-3">
        <Input
            id="potential-deputies"
            v-model:value="potentialDeputies"
            placeholder="Потенційні депутати"
        />
        <ActionAdd :first-value="potentialDeputies" @add="buy" />
    </div>
    <div v-else class="mt-2 flex items-center gap-3">
        <Input
            id="gained-deputies"
            v-model:value="gainedDeputies"
            :placeholder="placeholder"
        />
        <ActionAdd :first-value="gainedDeputies" @add="add" />
    </div>

    <Modal :show="showModal" cancel="Зрозумів" @cancel="showModal = false">
        <h4 class="mx-auto text-center text-2xl font-bold text-opposite">
            Це не можливо!
        </h4>
        <p class="mx-auto mt-4 text-center text-lg font-normal text-slate-400">
            {{ modalText }}
        </p>
    </Modal>
</template>
