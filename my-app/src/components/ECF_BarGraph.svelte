<script>
  import * as d3 from "d3";
  import { scaleBand, scaleLinear } from "d3-scale";

  export let ecf_data;

  let width = 180;
  let height = 130;

  const margin = { top: 0, right: 0, bottom: 15, left: 35 };
  const innerHeight = height - margin.top - margin.bottom;
  const innerWidth = width - margin.left - margin.right;

  $: xDomain = ecf_data.map((d) => d.scale);
  $: yDomain = ecf_data.map((d) => +d.ECF);

  $: xScale = scaleBand().domain(xDomain).range([0, innerWidth]).padding(0.1);
  $: yScale = scaleLinear()
    .domain([0, Math.max.apply(null, yDomain)])
    .range([0, innerHeight]);

  let hovered = -1;
  let recorded_mouse_position = {
    x: 0,
    y: 0,
  };

  const bar_colors = d3.scaleOrdinal(d3.schemeGreys).domain([0, 1, 2]);

  const barcolors = [
    { scale: "County", color: "black" },
    { scale: "State avg", color: "gray" },
    { scale: "U.S. avg", color: "gray" },
  ];
</script>

<div class="visualization">
  <svg {width} {height}>
    <g transform={`translate(${margin.left},${margin.top})`}>
      <!-- add x-axis and tick marks to ECF axis -->
      {#each yScale.ticks() as tickValue}
        <g
          transform={`translate(0,${
            innerHeight + margin.top - yScale(tickValue)
          })`}
        >
          <line x2={innerWidth} stroke="gray" />

          <text text-anchor="middle" dx=".7em" dy="0.25em" x={-20}>
            {tickValue}
          </text>
        </g>
      {/each}

      <!-- add bar labels to county/state/national axis -->
      {#each ecf_data as d, index}
        <text
          text-anchor="middle"
          y={innerHeight + margin.top + 10}
          x={xScale(d.scale) + xScale.bandwidth() / 2}
        >
          {d.scale}
        </text>

        <!-- <rect
            x="0"
            y={xScale(d.scale)}
            width={yScale(d.ECF)}
            height={xScale.bandwidth()}
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

        <!-- add bar mark for each scale -->
        <rect
          y={innerHeight + margin.top - yScale(d.ECF)}
          x={xScale(d.scale)}
          height={yScale(d.ECF)}
          width={xScale.bandwidth()}
          fill={barcolors[index].color}
        />
      {/each}

      <!-- draw y-axis -->
      <line
        y1={margin.top}
        x1="0"
        y2={innerHeight + margin.top}
        x2="0"
        stroke="black"
      />

      <!-- draw x-axis -->
      <line
        y1={height - margin.bottom}
        x1={margin.left}
        y2={height - margin.bottom}
        x2={margin.left + innerWidth}
        stroke="black"
      />
    </g>
    <!-- add y-axis ECF label -->
    <text class="-rotate-90" x={-height / 2 +6} y={10} text-anchor="middle">
      ECF (tonnes CO2e/employee)
    </text>
  </svg>
</div>

<style>
  .visualization {
    font: 9px sans-serif;
    /* margin: 1px;
    margin-top: 0px;
    margin-left: -40px;
    text-align: middle; */
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
