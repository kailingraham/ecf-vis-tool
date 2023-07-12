<script>
  import "../app.css";
  import { Modals, closeModal } from "svelte-modals";
</script>

<nav class="navbar">
  <h1 class="text-2xl font-bold font-default text-center">
    Employment Vulnerability to the Energy Transition (E-VET) tool
  </h1>
  <Image src='../../static/MIT-CEEPR-logo-clr-for-light-background.png'/>
</nav>

<slot />

<Modals>
  <div slot="backdrop" class="backdrop" on:click={closeModal} />
</Modals>

<style>
  .navbar {
    display: flex;
    align-items: center;
    justify-content: center; /* Center horizontally */
    height: 50px;
    background-color: white;
  }

  .title {
    font-weight: bold;
    font-family: "Cardo", serif;
  }

  .backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
  }
</style>
