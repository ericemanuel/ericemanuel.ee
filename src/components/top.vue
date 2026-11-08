<template>
  <nav>
    <div class="container">
      <router-link to="/">
        <img src="@/assets/vectors/logos/ericemanuel.svg" alt="Eric Emanuel" />
      </router-link>

      <ul
        :class="{
          en: currentLanguage == 'en',
          pt: currentLanguage == 'pt',
          es: currentLanguage == 'es',
        }"
      >
        <li
          v-for="language in languages"
          :key="language"
          :class="{ active: currentLanguage == language }"
          @click="analyze(language)"
        >
          {{ language }}
        </li>

        <div class="circle"></div>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'top',

  data() {
    return {
      languages: ['en', 'pt', 'es'],
      currentLanguage: this.$i18n.locale,
    };
  },

  methods: {
    analyze(clickedLanguage) {
      if (this.currentLanguage == clickedLanguage) {
        if (window.innerWidth < 900) {
          const currentIndex = this.languages.indexOf(this.currentLanguage);
          const nextIndex = (currentIndex + 1) % this.languages.length;
          const nextLanguage = this.languages[nextIndex];
          this.changeTo(nextLanguage);
        }
      } else {
        this.changeTo(clickedLanguage);
      }
    },

    changeTo(language) {
      this.$i18n.locale = language;
      this.currentLanguage = language;
      localStorage.setItem('savedLanguage', language);
    },
  },

  mounted() {
    const savedLanguage = localStorage.getItem('savedLanguage');

    if (savedLanguage && savedLanguage !== this.currentLanguage) {
      this.changeTo(savedLanguage);
    }
  },
};
</script>

<style scoped lang="scss">
.container {
  justify-content: space-between;

  img {
    width: 160px;
  }

  ul {
    --language-size: 24px;
    --language-gap: 4px;
    --language-step: calc(var(--language-size) + var(--language-gap));

    position: relative;
    isolation: isolate;

    li {
      position: relative;
      z-index: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      flex: 0 0 var(--language-size);
      box-sizing: border-box;
      width: var(--language-size);
      height: var(--language-size);
      padding: 0;
      font-style: italic;
      text-align: center;
      cursor: pointer;
      transition: color 0.6s ease-in-out;
      @include micro;

      &.active {
        color: $navy;
      }

      &:not(.active) {
        display: none;
      }
    }

    .circle {
      position: absolute;
      z-index: 0;
      /* Center the circle on the visible Eina italic glyphs, not the line box. */
      top: calc(50% + 3px);
      left: 0;
      width: var(--language-size);
      height: var(--language-size);
      transform: translateY(-50%);
      border-radius: 50%;
      background-color: $white;
      pointer-events: none;
      transition: left 0.6s ease-in-out;
    }
  }
}

@media only screen and (min-width: 900px) {
  .container {
    img {
      width: 200px;
    }

    ul {
      display: flex;
      gap: var(--language-gap);

      li {
        @include mili;

        &:not(.active) {
          display: flex;
        }
      }

      &.en .circle { left: 0; }
      &.pt .circle { left: var(--language-step); }
      &.es .circle { left: calc(var(--language-step) * 2); }
    }
  }
}
</style>
