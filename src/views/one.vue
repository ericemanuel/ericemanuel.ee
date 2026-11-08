<template>
  <hero
    :illustration="hero.illustration"
    :alt="hero.alt"
    :title="hero.title"
    :description="hero.description"
  />

  <info :labels="labels" :items="items" />

  <figma
    :link="'https://embed.figma.com/design/BW56QcIaRNaVtIHHLr97Kz/One?node-id=5255-4529&embed-host=share&hide-ui=1'"
  />

  <stage
    :label="labels[4]"
    :title="stages[0].title"
    :paragraph="stages[0].paragraph"
  />

  <gallery :project="'one'" :indexes="[1, 2, 3]" />

  <stage
    :label="labels[5]"
    :title="stages[1].title"
    :paragraph="stages[1].paragraph"
  />

  <gallery :project="'one'" :indexes="[4]" />

  <highlight :highlight="highlight" />

  <gallery :project="'one'" :indexes="[5, 6, 7]" />

  <stage
    :label="labels[6]"
    :title="stages[2].title"
    :paragraph="stages[2].paragraph"
  />

  <gallery :project="'one'" :indexes="[8]" :animation="true" />

  <others :projects="['Sesc Go', 'Soul']" :labels="labels" />
</template>

<script>
import animation from '@/components/animation.vue';
import hero from '@/components/hero.vue';
import info from '@/components/info.vue';
import figma from '../components/figma.vue';
import player from '../components/player.vue';
import stage from '@/components/stage.vue';
import gallery from '@/components/gallery.vue';
import highlight from '@/components/highlight.vue';
import others from '@/components/others.vue';

export default {
  name: 'one',
  components: {
    animation,
    hero,
    info,
    figma,
    player,
    stage,
    gallery,
    highlight,
    others,
  },

  // prettier-ignore
  computed: {
    locale()   { return this.$i18n.messages[this.$i18n.locale]; },
    
    hero()      { return this.locale.one.hero; },
    labels()    { return this.locale.labels; },
    items()     { return this.locale.one.items; },
    stages()    { return this.locale.one.stages; },
    highlight() { return this.locale.one.highlight; },
    links()     { return this.locale.one.links; },
    titles()    { return this.locale.one.titles; }
  },
};
</script>
