<template>
	<main>
		<stage
			v-for="item in policy.stages"
			:label="item.label"
			:title="item.title"
			:paragraph="item.paragraph"
		/>
	</main>
</template>

<script>
import stage from '@/components/stage.vue';

export default {
	name: 'privacy',

	components: {
		stage,
	},

	computed: {
		locale() { return this.$i18n.messages[this.$i18n.locale]; },
		policy() { return this.locale.privacy; },
	},
};
</script>

<style scoped>
article {
	margin-bottom: 40px;
}
</style>