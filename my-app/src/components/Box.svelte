<script>
	export let showPanel;

	function closeBox() {
		showPanel = false;
	}
</script>

<div class="box">
	<slot />
</div>

<style>
	.box {
		position: absolute;
		bottom: 0;
		left: 1%;
		width: 750px;
		height: 300px;
		border: 1px solid #aaa;
		border-radius: 2px;
		z-index: 3;
		background-color: rgba(255, 255, 255, 0.8);
		box-shadow: 2px 2px 8px rgba(255, 255, 255, 1);
		padding: 1em;
		margin: 0 0 1em 0;
	}
	.close-button {
		margin: 0;
		border: 0;
		padding: 0;
		background: hsl(216, 100, 50);
		width: 10px;
		height: 10px;
		display: flex;
		flex-flow: column nowrap;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		transition: all 150ms;
		position: absolute;
		right: 1rem;
		top: 1rem;
	}
</style>
