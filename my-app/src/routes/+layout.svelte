<script>
  import "../app.css";
  import { Modals, closeModal } from "svelte-modals";
</script>

<nav class="flex min-h-[50px] items-center bg-white">
  <div class='w-1/5 flex'>
  </div>
  <div class="flex flex-grow items-center justify-center">
    <h1 class="text-2xl font-bold font-default text-center">
      Employment Vulnerability to the Energy Transition (E-VET) tool
    </h1>
  </div>
  <div class='w-1/5 flex justify-end'>
    <img src="MIT-CEEPR-logo-clr-for-light-background.png" alt='ceepr_logo' class='h-10 max-h-full max-w-full w-auto object-contain'/>
  </div>
</nav>



<slot />
<div class='absolute left-1 bottom-1 w-50 rounded bg-gray-100 bg-opacity-10'>
  <p class='text-[8px] font-default'>
    Data: 2023, Graham & Knittel, MIT Center for Energy & Environmental Policy Research.<br>
    Tool developed by Kailin Graham, Serena Patel and Paul Sizaire.
  </p>
</div>

<style>

</style>
