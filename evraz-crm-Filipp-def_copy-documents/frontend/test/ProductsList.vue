<template>
    <div>
        <h3>Список товара</h3>
        <div class="products">
            <ProductsItem
                v-for="(product, productIndex) in modelValue"
                :key="productIndex"
                :product="product"
                :product-index="productIndex"
                :is-edit="editIndex === productIndex"
                @edit="editProduct(product, productIndex)"
                @delete="deleteProduct(productIndex)"
            />
        </div>
    </div>
</template>

<script setup>
import ProductsItem from '@/components/ProductsItem.vue';

const props = defineProps({
    modelValue: { type: Array, default: () => [] },
    editIndex:  { type: Number, default: null },
});

const emit = defineEmits([ 'update:model-value', 'edit-product' ]);

function deleteProduct(index) {
    const newModelValue = [ ...props.modelValue ];
    newModelValue.splice(index, 1);
    emit('update:model-value', newModelValue);
}

function editProduct(product, productIndex) {
    emit('edit-product', product, productIndex);
}
</script>

<style scoped>

</style>
