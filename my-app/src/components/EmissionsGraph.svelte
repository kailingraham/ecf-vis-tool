<script>
  import * as d3 from "d3";

  let arcGenerator = d3
    .arc()
    .innerRadius(5)
    .outerRadius(50)
    .padAngle(0.015)
    .cornerRadius(4);

  let pieAngleGenerator = d3.pie().value((d) => d.emissions_pct);

  export let emissions_data;

  let arc_data = pieAngleGenerator(emissions_data);

  $: {
    arc_data = pieAngleGenerator(emissions_data);
  }

  const arc_color = d3
    .scaleOrdinal()
    .range(d3.schemeSet2)
    .domain([0, 1, 2, 3, 4, 5, 6, 7]);

  let hovered = -1;

  let recorded_mouse_position = {
    x: 0,
    y: 0,
  };
</script>

<svg width="100" height="100">
  <g transform="translate(50, 50)">
    <!-- Place for Pie -->
    <!-- {arc_data} -->
    {#each arc_data as data, index}
      <path
        d={arcGenerator({
          startAngle: data.startAngle,
          endAngle: data.endAngle,
        })}
        fill={arc_color(data.data.industry)}
      />
    {/each}
  </g>
</svg>

<style>
  .visualization {
    width: 200px;
    margin: 0px;
    margin-top: -20px;
    text-align: middle;
    height: 10px;
    /* position: relative; */
  }

  /* dynamic classes for the tooltip */
  .tooltip-hidden {
    visibility: hidden;
    width: 200px;
    position: relative; /* absolute */
  }

  .tooltip-visible {
    font: 15px sans-serif;
    visibility: visible;
    background-color: #86847f;
    border-radius: 10px;
    width: 100px;
    color: black;
    position: relative;
    padding: 10px;
  }

  h3 {
    font-family: "Cardo", serif;
  }
</style>
