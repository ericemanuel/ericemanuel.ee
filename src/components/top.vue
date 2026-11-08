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
    position: relative;

    li {
      display: flex;
      justify-content: center;
      align-items: center;
      font-style: italic;
      transition: all 0.8s ease-in-out;

      width: 20px;
      height: 20px;
      padding: 0 0 5px 3px;
      border-radius: 50%;
      background-color: $white;

      cursor: pointer;
      @include micro;

      &.active {
        color: $navy;
      }

      &:not(.active) {
        display: none;
      }
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
      gap: 12px;

      li {
        width: unset;
        height: unset;
        background-color: unset;

        @include mili;

        &:not(.active) {
          display: unset;
        }
      }

      .circle {
        position: absolute;
        z-index: -1;
        top: -2px;
        left: -4px;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background-color: $white;
        transition: all 0.6s ease-in-out;
      }

      // prettier-ignore
      & {
        &.en { .circle { left: -2px; }}
        &.pt { .circle { left: 28px; }}
        &.es { .circle { left: 56px; }}
      }
    }
  }
}
</style>
