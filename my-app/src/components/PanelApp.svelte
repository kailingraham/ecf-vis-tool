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
    "https://raw.githubusercontent.com/paulsizaire/paulsizaire.github.io/mvp/my-app/static/socioec_ECF.csv";

  //load emissions data
  let emissionsFile =
    "https://raw.githubusercontent.com/paulsizaire/paulsizaire.github.io/socioeconomic-panel/ACS/emissions.csv";

  //load employment data
  let employmentFile =
    "https://raw.githubusercontent.com/paulsizaire/paulsizaire.github.io/socioeconomic-panel/ACS/employment.csv";

  //load employment data
  let ecfFile =
    "https://raw.githubusercontent.com/paulsizaire/paulsizaire.github.io/socioeconomic-panel/ACS/ecf.csv";

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
          industry: d.FIPS,
          emissions_pct: d[FIPScode],
        };
      });
    }
  }

  async function fetchEmploymentData() {
    employment_data = await d3.csv(employmentFile, function (d) {
      return {
        industry: d.FIPS,
        employment_pct: d[FIPScode],
      };
    });
  }

  async function fetchECFData() {
    ecf_data = await d3.csv(ecfFile, function (d) {
      return {
        scale: d.FIPS,
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
      console.log(countyNameData);
    }
  }

</script>

{#if showPanel}
  <div
    class="absolute bottom-2 right-2 top-[175px] w-[420px] rounded z-10 bg-gray-100 bg-opacity-[0.675] p-2 font-default"
  >
    <div class="w-full justify-between flex pt-1 px-1">
      <span class="text-2xl font-bold justify-between">
        {countyNameData.county}, {countyNameData.state} <span class='font-normal text-sm'>
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
      
      <div class="text-xs p-1">
        Population: <span class='font-semibold'>{(countyOtherData.pop).toLocaleString('en')}</span><br />
        Median income: <span class='font-semibold'>${(countyOtherData.inc).toLocaleString('en')}</span><br />
        Non-white population share: <span class='font-semibold'>{Math.round(countyOtherData.nonwhite * 10) / 10}%</span><br />
        ({countyOtherData.top_race}: {Math.round(countyOtherData.top_race_percent * 10) / 10}%, 
        {countyOtherData.next_top_race}: {Math.round(countyOtherData.next_top_race_percent * 10) / 10}%) <br />
        Hispanic population share: <span class='font-semibold'>{Math.round(countyOtherData.hisp * 10) / 10}%</span><br />
        Poverty rate: <span class='font-semibold'>{Math.round(countyOtherData.pov * 10) / 10}%</span><br />
        Unemployment rate: <span class='font-semibold'>{Math.round(countyOtherData.unemp * 10) / 10}%</span><br
        />
        Tertiary education attainment: <span class='font-semibold'>{Math.round(countyOtherData.ed * 10) /
          10}</span>%<br />
      </div>
      <div class="flex px-2 p-1"><ECF_BarGraph bind:ecf_data /></div>
      <div>
        Employment by sector
      </div>
      <div>Emissions by sector</div>
      <div>01</div>
      <div>01</div>
      <div>01</div>
    </div>
  </div>

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
