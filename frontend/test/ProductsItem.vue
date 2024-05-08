<template>
    <div
        class="product"
        :class="generateClasses()"
    >
        <div class="product__name">{{ product.name }}</div>
        <div class="product__category">{{ product.category }}</div>
        <div class="product__specials">{{ product.specials }}</div>
        <div class="product__description">{{ product.description }}</div>
        <div class="product__count">{{ product.count }}</div>
        <div class="product__price">
            <div v-if="product.hasDiscount">
                <span style="text-decoration: line-through">{{ product.price }}</span>
                <span>{{ product.price * (product.discount / 100) }} руб</span>
            </div>
            
            <div v-else>{{ product.price }} руб.</div>
        </div>
        <div
            class="product__edit"
            @click="emit('edit')"
        >E
        </div>
        <div
            class="product__close"
            @click="emit('delete')"
        >X
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    product:      { type: Object, default: () => ({}) },
    productIndex: { type: Number, default: null },
    isEdit:       { type: Boolean, default: false },
});

const emit = defineEmits([ 'edit', 'delete' ]);

function generateClasses() {
    // return ' sd asd ';
    
    const classes = {
        'product--edit': props.isEdit,
        // 'product--delete': false,
        // 'product--new': false,
    };
    
    return classes;
}
</script>

<style scoped>

</style>
