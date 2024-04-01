<template>
    <div class="row">
        <div>
            <!--<h3>{{ editProductIndex == null ? 'Добавление товара' : 'Редактирование товара' }}</h3>-->
            <h3>{{ getTitleText }}</h3>
            
            <div class="fields">
                <div class="field">
                    <label for="name">Название</label>
                    <input
                        v-model="name"
                        type="text"
                        id="name"
                    >
                </div>
                <div class="field">
                    <label for="category">Категория</label>
                    <select
                        v-model="category"
                        name="category"
                        id="category"
                    >
                        <option
                            v-for="(option, optionIndex) in options"
                            :key="optionIndex"
                        >{{ option }}
                        </option>
                    </select>
                </div>
                <div class="field">
                    <label for="price">Стоимость, руб</label>
                    <input
                        v-model="price"
                        type="number"
                        id="price"
                    >
                </div>
                <div class="field">
                    <label for="count">Количество</label>
                    <input
                        v-model="count"
                        type="number"
                        id="count"
                    >
                </div>
                <div class="field">
                    <div>Есть скидка?</div>
                    <div>
                        <input
                            v-model="hasDiscount"
                            type="radio"
                            id="discount-yes"
                            name="discount"
                            :value="true"
                        >
                        <label for="discount-yes">Да</label>
                        <input
                            v-model="hasDiscount"
                            type="radio"
                            id="discount-no"
                            name="discount"
                            :value="false"
                        >
                        <label for="discount-no">Нет</label>
                    </div>
                </div>
                <div
                    v-if="hasDiscount"
                    class="field"
                >
                    <label for="discount">Скидка, %</label>
                    <input
                        v-model="discount"
                        type="number"
                        id="discount"
                    >
                </div>
                <div class="field">
                    <div>Особенности</div>
                    <div>
                        <input
                            v-model="specials"
                            type="checkbox"
                            id="bu"
                            name="specials"
                            value="Б/У"
                        >
                        <label for="bu">Б/У</label>
                    </div>
                    <div>
                        <input
                            v-model="specials"
                            type="checkbox"
                            name="specials"
                            id="stuff"
                            value="Какая-то хрень"
                        >
                        <label for="stuff">Какая-то хрень</label>
                    </div>
                </div>
                <div class="field">
                    <label for="description">Описание</label>
                    <textarea
                        v-model="description"
                        rows="5"
                        id="description"
                    ></textarea>
                </div>
            </div>
            
            <div>
                <button
                    v-if="editProductIndex == null"
                    @click="addProduct"
                >Добавить товар
                </button>
                
                <button
                    v-else
                    @click="updateProduct"
                >Обновить товар
                </button>
            </div>
        </div>
        
        <ProductsList
            v-model="products"
            :edit-index="editProductIndex"
            @edit-product="editProduct"
        ></ProductsList>
    </div>
</template>

<script setup>
import {
    computed,
    ref,
} from 'vue';
import ProductsList from '@/components/ProductsList.vue';

let name = ref('');
let description = ref('');
let category = ref(null);
let price = ref(null);
let count = ref(null);
let hasDiscount = ref(false);
let discount = ref(null);
let specials = ref([]);

let editProductIndex = ref(null);

let products = ref([
    {
        name:        'Болт',
        description: 'То что ты накрутишь',
        category:    'Строй.материалы',
        price:       10000000,
        count:       1,
        hasDiscount: false,
        discount:    null,
        specials:    [ 'Какая-то хрень' ],
        isEdit:      false,
    },
    {
        name:        'Болт2',
        description: 'То что ты накрутишь',
        category:    'Строй.материалы',
        price:       10000000,
        count:       1,
        hasDiscount: false,
        discount:    null,
        specials:    [ 'Какая-то хрень' ],
        isEdit:      false,
    },
    {
        name:        'Болт3',
        description: 'То что ты накрутишь',
        category:    'Строй.материалы',
        price:       10000000,
        count:       5,
        hasDiscount: true,
        discount:    50,
        specials:    [ 'Б/У', 'Какая-то хрень' ],
        isEdit:      false,
    },
]);

let options = {
    1: 'Продукты',
    2: 'Одежда',
    3: 'Электроника',
    4: 'Инструменты',
    5: 'Строй.материалы',
};

let getTitleText = computed(() => {
    return editProductIndex.value == null ? 'Добавление товара' : 'Редактирование товара';
});

function addProduct() {
    let product = {
        name:        name.value,
        description: description.value,
        category:    category.value,
        price:       price.value,
        count:       count.value,
        hasDiscount: hasDiscount.value,
        discount:    discount.value,
        specials:    specials.value,
    };
    products.value.push(product);
    resetForm();
}

function updateProduct() {
    products.value[editProductIndex.value].name = name.value;
    products.value[editProductIndex.value].description = description.value;
    products.value[editProductIndex.value].category = category.value;
    products.value[editProductIndex.value].price = price.value;
    products.value[editProductIndex.value].count = count.value;
    products.value[editProductIndex.value].hasDiscount = hasDiscount.value;
    products.value[editProductIndex.value].discount = discount.value;
    products.value[editProductIndex.value].specials = specials.value;
    resetForm();
}

function resetForm() {
    editProductIndex.value = null;
    name.value = '';
    description.value = '';
    category.value = '';
    price.value = 0;
    count.value = 0;
    hasDiscount.value = false;
    discount.value = 0;
    specials.value = [];
}

function editProduct(object, index) {
    name.value = object.name;
    description.value = object.description;
    category.value = object.category;
    price.value = object.price;
    count.value = object.count;
    hasDiscount.value = object.hasDiscount;
    discount.value = object.discount;
    specials.value = object.specials;
    
    editProductIndex.value = index;
}
</script>

<style>
.row {
    display: flex;
    gap: 50px;
}

.row > div {
    width: 50%;
}

.product {
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 16px;
    border: 1px solid red;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.15);
    position: relative;
}

.product__name {
    font-size: 24px;
}

.product__description {
    font-style: italic;
}

.product__close {
    position: absolute;
    top: 16px;
    right: 16px;
    cursor: pointer;
}

.product__edit {
    position: absolute;
    top: 16px;
    right: 36px;
    cursor: pointer;
}

.product--edit {
    background-color: rgba(0, 0, 0, 0.2);
}

.field {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
}

.field:last-child {
    margin-bottom: 30px;
}
</style>
