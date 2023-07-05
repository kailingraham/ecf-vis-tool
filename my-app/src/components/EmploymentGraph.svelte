<script>
  import * as d3 from "d3";

  let arcGenerator = d3
    .arc()
    .innerRadius(5)
    .outerRadius(50)
    .padAngle(0.015)
    .cornerRadius(4);

  let pieAngleGenerator = d3.pie().value((d) => d.employment_pct);

  export let employment_data;

  let arc_data = pieAngleGenerator(employment_data);

  $: {
    arc_data = pieAngleGenerator(employment_data);
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
  <h3>By Employment</h3>
  <svg width="200" height="200">
    <g transform="translate(65, 50)">
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
      5}px; bottom: {recorded_mouse_position.y - 400}px"
  >
    {#if hovered !== -1}
      <!-- You're hovering! -->
      {arc_data[hovered].data.industry}
    {/if}
  </div>
</div>

<div class="legend-container">
  {#each arc_data as data, index}
    <div class="legend-item">
      <div
        class="legend-color"
        style="background-color: {arc_color(data.data.industry)}"
      />
      <span class="legend-label">{arc_data[index].data.industry}</span>
    </div>
  {/each}
</div>

<style>
  .visualization {
    width: 200px;
    margin: 0px;
    margin-top: -20px;
    margin-right: 250px;
    text-align: middle;
    height: 10px;
    /* position: relative; */
    /* padding-bottom: 50%; */
  }

  /* dynamic classes for the tooltip */
  .tooltip-hidden {
    visibility: hidden;
    width: 200px;
    position: absolute;
  }

  .tooltip-visible {
    font: 15px;

    visibility: visible;
    background-color: #86847f;
    border-radius: 10px;
    width: 100px;
    color: black;
    position: relative;
    padding: 10px;
    fill-opacity: 10%;
  }

  .legend-container {
    position: absolute;
    bottom: 1px;
    right: 10px;
    /* height:150px */
  }
  /* Example: Style legend elements */
  .legend-container {
    /* Define container styles */
    font-size: 12px;
    color: #333;
  }

  .legend-item {
    /* Define item styles */
    display: flex;
    align-items: center;
    margin-bottom: 8px;
  }

  .legend-color {
    /* Define color indicator styles */
    width: 20px;
    height: 20px;
    margin-right: 8px;
  }

  .legend-label {
    /* Define label styles */
    flex-grow: 1;
  }

  h3 {
    font-family: "Cardo", serif;
  }
</style>
