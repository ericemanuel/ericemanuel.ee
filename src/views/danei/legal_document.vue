<template>
  <main class="danei-legal-stages">
    <stage
      v-for="(item, index) in stages"
      :key="`${documentKey}-${index}`"
      :label="item.label"
      :title="item.title"
      :paragraph="item.paragraph"
    />
  </main>
</template>

<script>
import stage from '@/components/stage.vue';

export default {
  name: 'DaneiLegalDocument',
  components: { stage },
  props: {
    documentKey: {
      type: String,
      required: true,
      validator: (value) => ['privacy', 'terms', 'deleteAccount'].includes(value),
    },
  },
  computed: {
    locale() {
      return this.$i18n.messages[this.$i18n.locale];
    },
    stages() {
      const document = this.locale && this.locale[this.documentKey];
      return document && Array.isArray(document.stages) ? document.stages : [];
    },
  },
};
</script>

<!-- Unscoped, but restricted to legal pages: the stage descendants are child components. -->
<style>
.danei-legal-stages > article {
  margin-bottom: 40px;
}

@media only screen and (min-width: 900px) {
  /* Fix the complete row rather than the title alone. The shared stage's
     centered flex layout otherwise shifts both columns when titles are short. */
  .danei-legal-stages > article > .container {
    display: grid;
    grid-template-columns: 324px 512px;
    column-gap: 64px;
    justify-content: start;
    width: 900px;
    max-width: 100%;
  }
}
</style>
