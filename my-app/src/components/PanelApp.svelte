<script>
  import Box from "./Box.svelte";
  import * as d3 from "d3";
  import EmploymentGraph from "./EmploymentGraph.svelte";
  import EmissionsGraph from "./EmissionsGraph.svelte";
  import ECF_BarGraph from "./ECF_BarGraph.svelte";
  import { getContext } from "svelte";

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

  let resetIsolation = getContext("resetIsolation");
  let setShowPanelFalse = getContext("setShowPanelFalse");

  function closeBox() {
    setShowPanelFalse();
    resetIsolation();
  }

  //set stats you want to show
  let countyData = [];
  let emissions_data = [];
  let panel_data = [];
  let employment_data = [];
  let ecf_data = [];

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

  $: {
    FIPScode, fetchEmissionsData();
    FIPScode, fetchEmploymentData();
    FIPScode, fetchECFData();
    FIPScode, fetchPanelData();
  }

  $: {
    countyData = panel_data.filter((d) => d.FIPS === FIPScode);
  }
</script>

{#if showPanel}
  <Box {showPanel}>
    <div class="row">
      <button class="close-button" on:click={closeBox}>
        <span class="icon-cross"> x</span>
      </button>
      <div class="col-md-1">
        {#each countyData as d}
          <!-- add more county level stats here if you want to -->
          <h1>{d.county}, {d.state}</h1>
        {/each}
      </div>
      <div class="col-md-3">
        {#each countyData as d}
          <!-- add more county level stats here if you want to -->
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
  </Box>
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
