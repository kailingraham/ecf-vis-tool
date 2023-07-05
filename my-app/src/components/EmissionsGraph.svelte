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
    .range(d3.schemePastel2)
    .domain([0, 1, 2, 3, 4, 5, 6, 7]);

  let hovered = -1;

  let recorded_mouse_position = {
    x: 0,
    y: 0,
  };
</script>

<div class="visualization">
  <h3 style="text-align: center;">By Emissions</h3>
  <svg width="200" height="200">
    <g transform="translate(100, 50)">
      <!-- Place for Pie -->
      <!-- {arc_data} -->
      {#each arc_data as data, index}
        <!-- <path
					d={arcGenerator({
						startAngle: data.startAngle,
						endAngle: data.endAngle,
					})}
					fill={index === hovered
						? "black"
						: arc_color(data.data.industry)}
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

  <div
    class={hovered === -1 ? "tooltip-hidden" : "tooltip-visible"}
    style="left: {recorded_mouse_position.x -
      5}px; bottom: {recorded_mouse_position.y - 850}px"
  >
    {#if hovered !== -1}
      <!-- You're hovering! -->
      {arc_data[hovered].data.industry}
    {/if}
  </div>
</div>

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
