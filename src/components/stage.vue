<template>
  <article>
    <div class="container">
      <div>
        <span><em v-html="label"></em></span>
        <h2 v-html="title"></h2>
      </div>
      <p v-html="paragraph"></p>
    </div>
  </article>
</template>

<script>
export default {
  name: 'stage',
  props: ['label', 'title', 'paragraph'],
};
</script>

<style scoped lang="scss">
// prettier-ignore
.container {
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;

  div {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  h2 { @include kilo; }
  span,
  p  { @include micro; }

  :deep(a) {
    color: inherit;
    overflow-wrap: anywhere;
    text-decoration: underline;
  }
}

@media only screen and (min-width: 900px) {
  // prettier-ignore
  .container {
    flex-direction: row;
    gap: 64px;

    p {
      flex-shrink: 0;
      padding-top: 32px;
      width: 512px;
    }

    h2   { @include mega; }
    span,
    p    { @include base; }
  }
}
</style>