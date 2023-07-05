<script>
  import * as d3 from "d3";
  import { scaleBand, scaleLinear } from "d3-scale";

  export let ecf_data;

  let width = 300;
  let height = 150;

  const margin = { top: 0, right: 20, bottom: 30, left: 60 };
  const innerHeight = height - margin.top - margin.bottom;
  const innerWidth = width - margin.left - margin.right;

  $: xDomain = ecf_data.map((d) => d.scale);
  $: yDomain = ecf_data.map((d) => +d.ECF);

  $: yScale = scaleBand().domain(xDomain).range([0, innerHeight]).padding(0.1);
  $: xScale = scaleLinear()
    .domain([0, Math.max.apply(null, yDomain)])
    .range([0, innerWidth]);

  let hovered = -1;
  let recorded_mouse_position = {
    x: 0,
    y: 0,
  };

  const bar_colors = d3.scaleOrdinal(d3.schemeGreys).domain([0, 1, 2]);

  const barcolors = [
    { scale: "County", color: "black" },
    { scale: "State", color: "gray" },
    { scale: "National", color: "gray" },
  ];
</script>

<div class="visualization">
  <svg {width} {height}>
    <g transform={`translate(${margin.left},${margin.top})`}>
      {#each xScale.ticks() as tickValue}
        <g transform={`translate(${xScale(tickValue)},0)`}>
          <line y2={innerHeight} stroke="black" />

          <text text-anchor="middle" dy=".7em" y={innerHeight + 3}>
            {tickValue}
          </text>
        </g>
      {/each}

      {#each ecf_data as d, index}
        <text
          text-anchor="end"
          x="-3"
          dy=".3em"
          y={yScale(d.scale) + yScale.bandwidth() / 2}
        >
          {d.scale}
        </text>

        <line x1="0" y1="119" x2="220" y2="119" stroke="black" />

        <!-- <rect
          x="0"
          y={yScale(d.scale)}
          width={xScale(d.ECF)}
          height={yScale.bandwidth()}
          fill={index === hovered ? "brown" : barcolors[index].color}
          on:mouseover={(event) => {
            hovered = index;
            recorded_mouse_position = {
              x: event.pageX,
              y: event.pageY,
            };
          }}
          on:mouseout={(event) => {
            hovered = -1;
          }}
        /> -->
        <rect
          x="0"
          y={yScale(d.scale)}
          width={xScale(d.ECF)}
          height={yScale.bandwidth()}
          fill={barcolors[index].color}
        />
      {/each}
    </g>
  </svg>
  <p>Carbon footprint per employee (tons CO2 per employee)</p>

  <div
    class={hovered === -1 ? "tooltip-hidden" : "tooltip-visible"}
    style="left: {recorded_mouse_position.x -
      90}px; bottom: {recorded_mouse_position.y - 500}px"
  >
    {#if hovered !== -1}
      {ecf_data[hovered].ECF}
    {/if}
  </div>
</div>

<style>
  .visualization {
    font: 9px sans-serif;
    margin: 1px;
    margin-top: 0px;
    margin-left: -40px;
    text-align: middle;
    font-family: "Cardo", serif;
    /* position:absolute; */
  }

  /* dynamic classes for the tooltip */
  .tooltip-hidden {
    visibility: hidden;
    width: 10px;
    position: relative;
  }

  .tooltip-visible {
    font: 14px;
    visibility: visible;
    background-color: #dbdad6;
    border-radius: 5px;
    width: 10px;
    color: black;
    position: relative;
    text-align: center;
  }

  .xticks {
    transform: rotate(-90deg);
  }

  h3 {
    text-align: center;
    margin-top: -5px;
    margin-left: 50px;
    font-family: "Cardo", serif;
  }

  p {
    text-align: center;
    margin-top: -15px;
    margin-left: 40px;
    font-family: "Cardo", serif;
  }
</style>
