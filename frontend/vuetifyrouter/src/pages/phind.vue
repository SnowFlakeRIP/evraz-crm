<template>
    <v-data-table
       :items="items"

    >
   
    </v-data-table>
    <h1>asdasd</h1>
   </template>
   
   <script>
   export default {
    data: () => ({
       search: '',
       headers: [
         { text: 'Имя', value: 'name' },
         { text: 'Email', value: 'email' },
         { text: 'Дата регистрации', value: 'registrationDate' },
       ],
       items: [
         { name: 'Иван Иванов', email: 'ivanov@example.com', registrationDate: '2024-04-15' },
         { name: 'Петр Петров', email: 'petrov@example.com', registrationDate: '2024-04-14' },
         // Добавьте больше элементов по мере необходимости
       ],
    }),
    methods: {
       save() {
         // Логика сохранения изменений
       },
    },
   };
   </script>