<script>
  import { getContext } from "svelte";

  export let step;
  export let showTutorial;

  let hideGreyBackground = getContext("hideGreyBackground");
  let resetTutorial = getContext("resetTutorial");
  let handleNextStep = getContext("handleNextStep");

  function closeTutorial() {
    showTutorial = false;
  }
</script>

{#if showTutorial}
  {#if step === 0}
    <div
      role="dialog"
      class="modal1 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center z-50"
    >
      <div class="bg-white p-4 font-default rounded-md">
        <h2 class="mb-2 font-bold text-lg text-center">
          Identifying vulnerable communities through employee carbon footprints
        </h2>
        <p class="text-sm mb-2 text-justify">
          The energy transition is disrupting the U.S. economy and workforce,
          placing communities that depend on carbon-intensive industries at risk
          of economic displacement and job losses.
        </p>
        <p class="text-sm mb-2 text-justify">
          This tool, developed by MIT's Center for Energy & Environmental Policy
          Research, allows policymakers, researchers, and communities to
          understand how economic, and specifically employment, impacts of the
          energy transition are likely to be distributed across the United
          States. We measure this by calculating the average carbon emissions
          per employee (the "employee carbon footprint", or ECF) of every U.S.
          county.
        </p>
        <p class="text-sm mb-2 text-justify">
          Click "Start tutorial" to be guided through the features of the tool,
          or "Close" to start exploring.
        </p>
        <div class="flex mx-auto justify-center gap-2">
          <button
            class="bg-blue-500 hover:bg-blue-700 text-white text-sm py-1 px-3 rounded font-default"
            on:click={() => {
              handleNextStep();
              hideGreyBackground();
            }}>Start tutorial</button
          >
          <button
            class="bg-white hover:bg-blue-700 hover:text-white text-blue-700 border border-blue-500 text-sm py-1 px-8 rounded font-default"
            on:click={() => {
              closeTutorial();
              hideGreyBackground();
            }}>Close</button
          >
        </div>
      </div>
    </div>
  {:else if step === 1}
    <div
      class="  bg-white fixed top-[170px] p-3 w-[340px] right-2 z-10 rounded border border-1 border-blue-500"
    >
      <p class="text-sm text-justify font-default mb-2 leading-[18px]">
        The <b>employee carbon footprint</b> (ECF) is a metric that assesses how
        reliant employment in a community is on CO<sub>2</sub>-producing fossil
        fuels, and therefore how exposed these communities are to economic
        shocks in a future without them. Counties in orange have above-average
        ECFs, and those in blue have ECFs below the national average.
      </p>
      <div class="flex mx-auto justify-center gap-2">
        <button
          class=" bg-blue-500 hover:bg-blue-700 text-white font-default text-sm py-1 px-2 rounded"
          on:click={handleNextStep}
          >Next
        </button>
        <button
          class="bg-white hover:bg-blue-700 hover:text-white text-gray-400 border border-gray-400 font-default text-sm py-1 px-2 rounded"
          on:click={resetTutorial}
          >Exit tutorial
        </button>
      </div>
    </div>
  {:else if step === 2}
    <div
      class="bg-white fixed top-20 p-3 w-52 left-60 z-10 rounded border border-1 border-blue-500"
    >
      <p class="text-sm text-justify font-default mb-2 leading-[18px]">
        Use the <b>Search</b> box to focus on specific states and counties.
        Click <b>Reset view</b> to zoom back out.
      </p>
      <div class="flex mx-auto justify-center gap-2">
        <button
          class=" bg-blue-500 hover:bg-blue-700 text-white font-default text-sm py-1 px-2 rounded"
          on:click={handleNextStep}
          >Next
        </button>
        <button
          class="bg-white hover:bg-blue-700 hover:text-white text-gray-400 border border-gray-400 font-default text-sm py-1 px-2 rounded"
          on:click={resetTutorial}
          >Exit tutorial
        </button>
      </div>
    </div>
  {:else if step === 3}
    <div
      class="bg-white fixed top-[280px] p-3 w-60 left-2 z-10 rounded border border-1 border-blue-500"
    >
      <p class="text-sm text-justify font-default mb-2 leading-[18px]">
        The U.S. <b>Inflation Reduction Act</b> (IRA) allocates extra funding to
        designated <b>energy communities</b> across the country. Use the checkbox
        to filter counties by their energy community status, using the toggle to
        switch between counties that contain at least one energy community and counties
        that contain none according to the IRA.
      </p>
      <div class="flex mx-auto justify-center gap-2">
        <button
          class=" bg-blue-500 hover:bg-blue-700 text-white font-default text-sm py-1 px-2 rounded"
          on:click={handleNextStep}
          >Next
        </button>
        <button
          class="bg-white hover:bg-blue-700 hover:text-white text-gray-400 border border-gray-400 font-default text-sm py-1 px-2 rounded"
          on:click={resetTutorial}
          >Exit tutorial
        </button>
      </div>
    </div>
  {:else if step === 4}
    <div
      class="bg-white fixed bottom-2 p-3 w-[300px] right-2 z-10 rounded border border-1 border-blue-500"
    >
      <p class="text-sm text-justify font-default mb-2 leading-[18px]">
        Employee carbon footprints are not distributed evenly, and it is
        important to understand how employment vulnerability intersects with
        other socioeconomic and demographic factors.
      </p>
      <p class="text-sm text-justify font-default mb-2 leading-[18px]">
        Use the sliders to filter counties by different socioeconomic and
        demographic variables. Multiple sliders can be active at once - try
        combining several variables together to isolate counties with specific
        characteristics.
      </p>
      <div class="flex mx-auto justify-center gap-2">
        <button
          class=" bg-blue-500 hover:bg-blue-700 text-white font-default text-sm py-1 px-2 rounded"
          on:click={handleNextStep}
          >Next
        </button>
        <button
          class="bg-white hover:bg-blue-700 hover:text-white text-gray-400 border border-gray-400 font-default text-sm py-1 px-2 rounded"
          on:click={resetTutorial}
          >Exit tutorial
        </button>
      </div>
    </div>
  {:else if step === 5}
    <div
      class="bg-white fixed top-[280px] p-3 w-[300px] left-2 z-10 rounded border border-1 border-blue-500"
    >
      <p class="text-sm text-justify font-default mb-2 leading-[18px]">
        Click on a county (or select it using the Search box) to bring up the <b>data panel</b>.
      </p>
      <p class="text-sm text-justify font-default mb-2 leading-[18px]">
        Supplementary data includes socioeconomic and demographic data (e.g. median income, poverty rate, 
        minority population share), a comparison of the county's ECF to the state and national averages, and 
        data on the share of the county's employment and emissions attributable to different sectors.
      </p>
      <p class="text-sm text-justify font-default mb-2 leading-[18px]">
        Feel free to click around different counties and states to compare their data.
      </p>
      <p class="text-xs text-justify font-default mb-2 leading-4">
        [Note that the "commercial" sector refers to any activity in a commercial building, including offices,
        restaurants, schools, hospitals, etc.]
      </p>
      <div class="flex mx-auto justify-center gap-2">
        <button
          class=" bg-blue-500 hover:bg-blue-700 text-white font-default text-sm py-1 px-2 rounded"
          on:click={resetTutorial}
          >Exit tutorial
        </button>
        
      </div>
    </div>
  {/if}
{/if}

<style>
  .modal1 {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal2 {
    position: absolute;
    top: 50px;
    left: 300px;
    width: 300px;
    display: flex;
    justify-content: center;
    align-items: center;

    /* allow click-through to backdrop */
    pointer-events: none;
    font-family: "Cardo", serif;
  }

  .contents {
    min-width: 240px;
    border-radius: 6px;
    padding: 16px;
    background: white;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    pointer-events: auto;
    font-family: "Cardo", serif;
  }
</style>
