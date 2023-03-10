<script setup>
import { reactive, ref, computed, watch } from 'vue'
import { notify } from '@kyvg/vue3-notification'
import { mapActions } from '../store/helpers.js'
import BlankIdentification from './modules/BlankIdentification.vue'
import TransactionAction from './modules/TransactionAction.vue'
import InfoField from './plugins/InfoField.vue'
import ExpenseInfo from './modules/ExpenseInfo.vue'
import CostList from './modules/CostList.vue'
import LuxuryItems from './modules/LuxuryItems/LuxuryItems.vue'
import WhimsAndFancies from './modules/WhimsAndFancies.vue'
import FamilyStatus from './modules/FamilyStatus/FamilyStatus.vue'
import CreditList from './modules/Credits/CreditList.vue'
import IncomeInfo from './modules/IncomeInfo.vue'
import IncomeList from './modules/Incomes/IncomeList.vue'
import SharesList from './modules/Shares/SharesList.vue'
import AssetList from './modules/Assets/AssetList.vue'
import DeputiesAction from './modules/DeputiesAction.vue'
import BlankActions from './modules/BlankActions.vue'
import Modal from './plugins/Modal.vue'
import MoneyIcon from '../assets/images/icons/MoneyIcon.vue'
import { addingSpaces } from '../helpers/formating-values.js'
import {
    INITIAL_BLANK,
    TAX,
    APARTMENT_EXPENSES,
    CAR_EXPENSES,
    COTTAGE_EXPENSES,
    YACHT_EXPENSES,
    PLANE_EXPENSES,
    MAX_DEBT,
    WEDDING_COST,
    CHILD_EXPENSES,
    CHILD_ALLOWANCE,
    MAX_HISTORY,
    RICH_CASH,
    RICH_CASH_FLOW,
} from '../database/variables.js'

const props = defineProps({
    downloadedBlank: {
        type: Object,
        required: true,
    }
})

const { updateBlank } = mapActions()

const blank = reactive(props.downloadedBlank)

const addGender = (gender) => (blank.gender = gender)
const addProfession = (profession) => (blank.profession = profession)

const decrement = (transaction) => {
    if (blank.cash < transaction) {
        blank.debt += transaction - blank.cash
        return (blank.cash = 0)
    }

    return (blank.cash -= transaction)
}
const tax = () => (blank.cash -= Math.round(blank.cash * TAX))
const increment = (transaction) => (blank.cash += transaction)

// PASSIVE
const expenses = computed(() => {
    let sum = 0
    sum += blank.rent
    sum += blank.food
    sum += blank.clothes
    sum += blank.fare
    sum += blank.phone
    sum += blank.apartments.length * APARTMENT_EXPENSES
    sum += blank.cars.length * CAR_EXPENSES
    sum += blank.cottages.length * COTTAGE_EXPENSES
    sum += blank.yachts.length * YACHT_EXPENSES
    sum += blank.planes.length * PLANE_EXPENSES
    sum += blank.children.expense
    blank.credits.map((credit) => (sum += credit.payment))
    return sum
})

const showModalRepay = ref(false)
const modalRepayTitle = ref('')
const modalRepayText = ref('')
const repayDebt = (debt) => {
    if (debt > blank.debt) {
        modalRepayTitle.value = '????????????...'
        modalRepayText.value =
            '???????????? ?????? ???????? ???????????? ???????????? ???????? ?????????????????????? ?????????????????? ?????????? ?????? ????????. ?????? ???????????? ???? ??????????.'
        return (showModalRepay.value = true)
    }
    if (debt > blank.cash) {
        modalRepayTitle.value = '????-????-????...'
        modalRepayText.value =
            '???? ?????????? ???????????????? ?????????????? ????????????. ???????????? ?????????? ????????????????????.'
        return (showModalRepay.value = true)
    }
    blank.debt -= debt
    blank.cash -= debt
}
const showModalDebt = computed(() => blank.debt > MAX_DEBT)

// ??????????????
const addRent = (rent) => (blank.rent = rent)
const addFood = (food) => (blank.food = food)
const addClothes = (clothes) => (blank.clothes = clothes)
const addFare = (fare) => (blank.fare = fare)
const addPhone = (phone) => (blank.phone = phone)

// ??????????????????
const savedRent = ref(0)
const buyApartment = (id, name, price) => {
    blank.apartments.push({ id, name, price })
    blank.cash -= price

    if (blank.apartments.length === 0) {
        blank.rent = savedRent.value
        savedRent.value = 0
    }
    if (blank.apartments.length > 0 && blank.rent > 0) {
        savedRent.value = blank.rent
        blank.rent = 0
    }
}
const creditApartment = (id, name, payment, term) => {
    blank.credits.push({
        id,
        name: name.length > 0 ? name : '????????????',
        body: payment * term,
        payment,
        term,
    })
    blank.apartments.push({ id, name, price: payment * term })

    if (blank.apartments.length === 0) {
        blank.rent = savedRent.value
        savedRent.value = 0
    }
    if (blank.apartments.length > 0 && blank.rent > 0) {
        savedRent.value = blank.rent
        blank.rent = 0
    }
}
const sellApartment = (id) => {
    const apartment = blank.apartments.find((apartment) => apartment.id === id)
    blank.cash += Math.floor(apartment.price / 2)
    blank.apartments = blank.apartments.filter(
        (apartment) => apartment.id !== id
    )

    if (blank.apartments.length === 0) {
        blank.rent = savedRent.value
        savedRent.value = 0
    }
    if (blank.apartments.length > 0 && blank.rent > 0) {
        savedRent.value = blank.rent
        blank.rent = 0
    }
}
const savedFare = ref(0)
const buyCar = (id, name, price) => {
    blank.cars.push({ id, name, price })
    blank.cash -= price

    if (blank.cars.length === 0) {
        blank.fare = savedFare.value
        savedFare.value = 0
    }
    if (blank.cars.length > 0 && blank.fare > 0) {
        savedFare.value = blank.fare
        blank.fare = 0
    }
}
const creditCar = (id, name, payment, term) => {
    blank.credits.push({
        id,
        name: name.length > 0 ? name : '????????????',
        body: payment * term,
        payment,
        term,
    })
    blank.cars.push({ id, name, price: payment * term })

    if (blank.cars.length === 0) {
        blank.fare = savedFare.value
        savedFare.value = 0
    }
    if (blank.cars.length > 0 && blank.fare > 0) {
        savedFare.value = blank.fare
        blank.fare = 0
    }
}
const sellCar = (id) => {
    const cars = blank.cars.find((car) => car.id === id)
    blank.cash += Math.floor(cars.price / 2)
    blank.cars = blank.cars.filter((car) => car.id !== id)

    if (blank.cars.length === 0) {
        blank.fare = savedFare.value
        savedFare.value = 0
    }
    if (blank.cars.length > 0 && blank.fare > 0) {
        savedFare.value = blank.fare
        blank.fare = 0
    }
}
const buyCottage = (id, name, price) => {
    blank.cottages.push({ id, name, price })
    blank.cash -= price
}
const sellCottage = (id) => {
    const cottage = blank.cottages.find((cottage) => cottage.id === id)
    blank.cash += Math.floor(cottage.price / 2)
    blank.cottages = blank.cottages.filter((cottage) => cottage.id !== id)
}
const buyYacht = (id, name, price) => {
    blank.yachts.push({ id, name, price })
    blank.cash -= price
}
const sellYacht = (id) => {
    const yacht = blank.yachts.find((yacht) => yacht.id === id)
    blank.cash += Math.floor(yacht.price / 2)
    blank.yachts = blank.yachts.filter((yacht) => yacht.id !== id)
}
const buyPlane = (id, name, price) => {
    blank.planes.push({ id, name, price })
    blank.cash -= price
}
const sellPlane = (id) => {
    const plane = blank.planes.find((plane) => plane.id === id)
    blank.cash += Math.floor(plane.price / 2)
    blank.planes = blank.planes.filter((plane) => plane.id !== id)
}

// ?????????????? ???? ????????????
const buyWhimsAndFancies = (id, name, price) => {
    blank.whimsAndFancies.push({ id, name, price })
    blank.cash -= price
}

// ???????????????? ????????
const changeMarriage = (checked) => {
    if (checked) {
        blank.gender === 'male' && decrement(WEDDING_COST)
        blank.gender === 'female' && (blank.children.expense = 0)
    } else {
        if (blank.gender === 'male') {
            blank.cash = Math.round(blank.cash / 2)
            blank.children.count = 0
            blank.children.expense = 0
        }
        blank.gender === 'female' &&
        (blank.children.expense = blank.children.count * CHILD_EXPENSES)
    }

    blank.marriage = checked
}
const haveBaby = () => {
    blank.children.count += 1
    blank.gender === 'male' &&
    (blank.children.expense = blank.children.count * CHILD_EXPENSES)
    blank.gender === 'female' &&
    !blank.marriage &&
    (blank.children.expense = blank.children.count * CHILD_EXPENSES)
    blank.cash += CHILD_ALLOWANCE
}

// ACTIVE
const passiveIncome = computed(() => {
    let sum = 0
    blank.business.small.map((business) => (sum += business.income))
    blank.business.middle.map((business) => (sum += business.income))
    blank.business.big.map((business) => (sum += business.income))
    blank.business.corrupt.map((business) => (sum += business.income))
    return sum
})
const income = computed(() => blank.salary + passiveIncome.value)

const cashFlow = computed(() => {
    return income.value - expenses.value
})
const firedSalary = ref(0)
const getCashFlow = () => {
    const result = blank.cash + cashFlow.value

    if (firedSalary.value > 0) {
        blank.salary = firedSalary.value
        firedSalary.value = 0
    }

    if (result < 0) {
        blank.debt += Math.abs(result) // Math.abs(??????????) ???????????????????? ?????????????????? ?????????? ???? ??????????????????
        return (blank.cash = 0)
    }

    blank.credits = blank.credits.map((credit) => ({
        ...credit,
        body: credit.body - credit.payment,
        term: (credit.term -= 1),
    }))
    blank.credits = blank.credits.filter((credit) => credit.term > 0)

    return (blank.cash = result)
}

// ????????????????
const addSalary = (salary) => (blank.salary = salary)
const fired = () => {
    firedSalary.value = blank.salary
    blank.salary = 0
}
const quitSalary = ref(0)
const quit = () => {
    if (blank.salary > 0) {
        quitSalary.value = blank.salary
    }

    if (firedSalary.value > 0) {
        quitSalary.value = firedSalary.value
        firedSalary.value = 0
    }
    blank.salary = 0
}
const buyBusiness = (id, price, income, subType, deputies) => {
    blank.business[subType].push({ id, price, income })
    blank.cash -= price
    blank.deputies -= deputies
    blank.business.last.push(id)
}
const incrementIncomeBusiness = (id, income) =>
    blank.business.small.find((business) => {
        if (business.id === id) {
            business.expanded = true
            business.income += income
        }
    })
const deleteBusiness = (subType, id) => {
    const removableIndex = blank.business[subType].findIndex(
        (business) => business.id === id
    )
    removableIndex !== -1 && blank.business[subType].splice(removableIndex, 1)
    blank.business.last.pop()

    quitSalary.value > 0 &&
    income.value === 0 &&
    (blank.salary = quitSalary.value)
}
const sellBusiness = (subType) => {
    blank.cash = blank.business[subType].reduce(
        (total, business) => (total += business.price),
        blank.cash
    )
    blank.business[subType] = []
}
const oneTimeIncome = (income, deputies) => {
    increment(income)
    blank.deputies -= deputies
}

// ??????????
const buyShares = (id, price, quantity, subType) => {
    const cost = price * quantity
    blank.shares[subType].push({ id, price, quantity, cost })
    blank.cash -= cost
}
const sellSharesPackage = (id, subType, price) => {
    increment(price)
    blank.shares[subType] = blank.shares[subType].filter(
        (share) => share.id !== id
    )
}
const sellAllShares = (subType, price) => {
    increment(price)
    blank.shares[subType] = []
}

// ????????????
const buyHouse = (id, price) => {
    blank.assets.houses.push({ id, price })
    blank.cash -= price
}
const sellHouse = (price, id) => {
    increment(price)
    blank.assets.houses = blank.assets.houses.filter((house) => house.id !== id)
}
const sellHouses = (price) => {
    increment(blank.assets.houses.length * price)
    blank.assets.houses = []
}
const buyLand = (id, price, quantity) => {
    const cost = price * quantity
    blank.assets.land.push({ id, price, quantity, cost })
    blank.cash -= cost
}
const sellLand = (id, price) => {
    increment(price)
    blank.assets.land = blank.assets.land.filter((land) => land.id !== id)
}
const sellAcres = (price) => {
    increment(price)
    blank.assets.land = []
}
const buyCorruptLand = (id, quantity, cost, deputies) => {
    const price = cost / quantity
    blank.assets.corruptLand.push({ id, price, quantity, cost })
    blank.cash -= cost
    blank.deputies -= deputies
}
const sellCorruptLand = (id, price) => {
    increment(price)
    blank.assets.corruptLand = blank.assets.corruptLand.filter(
        (land) => land.id !== id
    )
}
const sellCorruptAcres = (price) => {
    increment(price)
    blank.assets.corruptLand = []
}

// ????????????????
const buyDeputies = (cost) => {
    blank.cash -= cost
}
const addDeputies = (quantity) => {
    blank.deputies += quantity
}

const restart = async () => {
    const updated = await updateBlank({
        ...INITIAL_BLANK,
        ...{
            userUid: blank.userUid,
            blankName: blank.blankName,
            createdAt: new Date(),
        }
    })
    updated
        ? location.reload()
        : notify({
            type: 'error',
            title: '????????????????????????????????',
            text: '???????????? ???????????????? ???? ??????????????. ?????????????? ??????????????.',
        })
}

const historyBlank = reactive([])
const historyPeriod = ref(-1)
const makeHistory = ref(true)
const historyTransition = () => {
    makeHistory.value = false
    for (const [key] of Object.entries(blank)) {
        blank[key] = historyBlank[historyPeriod.value][key]
    }
}
const historyBack = () => {
    historyPeriod.value -= 1
    historyTransition()
}
const historyForward = () => {
    historyPeriod.value += 1
    historyTransition()
}

watch(blank, () => {
    if (makeHistory.value) {
        historyBlank.splice(historyPeriod.value + 1, MAX_HISTORY)
        historyBlank.push(JSON.parse(JSON.stringify(blank)))
        historyBlank.length > MAX_HISTORY && historyBlank.shift()
        historyPeriod.value = historyBlank.length - 1
    }
    updateBlank(blank)
    makeHistory.value = true
})

const showModalRich = computed(
    () =>
        blank.cash >= RICH_CASH &&
        cashFlow.value >= RICH_CASH_FLOW &&
        blank.debt === 0 &&
        blank.apartments.length > 0 &&
        blank.cars.length > 0 &&
        !blank.rich
)
const showModalWin = computed(
    () =>
        blank.cottages.length > 0 &&
        blank.yachts.length > 0 &&
        blank.planes.length > 0 &&
        blank.whimsAndFancies.length > 0 &&
        !blank.win
)

const showTestMessage = ref(true)
setTimeout(() => showTestMessage.value = false, 1000 * 10)
</script>

<template>
    <div
        class="flex max-w-full flex-col items-center justify-center px-8 pt-4 pb-8 md:w-screen md:py-2 md:px-0"
    >
        <p
            :class="[
                'max-h-0 max-w-5xl overflow-hidden px-4 text-center text-xs text-slate-400 transition-all duration-1000',
                 showTestMessage && 'max-h-36'
                 ]"
        >
            ???? ?????????????????????? ?? ???????????? ???????????????????? ???????????? ?????????????? ?? ???????????? ????????????, ???????? ???? ???????????????????? ?????? ?????? ????????-?????? ??????????????. ???? ???????????? ???????? ???????????? ???????? ?????????????? ???? ???????????????????? ???? ??????????????:
            <a href="mailto:hroshi.ye@gmail.com" class="font-bold">hroshi.ye@gmail.com</a>
        </p>

        <h1
            class="p-4 text-center text-4xl font-bold text-slate-300 md:p-2 md:text-xl"
        >
            ?????????? '???????????? ???????????????? ???'
        </h1>

        <div
            class="relative flex w-full max-w-5xl flex-col gap-4 rounded-md bg-slate-800 shadow-lg md:mt-2 md:shadow-none"
        >
            <div
                class="grid grid-cols-2 gap-4 px-8 pt-6 md:grid-cols-1 md:gap-2 md:px-2 md:pt-2"
            >
                <BlankIdentification
                    :blank-prop="blank"
                    @add:gender="addGender"
                    @add:profession="addProfession"
                />
            </div>

            <div class="flex items-center gap-4 px-8 md:gap-2 md:px-2">
                <TransactionAction
                    :rich="blank.rich"
                    @decrement="decrement"
                    @tax="tax"
                    @increment="increment"
                />
            </div>

            <InfoField
                wrap-classes="mx-auto px-8 md:px-2 pt-4"
                label-classes="font-bold text-primary"
                label="???????????????? ??????????:"
            >
                <span class="ml-2 font-bold text-slate-300">
                    {{ addingSpaces(cashFlow) }}
                </span>

                <button
                    class="ml-8 outline-0"
                    type="button"
                    title="????????????????"
                    @click="getCashFlow"
                >
                    <MoneyIcon
                        width="40px"
                        height="40px"
                        color="fill-primary"
                    />
                </button>
            </InfoField>

            <div class="grid grid-cols-2 md:grid-cols-1">
                <div class="flex flex-col md:order-last">
                    <!-- ?????????????? -->
                    <div
                        class="flex flex-col gap-2 py-4 pr-4 pl-8 md:bg-slate-900 md:px-2"
                    >
                        <CostList
                            :blank-prop="blank"
                            @add:rent="addRent"
                            @add:food="addFood"
                            @add:clothes="addClothes"
                            @add:fare="addFare"
                            @add:phone="addPhone"
                        />
                    </div>

                    <!-- ?????????????????? -->
                    <div class="flex flex-col gap-2 py-4 pr-4 pl-8 md:px-2">
                        <LuxuryItems
                            :blank-prop="blank"
                            :cash-flow="cashFlow"
                            @buy:apartment="buyApartment"
                            @credit:apartment="creditApartment"
                            @sell:apartment="sellApartment"
                            @buy:car="buyCar"
                            @credit:car="creditCar"
                            @sell:car="sellCar"
                            @buy:cottage="buyCottage"
                            @sell:cottage="sellCottage"
                            @buy:yacht="buyYacht"
                            @sell:yacht="sellYacht"
                            @buy:plane="buyPlane"
                            @sell:plane="sellPlane"
                        />
                    </div>

                    <!-- ?????????????? ???? ???????????? -->
                    <div
                        v-if="blank.rich"
                        class="flex flex-col gap-2 py-4 pr-4 pl-8 md:bg-slate-900 md:px-2"
                    >
                        <WhimsAndFancies
                            :blank-prop="blank"
                            @buy="buyWhimsAndFancies"
                        />
                    </div>

                    <!-- ???????????????? ???????? -->
                    <div
                        v-if="!blank.rich"
                        :class="[
                            'flex flex-col gap-2 pt-4 pr-4 pl-8 md:px-2',
                            blank.credits.length === 0 ? 'pb-8' : 'pb-4',
                        ]"
                    >
                        <FamilyStatus
                            :blank-prop="blank"
                            @change:marriage="changeMarriage"
                            @have:baby="haveBaby"
                        />
                    </div>

                    <!-- ?????????????? ???? ?????????????????? -->
                    <div
                        v-if="blank.credits.length > 0"
                        class="flex flex-col gap-2 pt-4 pr-4 pb-8 pl-8 md:bg-slate-900 md:px-2"
                    >
                        <CreditList :credits="blank.credits" />
                    </div>
                </div>

                <div class="flex flex-col">
                    <!-- ???????????????? ???????????????? -->
                    <div
                        class="flex flex-col gap-2 py-4 pr-8 pl-4 md:px-2 md:pt-0 md:pb-4"
                    >
                        <IncomeInfo
                            :blank="blank"
                            :passive-income="passiveIncome"
                            :income="income"
                            @remove:deputies="blank.deputies = 0"
                        />
                    </div>

                    <!-- ?????????? ???? ?????????????? -->
                    <div
                        class="flex flex-col gap-2 pb-4 pr-8 pl-4 md:px-2 md:py-4"
                    >
                        <ExpenseInfo
                            :debt="blank.debt"
                            :expenses="expenses"
                            @repay="repayDebt"
                        />
                        <Modal
                            :show="showModalRepay"
                            cancel="????????????????"
                            @cancel="showModalRepay = false"
                        >
                            <h4
                                class="mx-auto text-center text-2xl font-bold text-opposite"
                            >
                                {{ modalRepayTitle }}
                            </h4>
                            <p
                                class="mx-auto mt-4 text-center text-lg font-normal text-slate-400"
                            >
                                {{ modalRepayText }}
                            </p>
                        </Modal>
                        <Modal
                            :show="showModalDebt"
                            cancel="????????????????"
                            only-cancel-action
                            @cancel="restart"
                        >
                            <h4
                                class="mx-auto text-center text-2xl font-bold text-opposite"
                            >
                                ???????? ????????????...
                            </h4>
                            <p
                                class="mx-auto mt-4 text-center text-lg font-normal text-slate-400"
                            >
                                ???? ??????????????. ?????? ???? ????????. ???? ????????????????????. ????????
                                ???????? ???????????????? ?? ?????????????? ???????????????? :)
                            </p>
                        </Modal>
                    </div>

                    <!-- ???????????????? -->
                    <div
                        class="flex flex-col gap-2 py-4 pr-8 pl-4 md:bg-slate-900 md:px-2"
                    >
                        <IncomeList
                            :blank-prop="blank"
                            :fired-salary="firedSalary"
                            @add:salary="addSalary"
                            @fired:salary="fired"
                            @quit:salary="quit"
                            @buy:business="buyBusiness"
                            @increment:income="incrementIncomeBusiness"
                            @delete:business="deleteBusiness"
                            @sell="sellBusiness"
                            @one-time:income="oneTimeIncome"
                        />
                    </div>

                    <!-- ?????????? -->
                    <div class="flex flex-col gap-2 py-4 pr-8 pl-4 md:px-2">
                        <SharesList
                            :blank-prop="blank"
                            @buy="buyShares"
                            @sell:package="sellSharesPackage"
                            @sell:all="sellAllShares"
                        />
                    </div>

                    <!-- ???????????? -->
                    <div
                        class="flex flex-col gap-2 py-4 pr-8 pl-4 md:bg-slate-900 md:px-2"
                    >
                        <AssetList
                            :blank-prop="blank"
                            @buy:house="buyHouse"
                            @sell:house="sellHouse"
                            @sell:houses="sellHouses"
                            @buy:land="buyLand"
                            @sell:land="sellLand"
                            @sell:acres="sellAcres"
                            @buy:corrupt-land="buyCorruptLand"
                            @sell:corrupt-land="sellCorruptLand"
                            @sell:corrupt-acres="sellCorruptAcres"
                        />
                    </div>

                    <!-- ???????????????? -->
                    <div
                        v-if="blank.rich"
                        class="flex flex-col gap-2 pt-4 pr-8 pl-4 pb-8 md:px-2"
                    >
                        <DeputiesAction
                            :blank-prop="blank"
                            @buy="buyDeputies"
                            @add="addDeputies"
                        />
                    </div>
                </div>
            </div>

            <div class="md:space-y-2 md:px-2">
                <BlankActions
                    :history-blank="historyBlank"
                    :history-period="historyPeriod"
                    @back="historyBack"
                    @forward="historyForward"
                    @restart="restart"
                />
            </div>
        </div>

        <p class="max-w-5xl mt-4 px-4 text-center text-xs text-slate-400">
            ???? ?????????????????????? ?? ???????????? ???????????????????? ???????????? ?????????????? ?? ???????????? ????????????, ???????? ???? ???????????????????? ?????? ?????? ????????-?????? ??????????????. ???? ???????????? ???????? ???????????? ???????? ?????????????? ???? ???????????????????? ???? ??????????????:
            <a href="mailto:hroshi.ye@gmail.com" class="font-bold">hroshi.ye@gmail.com</a>
        </p>

        <Modal
            :show="showModalRich"
            cancel="????????????????"
            @cancel="blank.rich = true"
        >
            <h4 class="mx-auto text-center text-2xl font-bold text-primary">
                ??????????????!!!
            </h4>
            <p
                class="mx-auto mt-4 text-center text-lg font-normal text-slate-400"
            >
                ??????????????) ???? ??????????????! ???????????????? ???? ???????????????? ????????.
            </p>
        </Modal>

        <Modal
            :show="showModalWin"
            cancel="????????????????"
            @cancel="blank.win = true"
        >
            <h4 class="mx-auto text-center text-2xl font-bold text-primary">
                ??????????????!!!
            </h4>
            <p
                class="mx-auto mt-4 text-center text-lg font-normal text-slate-400"
            >
                ???? ??????????????! ?????? ???????????? ???????????????????????? ??????.
            </p>
        </Modal>
    </div>
</template>
