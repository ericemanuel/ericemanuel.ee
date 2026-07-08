<template>
	<main>
		<stage
			v-for="item in support.stages"
			:label="item.label"
			:title="item.title"
			:paragraph="item.paragraph"
		/>
	</main>
</template>

<script>
import stage from '@/components/stage.vue';

export default {
	name: 'support',

	components: {
		stage,
	},

	computed: {
		locale() { return this.$i18n.messages[this.$i18n.locale]; },
		support() { return this.locale.support; },
	},
};
</script>

<style scoped>
article {
	margin-bottom: 40px;
}
</style>