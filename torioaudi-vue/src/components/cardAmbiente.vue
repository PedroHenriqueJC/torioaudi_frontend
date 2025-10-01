<template>
  <div class="card">
    <h3>{{ titulo }}</h3>
    <p>{{ descricao }}</p>
  </div>
</template>

<script>
export default {
  name: "CardAmbiente",
  props: {
    titulo: String,
    descricao: String,
  },
};
</script>

<style scoped>
.card {
  background: rgb(5, 5, 5);
  border-radius: 8px;
  padding: 1.5rem;
  width: 250px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  text-align: center;
}
h3 {
  margin-bottom: 0.5rem;
}
.btn {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.6rem 1.2rem;
  background: #4caf50;
  color: white;
  border-radius: 6px;
  text-decoration: none;
}
.btn:hover {
  background: #43a047;
}
</style>
