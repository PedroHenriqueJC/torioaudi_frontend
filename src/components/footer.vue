<template>
  <footer class="app-footer">
    <div class="footer-inner">
      <div class="brand">TorioAudi</div>
      <div class="copyright">© {{ year }} TorioAudi</div>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
const year = new Date().getFullYear()
</script>

<style scoped>
.app-footer {
  width: 100%;
  background: #121212;
  height: 100%;
  color: #fff;
  padding: 20px 20px;
  /* Stay in document flow so user scrolls to it */
  position: static;
  box-shadow: 0 -2px 8px rgba(0,0,0,0.05);
}
.footer-inner {
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 10px;
}
.brand {
  font-weight: 700;
}

.copyright { font-size: 0.9rem; color: rgba(255,255,255,0.85); }

/* Make sure content above footer has space */
@media (max-width: 600px) {
  .footer-inner { flex-direction: column; gap: 6px; }
}
</style>
