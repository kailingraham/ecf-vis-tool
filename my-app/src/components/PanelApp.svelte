<script>
  import Box from "./Box.svelte";
  import * as d3 from "d3";
  import EmploymentGraph from "./EmploymentGraph.svelte";
  import EmissionsGraph from "./EmissionsGraph.svelte";
  import ECF_BarGraph from "./ECF_BarGraph.svelte";
  import { getContext, onMount } from "svelte";
  import { XCircleIcon } from "svelte-feather-icons";

  //load socio-economic data
  let socioeconFile =
    //"https://raw.githubusercontent.com/paulsizaire/paulsizaire.github.io/socioeconomic-panel/ACS/socioec_ECF.csv";
    "https://raw.githubusercontent.com/kailingraham/ecf-vis-tool/main/my-app/static/socioec_ECF.csv";

  //load emissions data
  let emissionsFile =
    // "https://raw.githubusercontent.com/paulsizaire/paulsizaire.github.io/socioeconomic-panel/ACS/emissions.csv";
    
    'https://raw.githubusercontent.com/kailingraham/ecf-vis-tool/main/my-app/static/emissions.csv';

  //load employment data
  let employmentFile =
    // "https://raw.githubusercontent.com/paulsizaire/paulsizaire.github.io/socioeconomic-panel/ACS/employment.csv";
    'https://raw.githubusercontent.com/kailingraham/ecf-vis-tool/main/my-app/static/employment.csv';

  //load employment data
  let ecfFile =
    // "https://raw.githubusercontent.com/paulsizaire/paulsizaire.github.io/socioeconomic-panel/ACS/ecf.csv";
    'https://raw.githubusercontent.com/kailingraham/ecf-vis-tool/main/my-app/static/ecf.csv';

  //port variables
  export let FIPScode;
  export let showPanel;
  export let processedData;
  export let color;

  let resetIsolation = getContext("resetIsolation");
  let setShowPanelFalse = getContext("setShowPanelFalse");

  function closeBox() {
    setShowPanelFalse();
    resetIsolation();
  }

  //set stats you want to show
  let countyNameData = [];
  let emissions_data = [];
  let panel_data = [];
  let employment_data = [];
  let ecf_data = [];
  let countyOtherData = [];
  let dataToFilter;

  async function fetchEmissionsData() {
    if (FIPScode) {
      emissions_data = await d3.csv(emissionsFile, function (d) {
        return {
          industry: d.sector,
          emissions_pct: d[FIPScode],
        };
      
      });
    }
  }
  

  async function fetchEmploymentData() {
    employment_data = await d3.csv(employmentFile, function (d) {
      return {
        industry: d.sector,
        employment_pct: d[FIPScode],
      };
    });
  }

  async function fetchECFData() {
    ecf_data = await d3.csv(ecfFile, function (d) {
      return {
        scale: d.granularity,
        ECF: d[FIPScode],
      };
    });
  }

  async function fetchPanelData() {
    panel_data = await d3.csv(socioeconFile, function (d) {
      let fips = d.FIPS;
      if (fips.length === 4) {
        fips = "0" + fips;
      }
      return {
        county: d.COUNTY,
        state: d.STATE,
        population: d.POP,
        mig_pop: d.MIG_TOT,
        FIPS: fips,
        poverty_rate: d.POV_RATE,
        income: d.INC_IND_TOT,
        top_1: d.top_1,
        top_2: d.top_2,
        top_3: d.top_3,
      };
    });
  }

  // onMount(async () => {
  //   if (FIPScode) {
  //     countyOtherData = processedData
  //     console.log(countyOtherData)
  //   }

  // });

  async function fetchProcessedData() {
    dataToFilter = await processedData;
    // countyOtherData = dataToFilter.filter((d) => d.id === FIPScode)[0];
  }

  $: {
    FIPScode, fetchEmissionsData();
    FIPScode, fetchEmploymentData();
    FIPScode, fetchECFData();
    FIPScode, fetchPanelData();
    // FIPScode, fetchProcessedData();
    // FIPScode, console.log(countyOtherData);
    // FIPScode, console.log(processedData)
  }

  $: {
    countyNameData = panel_data.filter((d) => d.FIPS === FIPScode);
    // countyOtherData = dataToFilter.filter((d) => d.id === FIPScode)[0];
  }

  $: {
    if (showPanel === true) {
      countyNameData = panel_data.filter((d) => d.FIPS === FIPScode)[0];
      countyOtherData = processedData.filter((d) => d.id === FIPScode)[0];
    }
  }

  let pieAngleGenerator = d3.pie().value((d) => d.employment_pct);

  let arc_data = pieAngleGenerator(employment_data);

  $: {
    arc_data = pieAngleGenerator(employment_data);
  }

  const arc_color = d3
    .scaleOrdinal()
    .range(d3.schemeSet2)
    .domain([0, 1, 2, 3, 4, 5, 6, 7]);
</script>

{#if showPanel}
  <div
    class="absolute bottom-2 right-2 w-[427px] rounded z-10 bg-gray-100 bg-opacity-[0.675] p-2 font-default"
  >
    <div class="w-full justify-between flex pt-1 px-1">
      <span class="text-2xl font-bold justify-between">
        {countyNameData.county}, {countyNameData.state}
        <span class="font-normal text-sm">
          (FIPS: {FIPScode})
        </span>
      </span>

      <button on:click={closeBox}>
        <XCircleIcon />
      </button>
    </div>
    <div class="text-base pb-1 px-1">
      {countyOtherData.ECF} tons CO<sub>2</sub>e/employee
    </div>
    <div class="text-base p-1">
      {#if countyOtherData.ira === 1}
        <span class=" text-green-900 font-bold">Does </span>
      {:else}
        <span class="text-lg text-red-900 font-bold">Does not</span>
      {/if}
      contain an IRA energy community
    </div>

    <div class="grid grid-cols-2">
      <!-- stats -->
      <div>
        <div class="w-full font-bold text-center">Socioeconomic data</div>
        <div class="text-xs p-1">
          Population: <span class="font-semibold"
            >{countyOtherData.pop.toLocaleString("en")}</span
          ><br />
          Median income:
          <span class="font-semibold"
            >${countyOtherData.inc.toLocaleString("en")}</span
          ><br />
          Minority population share:
          <span class="font-semibold"
            >{Math.round(countyOtherData.min_percent * 10) / 10}%</span
          ><br />
          ({countyOtherData.top_race}: {Math.round(
            countyOtherData.top_race_percent * 10
          ) / 10}%,
          {countyOtherData.next_top_race}: {Math.round(
            countyOtherData.next_top_race_percent * 10
          ) / 10}%) <br />
          Hispanic population share:
          <span class="font-semibold"
            >{Math.round(countyOtherData.hisp * 10) / 10}%</span
          ><br />
          Poverty rate:
          <span class="font-semibold"
            >{Math.round(countyOtherData.pov * 10) / 10}%</span
          ><br />
          Unemployment rate:
          <span class="font-semibold"
            >{Math.round(countyOtherData.unemp * 10) / 10}%</span
          ><br />
          Tertiary education attainment:
          <span class="font-semibold"
            >{Math.round(countyOtherData.ed * 10) / 10}</span
          >%<br />
        </div>
      </div>
      <!-- ECF bar chart -->
      <div>
        <div class="w-full font-bold text-center">ECF Comparison</div>
        <div class="flex px-2 py-1"><ECF_BarGraph bind:ecf_data /></div>
      </div>
      <!-- employment and emissions by sector -->
      <div class="p-1">
        <div class="w-full font-bold text-center">Employment by sector</div>
        <div class="flex justify-center p-2">
          <EmploymentGraph bind:employment_data />
        </div>
      </div>
      <div class="p-1">
        <div class="w-full font-bold text-center">Emissions by sector</div>
        <div class="flex justify-center p-2">
          {#await fetchEmissionsData() then}
            <EmissionsGraph bind:emissions_data />
          {/await}
        </div>
      </div>
    </div>

    <!-- legend -->
    <div class="grid grid-cols-4 flex items-center text-xs">
      {#each arc_data as data, index}
        <div class="flex">
          <div
            class="w-3 h-3 m-1"
            style="background-color: {arc_color(data.data.industry)}"
          />
          <span class="pt-1">{arc_data[index].data.industry}</span>
        </div>
      {/each}
    </div>
  </div>

  <!-- <div>
    <div class="grid grid-cols-3 flex items-center mb-2">
      {#each arc_data as data, index}
        <div class='flex'>
          <div
            class="w-5 h-5 m-1"
            style="background-color: {arc_color(data.data.industry)}"
          />
          <span>{arc_data[index].data.industry}</span>
        </div>
      {/each}
    </div>
  </div> -->

  <!-- <Box {showPanel} class='rounded-md'>
    <div class="row">
      <button class="close-button" on:click={closeBox}>
        <span class="icon-cross"> x</span>
      </button>
      <div class="col-md-1">
        {#each countyNameData as d}
          
          <h1>{d.county}, {d.state}</h1>
        {/each}
      </div>
      <div class="col-md-3">
        {#each countyNameData as d}
          
          <p>
            There are {Math.round(d.population)} people in this county, of which
            {Math.round(d.mig_pop)} are migrants ({Math.round(
              (d.mig_pop * 100) / d.population
            )}%), mostly from {d.top_1}, {d.top_2}, and {d.top_3}. The county
            median annual income is ${Math.round(d.income)}, and the poverty rate is {Math.round(d.poverty_rate*100)}%.
          </p>
        {/each}
      </div>
    </div>
    <div class="row">
      <div class="col-md-2">
        <h2>Carbon footprint comparison</h2>
      </div>
      <div class="col-md-2">
        <h2>Industry Breakdown</h2>
      </div>
    </div>
    <div class="row">
      <div class="col-md-1">
        <div class="graph">
          <ECF_BarGraph bind:ecf_data />
        </div>
      </div>

      <div class="col-md-1">
        <div class="graph">
          {#await fetchEmissionsData() then}
            <EmissionsGraph bind:emissions_data />
          {/await}
        </div>
      </div>

      <div class="col-md-2">
        <div class="graph">
          <EmploymentGraph bind:employment_data />
        </div>
      </div>
    </div>
  </Box> -->
{/if}

<style>
  .row {
    display: flex;
    min-height: 2px;
  }
  .col-md-4 {
    flex: 10%;
    padding: 1%;
  }
  .col-md-2 {
    flex: 10%;
    padding: 0%;
  }

  .col-md-6 {
    flex: 10%;
    padding: 1%;
  }
  .col-md-3 {
    flex: 70%;
    padding: 1%;
  }
  .col-md-1 {
    flex: 10%;
    padding: 0%;
  }

  .graph {
    height: 80 px;
    margin: 1px;
  }

  h1 {
    text-align: left;
    margin: 1px;
    font-family: "Cardo", serif;
  }

  h2 {
    text-align: left;
    margin: 1px;
    font-family: "Cardo", serif;
  }

  h3 {
    text-align: center;
    margin: 1px;
    font-family: "Cardo", serif;
  }

  p {
    font-family: "Cardo", serif;
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

  .icon-cross {
    @include cross(40px, #fff, 6px);
  }
</style>
