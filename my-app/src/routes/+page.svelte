<script>
  import * as d3 from "d3";
  import { onMount } from "svelte";
  import { setContext } from "svelte";
  import PanelApp from "../components/PanelApp.svelte";
  import RangeSlider from "svelte-range-slider-pips";
  import { AccordionItem, Accordion } from "flowbite-svelte";


  let unemployment = [];
  let us;
  let counties;
  let states;
  let statemap;
  let statemesh;
  let chart;
  let ecf;
  let processedData;
  let svgNode;
  let selectedState = "";
  let selectedCounty = "";
  let oldCounty = "";
  let stateNames;
  let usnames = [];
  let uniqueStates = [];
  let counties_list = [];
  let counties_for_zoom;
  let counties_fips;
  let color;
  let FIPScode;
  let showPanel = false;

  // Initialize filtering terms
  let filterByIra = false;
  let qualNonqual = true;
  let migBounds = [0, 0.5];
  let incBounds = [0, 85000];
  let minBounds = [0, 100];
  let ruccBounds = [0, 9];
  let unempBounds = [0, 15.5];
  let povBounds = [0, 60];
  let edBounds = [0, 70];

  let path;
  let width;
  let height;
  let initialScale;
  let offsetX;
  let offsetY;
  let svg;
  let zoom;

  export let id;

  setContext("resetIsolation", () => {
    resetIsolation();
  });
  setContext("setShowPanelFalse", () => {
    setShowPanelFalse();
  });

  function setShowPanelFalse() {
    showPanel = false;
  }

  /**----------------------------------------------------------------------------------------------------------------
   * Load necessary files on mount
   * ----------------------------------------------------------------------------------------------------------------*/
  onMount(async () => {
    const requestURL =
      "https://raw.githubusercontent.com/paulsizaire/paulsizaire.github.io/paul/my-app/static/unemployment-x.csv";
    unemployment = (await d3.csv(requestURL)).map((d) => ({
      ...d,
      ECF_log10: +d.ECF_log10,
    }));

    const requestURLUS =
      "https://raw.githubusercontent.com/kailingraham/ecf-vis-tool/main/my-app/static/counties-albers-10m.json";
    us = await d3.json(requestURLUS);

    const requestURLECF =
      "https://raw.githubusercontent.com/kailingraham/ecf-vis-tool/main/my-app/static/totalECF_demo_tool.json";
    d3.json(requestURLECF).then((data) => {
      processedData = data.features.map((feature) => {
        return {
          id: feature.properties.FIPS,
          state: feature.properties.State,
          ECF: Math.round(feature.properties.ECF * 100) / 100,
          ECF_log10: Math.round(feature.properties.ECF_log10 * 100) / 100,
          ECF_log10_std: feature.properties.ECF_log10_std,

          // Add filter data specifications here
          mig_percent: feature.properties.MIG_PERCENT,
          inc: feature.properties.INC_IND_TOT,
          min_percent: feature.properties.RACE_PERCENT_MINORITY,
          rucc: +feature.properties.RUCC_2013,
          ira: feature.properties.ira,
          unemp: feature.properties.UNEMP_RATE,
          pov: feature.properties.POV_RATE,
          ed: feature.properties.ED_PERCENT_TERTIARY,
          pop: feature.properties.POP,
          hisp: feature.properties.ETHN_LATIN_PERCENT,
          top_race: feature.properties.top_race,
          top_race_percent: feature.properties.top_race_percent,
          next_top_race: feature.properties.next_top_race,
          next_top_race_percent: feature.properties.next_top_race_percent,
        };
      });
    });
    ecf = await d3.json(requestURLECF);

    const requestURLUSNAMES =
      "https://raw.githubusercontent.com/paulsizaire/paulsizaire.github.io/paul/my-app/static/uscounties.csv";
    usnames = await d3.csv(requestURLUSNAMES);
    console.log(usnames);

    counties = topojson.feature(us, us.objects.counties);
    counties_for_zoom = new Map(
      counties.features.map((d) => [d.properties.name, d])
    );

    counties_fips = new Map(counties.features.map((d) => [d.id, d]));

    states = topojson.feature(us, us.objects.states);

    statemap = new Map(states.features.map((d) => [d.properties.name, d]));
    stateNames = Array.from(statemap.keys());

    statemesh = topojson.mesh(us, us.objects.states, (a, b) => a !== b);
  });

  /**----------------------------------------------------------------------------------------------------------------
   * Define functions
   * ----------------------------------------------------------------------------------------------------------------*/
  async function selectState(event) {
    selectedState = event.currentTarget.value;
    if (!selectedState) {
      // If no state is selected, clear the counties dropdown and return
      counties_list = [];
      return;
    }

    const data_state = usnames.filter(
      (row) => row.state_name === selectedState
    );
    data_state.sort(function (a, b) {
      return d3.ascending(a.county, b.county);
    });

    counties_list = data_state.map((row) => row.county);
    showPanel = false;
  }

  // modal functions
  import { openModal } from "svelte-modals";
  import Modal from "./Modal.svelte";
  let step = -1;
  let beginTutorial = false;

  openModal(Modal, {
    title:
      "Welcome to the Employment Vulnerability to the Energy Transition (E-VET) tool",
    message:
      'This tool allows users to explore how vulnerable communities across the U.S. are to economic shocks arising from the energy transition, as measured by their "employee carbon footprint" (ECF).',
    step: step,
    customProp: handleClick,
  });

  function handleClick() {
    if (step === 0) {
      openModal(Modal, {
        title:
          "Welcome to the Migrant Employment & the Energy Transition (MEET) tool",
        message:
          "Employment is the greatest motivator for migration to the U.S., and migrant workers often face challenging economic conditions upon their arrival, especially if they are undocumented. At the same time, the energy transition is disrupting the U.S. economy and workforce, placing communities that depend on carbon-intensive industries at risk of economic displacement and job losses. There has been little policy attention paid specifically to migrants and undocumented workers in carbon-intensive communities that may be disproportionately affected by economic shocks from the energy transition, and workforce development policies need to better understand the intersection between migrant employment challenges and the disruption of communities as the economy decarbonizes.",
        message1:
          "This tool is designed to allow users to explore this intersection. Using publically available data, we calculate the average employee carbon footprint (ECF) of every county in the U.S. as a measure of its economic vulnerability to economic shocks during the energy transition, and map these carbon footprints across the U.S. We supplement this data with data from the American Community Survey on the migrant populations in these counties.",
        message2: 'Click "OK" then "Next Step" to be guided through the tool.',
        step: step,
      });
    }

    handleCountySelection_modal();

    if (step === 1) {
      openModal(Modal, {
        title:
          "Many counties with high vulnerability have low migrant populations",
        message:
          "Appalachia is known for its coal mining industry and has been one of the regions hardest hit by the U.S. transition away from coal. Here, we see that Wetzel County in West Virginia has an ECF over 20 times the national average. However, less than 1% of the county are migrants, a trend shared by much of Appalachia. Feel free to explore adjacent counties by clicking on them or selecting them from the dropdown on the left-hand side of the screen.",
        step: step,
      });

      handleCountySelection_modal();
    }

    if (step === 2) {
      openModal(Modal, {
        title:
          "Urban centers with large migrant populations tend to have low energy transition vulnerabilities",
        message:
          "Brooklyn in New York City (Kings County) has a very large migrant population, and the majority of employment in the borough is in non-industrial sectors. These communities are unlikely to suffer direct job losses due to decarbonization (although may face other employment and workforce development challenges).",
        step: step,
      });

      handleCountySelection_modal();
    }
    if (step === 3) {
      openModal(Modal, {
        title:
          "Some areas with high migrant populations are also highly vulnerable",
        message:
          "West Texas counties such as Gaines County have both large migrant populations and signficiant employment vulnerability to the energy transition due to the presence of the oil and gas industry in the region. These communities will face unique challenges as the country decarbonizes in managing the specific vulnerabilities to economic displacement migrants in the region may face.",
        step: step,
      });

      handleCountySelection_modal();
    }
    if (step === 4) {
      resetView();
      openModal(Modal, {
        title: "Explore using the side panel",
        message:
          "Use the side panel to search for a particular county and state, and filter counties by their migrant population share.",
        step: step,
      });
    }
    if (step === 5) {
      resetView();
    }

    step += 1;
  }

  function resetTutorial() {
    step = 0;
    selectedCounty = "";
    beginTutorial = false;
    resetView();
  }

  function redoTutorial() {
    resetTutorial();
    beginTutorial = true;
    handleClick();
  }

  async function updateCountyDropdown(selectedCounty) {
    await selectState({ currentTarget: { value: selectedState } });
    document.getElementById("county-select").value = selectedCounty;
  }

  function openSearchTray() {
    accordion_items_open = [true, false, false];
  }

  async function handleCountyClick(event, d) {
    // open the search tray in the accordion to ensure that selectedState and selectedCounty fields are accessible
    await openSearchTray();

    // Set the selectedState and selectedCounty
    oldCounty = selectedCounty;
    const stateFIPS = d.id.slice(0, 2);
    const selectedStateInfo = states.features.find((d) => d.id === stateFIPS);
    selectedState = selectedStateInfo.properties.name;
    const stateFeature = statemap.get(selectedState);
    selectedCounty = d.properties.name;

    if (oldCounty === selectedCounty && showPanel === true) {
      resetIsolation();
      showPanel = false;
    } else {
      // Isolate county
      zoomToFeature(stateFeature);

      // Update the dropdowns with the selected state and county
      document.getElementById("state-select").value = selectedState;
      updateCountyDropdown(selectedCounty);

      // Simulate an event to handle the county selection
      handleCountySelection({ target: { value: selectedCounty } });
    }
  }

  $: if (selectedCounty && accordion_items_open[0] === true) {
  }

  // selection functions
  function handleStateSelection(event) {
    selectedState = event.target.value;
    document.getElementById("county-select").value = "";
    if (selectedState === "") {
      resetZoom();
      return;
    }

    const stateFeature = statemap.get(selectedState);
    resetIsolation();
    zoomToFeature(stateFeature);
    // const stateFIPS = d.id.slice(0, 2);
    isolateFeature(stateFeature);
  }

  function handleCountySelection(event) {
    selectedCounty = event.target.value;

    const countyData = usnames.find(
      (row) => row.county === selectedCounty && row.state_name === selectedState
    );

    if (selectedCounty === "") {
      resetZoom();
      resetIsolation();
      return;
    }

    const countyFeature = counties_fips.get(countyData.county_fips);

    if (countyFeature) {
      FIPScode = countyData.county_fips;
    } else {
      FIPScode = "";
    }
    resetIsolation();
    isolateFeature(countyFeature);
    showPanel = true;
  }

  function handleCountySelection_modal(event) {
    if (event) {
      selectedCounty = event.target.value;

      const countyData = usnames.find(
        (row) =>
          row.county === selectedCounty && row.state_name === selectedState
      );

      if (selectedCounty === "") {
        resetZoom();
        resetIsolation();
        return;
      }

      const countyFeature = counties_fips.get(countyData.county_fips);

      if (countyFeature) {
        FIPScode = countyData.county_fips;
      } else {
        FIPScode = "";
      }
      resetIsolation();
      isolateFeature(countyFeature);
    } else {
      if (step === 1) {
        selectedCounty = "Wetzel";
        selectedState = "West Virginia";

        const countyData = usnames.find(
          (row) =>
            row.county === selectedCounty && row.state_name === selectedState
        );

        const countyFeature = counties_fips.get(countyData.county_fips);
        const stateFeature = statemap.get(selectedState);
        zoomToFeature(stateFeature);
        resetIsolation();
        isolateFeature(countyFeature);
        showPanel = true;

        if (countyFeature) {
          FIPScode = countyData.county_fips;
        } else {
          FIPScode = "";
        }
        // document.getElementById("state-select").value = selectedState;
        // document.getElementById("county-select").value = selectedCounty;
      }
      if (step === 2) {
        selectedCounty = "Kings";
        selectedState = "New York";

        const countyData = usnames.find(
          (row) =>
            row.county === selectedCounty && row.state_name === selectedState
        );

        const countyFeature = counties_fips.get(countyData.county_fips);
        const stateFeature = statemap.get(selectedState);
        zoomToFeature(stateFeature);
        resetIsolation();
        isolateFeature(countyFeature);
        showPanel = true;

        if (countyFeature) {
          FIPScode = countyData.county_fips;
        } else {
          FIPScode = "";
        }
      }

      if (step === 3) {
        selectedCounty = "Gaines";
        selectedState = "Texas";

        const countyData = usnames.find(
          (row) =>
            row.county === selectedCounty && row.state_name === selectedState
        );

        const countyFeature = counties_fips.get(countyData.county_fips);
        const stateFeature = statemap.get(selectedState);
        zoomToFeature(stateFeature);
        resetIsolation();
        isolateFeature(countyFeature);
        showPanel = true;

        if (countyFeature) {
          FIPScode = countyData.county_fips;
        } else {
          FIPScode = "";
        }
      }
    }
  }

  function zoomToFeature(feature) {
    const bounds = path.bounds(feature);
    const [[x0, y0], [x1, y1]] = bounds;

    const centerX = x0 + 0.6 * (x1 - x0);
    const centerY = (y0 + y1) / 2;

    const scale = 0.6 / Math.max((1.5 * (x1 - x0)) / width, (y1 - y0) / height);

    svg
      .transition()
      .duration(750)
      .call(
        zoom.transform,
        d3.zoomIdentity
          .translate(width / 2, height / 2)
          .scale(scale)
          .translate(-centerX, -centerY)
      );
  }

  // isolate counties/states by reducing opacity of non-selected counties/states
  function isolateFeature(feature) {
    if (feature.id.length === 2) {
      chart.g
        .selectAll("path")
        .filter(function (d) {
          return d.id.slice(0, 2) !== feature.id;
        })
        .attr("fill-opacity", 0.3);
    } else {
      chart.g
        .selectAll("path")
        .filter(function (d) {
          return d !== feature && d.id.slice(0, 2) !== feature.id.slice(0, 2);
        })
        .attr("fill-opacity", 0.3);
      chart.g
        .selectAll("path")
        .filter(function (d) {
          return d !== feature && d.id.slice(0, 2) === feature.id.slice(0, 2);
        })
        .attr("fill-opacity", 1);
      chart.g
        .selectAll("path")
        .filter(function (d) {
          return d === feature;
        })
        .attr("stroke-opacity", 1)
        .attr("stroke", "black");
    }
  }

  function resetIsolation() {
    chart.g.selectAll("path").attr("fill-opacity", 1);
    chart.g.selectAll("path").attr("stroke-opacity", 0);
  }

  function resetZoom() {
    svg
      .transition()
      .duration(500)
      .call(
        zoom.transform,
        d3.zoomIdentity.translate(offsetX, 0).scale(initialScale)
      );
  }

  function Choropleth(
    data,
    {
      id = (d) => d.id, // given d in data, returns the feature id
      value = () => undefined, // given d in data, returns the quantitative value
      filterVars, // array of all variables within processedData used in the filter sliders
      title, // given a feature f and possibly a datum d, returns the hover text
      format, // optional format specifier for the title
      domain, // [min, max] values; input of color scale
      range = d3.interpolateRgb, // output of color scale
      width = window.innerWidth, // Change this line
      height = window.innerHeight - 50, // Change this line
      projection, // a D3 projection; null for pre-projected geometry
      features, // a GeoJSON feature collection
      featureId = (d) => d.id, // given a feature, returns its id
      borders, // a GeoJSON object for stroking borders
      outline = projection && projection.rotate ? { type: "Sphere" } : null, // a GeoJSON object for the background
      unknown = "#ccc", // fill color for missing data
      fill = "white", // fill color for outline
      stroke = "white", // stroke color for borders
      strokeLinecap = "round", // stroke line cap for borders
      strokeLinejoin = "round", // stroke line join for borders
      strokeWidth, // stroke width for borders
      strokeOpacity, // stroke opacity for borders
      padding = 10, // padding around the map when fitting the projection
    } = {}
    //selectedState
  ) {
    // Compute values.
    const N = d3.map(data, id);
    const V = d3.map(data, value).map((d) => (d == null ? NaN : +d));
    const Im = new d3.InternMap(N.map((id, i) => [id, i]));
    const If = d3.map(features.features, featureId);

    // Map filter variables here
    const mapFilterVars = filterVars.reduce((result, variable) => {
      const mappedValues = d3
        .map(data, (d) => d[variable])
        .map((d) => (d == null ? NaN : +d));
      result[variable] = mappedValues;
      return result;
    }, {});

    // Compute default domains.
    if (domain === undefined) domain = [d3.min(V), d3.mean(V), d3.max(V)];

    // Construct scales.
    const color = d3
      .scaleLinear()
      .domain(domain)
      .range(range)
      .interpolate(d3.interpolateRgb);
    if (color.unknown && unknown !== undefined) color.unknown(unknown);

    // Compute titles.
    if (title === undefined) {
      format = color.tickFormat(100, format);
      title = (f, i) => `${f.properties.name}\n${format(V[i])}`;
    } else if (title !== null) {
      const T = title;
      const O = d3.map(data, (d) => d);
      title = (f, i) => T(f, O[i]);
    }

    // Compute the default height. If an outline object is specified, scale the projection to fit
    // the width, and then compute the corresponding height.
    if (height === undefined) {
      if (outline === undefined) {
        height = 400;
      } else {
        const [[x0, y0], [x1, y1]] = d3
          .geoPath(projection.fitWidth(width, outline))
          .bounds(outline);
        const dy = Math.ceil(y1 - y0),
          l = Math.min(Math.ceil(x1 - x0), dy);
        projection.scale((projection.scale() * (l - 1)) / l).precision(0.2);
        height = dy;
      }
    }

    // Construct a path generator.
    const path = d3.geoPath(projection);
    const svg = d3
      .create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "width: 100%; height: auto; height: intrinsic;");

    if (outline != null)
      svg
        .append("path")
        .attr("fill", fill)
        .attr("stroke", "currentColor")
        .attr("d", path(outline));

    const g = svg.append("g");

    const bounds = path.bounds(features);
    const scaleX = (width - padding * 2) / (bounds[1][0] - bounds[0][0]);
    const scaleY = (height - padding * 2) / (bounds[1][1] - bounds[0][1]);
    const initialScale = Math.min(scaleX, scaleY);

    const offsetX = (width - initialScale * (bounds[1][0] + bounds[0][0])) / 2;
    const offsetY =
      (height - initialScale * (bounds[1][1] + bounds[0][1])) / 2 - 100;

    g.selectAll("path")
      .data(features.features)
      .join("path")
      .attr("class", "county")
      .attr("fill", (d, i) => {
        const value = V[Im.get(If[i])];
        const baseColor = d3.color(color(value));
      })
      .attr("d", path)
      .on("click", handleCountyClick)
      .on("mouseover", function () {
        d3.select(this).style("filter", "brightness(80%)"); // Apply brightness filter on hover
      })
      .on("mouseout", function () {
        d3.select(this).style("filter", null); // Reset filter on mouseout
      })
      .append("title")
      .text((d, i) => title(d, Im.get(If[i])))

    if (borders != null)
      svg
        .append("path")
        .attr("pointer-events", "none")
        .attr("fill", "none")
        .attr("stroke", stroke)
        .attr("stroke-linecap", strokeLinecap)
        .attr("stroke-linejoin", strokeLinejoin)
        .attr("stroke-width", strokeWidth)
        .attr("stroke-opacity", strokeOpacity)
        .attr("d", path(borders))
        .attr("id", "state-boundaries");

    svg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "width: 100%; height: auto; height: intrinsic;");

    const zoom = d3
      .zoom()
      .scaleExtent([1, 8])
      .extent([
        [0, 0],
        [width, height],
      ])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
        svg.select("#state-boundaries").attr("transform", event.transform);
      });

    svg.call(zoom);

    svg.call(
      zoom.transform,
      d3.zoomIdentity.translate(offsetX, 0).scale(initialScale)
    );

    // Add the legend SVG to the legendContainer div
    const legendContainer = d3
      .select("#legendContainer")
      .style("position", "relative"); // Set the position to relative
    const legendWidth = 300;
    const legendHeight = 60;
    const legendMargin = { top: 20, right: 20, bottom: 20 };

    const legendSvg = legendContainer
      .append("svg")
      .attr("width", legendWidth + legendMargin.right)
      .attr("height", legendHeight)
      .style("display", "block") // Set the display to block to ensure the SVG occupies the full width of the container
      .style("margin", "0 auto"); // Center the SVG within the container

    const legendGradient = legendSvg
      .append("defs")
      .append("linearGradient")
      .attr("id", "legend-gradient")
      .attr("x1", "0%")
      .attr("x2", "100%")
      .attr("y1", "0%")
      .attr("y2", "0%");

    legendGradient
      .selectAll("stop")
      .data(
        color.ticks().map((d, i, n) => ({
          offset: `${(100 * i) / n.length}%`,
          color: color(d),
        }))
      )
      .enter()
      .append("stop")
      .attr("offset", (d) => d.offset)
      .attr("stop-color", (d) => d.color);

    const legend = legendSvg
      .append("rect")
      .attr("x", legendMargin.right)
      .attr("y", legendMargin.top)
      .attr("width", legendWidth - legendMargin.right)
      .attr("height", legendHeight - legendMargin.top - legendMargin.bottom)
      .style("fill", "url(#legend-gradient)");

    const minValue = Math.min(...V);
    const meanValue = V.reduce((partialSum, a) => partialSum + a, 0) / V.length;
    const maxValue = Math.max(...V);

    const tickValues = [
      minValue,
      (minValue + meanValue) / 2,
      meanValue,
      meanValue + (maxValue - meanValue) / 3,
      meanValue + (2 * (maxValue - meanValue)) / 3,
      maxValue,
    ];

    // Add a separate group for the tick labels
    const tickGroup = legendSvg
      .append("g")
      .attr(
        "transform",
        `translate(${legendMargin.right}, ${legendHeight / 2})`
      );

    // Add text labels for each tick along the legend
    tickGroup
      .selectAll(".legend-label")
      .data(tickValues)
      .enter()
      .append("text")
      .attr("class", "legend-label")
      .attr(
        "x",
        (d) =>
          ((d - minValue) / (maxValue - minValue)) *
          (legendWidth - legendMargin.right)
      )
      .attr("y", -15) // Adjust the y-coordinate to position the labels above the legend
      .attr("text-anchor", "middle")
      .text((d) => Math.round(10 ** d))
      .style("font-size", "12px");

    // Add the start label below the legend
    tickGroup
      .append("text")
      .attr("class", "legend-label")
      .attr("x", 0)
      .attr("y", 25) // Adjust the y-coordinate to position the label below the legend
      .attr("text-anchor", "start")
      .text("least vulnerable")
      .style("font-size", "12px");

    // Add the end label below the legend
    tickGroup
      .append("text")
      .attr("class", "legend-label")
      .attr("x", legendWidth - legendMargin.right)
      .attr("y", 25) // Adjust the y-coordinate to position the label below the legend
      .attr("text-anchor", "end")
      .text("most vulnerable")
      .style("font-size", "12px");

    // Add the end label below the legend
    tickGroup
      .append("text")
      .attr("class", "legend-label")
      .attr(
        "x",
        ((meanValue - minValue) / (maxValue - minValue)) *
          (legendWidth - legendMargin.right)
      )
      .attr("y", 25) // Adjust the y-coordinate to position the label below the legend
      .attr("text-anchor", "middle")
      .text("avg")
      .style("font-size", "12px");

    const chartProperties = {
      node: svg.node(),
      scales: { color },
      path,
      width,
      height,
      g,
      V,
      mapFilterVars,
      Im,
      If,
      svg,
      zoom,
      color,
      initialScale,
      offsetX,
      offsetY,
    };

    return chartProperties;
  }

  // add function that closes the box and resets the zoom and county selection
  function resetView() {
    // Reset filter variables
    filterByIra = false;
    qualNonqual = true;
    migBounds = [0, 0.5];
    incBounds = [0, 85000];
    minBounds = [0, 100];
    ruccBounds = [1, 9];
    unempBounds = [0, 15.5];
    povBounds = [0, 60];
    edBounds = [0, 70];

    setShowPanelFalse();
    resetZoom();
    resetIsolation();
    selectedState = "";
    selectedCounty = "";
  }


  /**----------------------------------------------------------------------------------------------------------------
   * Create choropleth
   * ----------------------------------------------------------------------------------------------------------------*/

  $: if (processedData && statemap && counties && statemesh) {
    chart = Choropleth(processedData, {
      id: (d) => d.id,
      value: (d) => d.ECF_log10,

      // Identify all filter variables here
      filterVars: [
        "mig_percent",
        "inc",
        "min_percent",
        "rucc",
        "ira",
        "unemp",
        "pov",
        "ed",
        "pop",
        "hisp",
        "top_race",
        "top_race_percent",
        "next_top_race",
        "next_top_race_percent",
      ],

      // scale: d3.scaleLinear,
      domain: [0.253002, 0.946957, 1.303415, 1.574287, 3.306079],
      range: ["#006193", "#70a8ca", "#e0e0e0", "#dcab77", "#a12e00"],
      title: (f, d) =>
        `${f.properties.name}, ${d?.state} \n ${d?.ECF} tons CO2/employee`,
      features: counties,
      borders: statemesh,
      width: window.innerWidth,
      height: window.innerHeight - 50,
    });
  }

  $: if (chart) {
    svgNode = chart.node;
    svg = chart.svg;
    path = chart.path;
    width = chart.width;
    zoom = chart.zoom;
    height = chart.height;
    initialScale = chart.initialScale;
    offsetX = chart.offsetX;
    offsetY = chart.offsetY;
    color = chart.color;
    d3.select("#chart-container").node().appendChild(svgNode);
  }

  $: {
    if (usnames.length > 0) {
      usnames.sort(function (a, b) {
        return d3.ascending(a.state_name, b.state_name);
      });

      const stateSet = new Set();
      usnames.forEach((row) => {
        stateSet.add(row.state_name); // Replace 'state' with the appropriate column name for states
      });
      uniqueStates = Array.from(stateSet);
    }
  }

  $: if (chart) {
    chart.g.selectAll("path").attr("fill", (d, i) => {
      const value = chart.V[chart.Im.get(chart.If[i])];
      const baseColor = d3.color(color(value));

      // extract filter vars for each county here
      const countyMigPercent =
        chart.mapFilterVars["mig_percent"][chart.Im.get(chart.If[i])];
      const countyInc = chart.mapFilterVars["inc"][chart.Im.get(chart.If[i])];
      const countyMinPercent =
        chart.mapFilterVars["min_percent"][chart.Im.get(chart.If[i])];
      const countyRUCC = chart.mapFilterVars["rucc"][chart.Im.get(chart.If[i])];
      const countyIra = chart.mapFilterVars["ira"][chart.Im.get(chart.If[i])];
      const countyUnemp =
        chart.mapFilterVars["unemp"][chart.Im.get(chart.If[i])];
      const countyPov = chart.mapFilterVars["pov"][chart.Im.get(chart.If[i])];
      const countyEd = chart.mapFilterVars["ed"][chart.Im.get(chart.If[i])];

      // Put all filter conditions here
      const conditions = [
        countyMigPercent >= migBounds[0],
        countyMigPercent <= migBounds[1],

        countyInc >= incBounds[0],
        countyInc <= incBounds[1],

        countyMinPercent >= minBounds[0],
        countyMinPercent <= minBounds[1],

        countyRUCC >= ruccBounds[0],
        countyRUCC <= ruccBounds[1],

        countyUnemp >= unempBounds[0],
        countyUnemp <= unempBounds[1],

        countyPov >= povBounds[0],
        countyPov <= povBounds[1],

        countyEd >= edBounds[0],
        countyEd <= edBounds[1],
      ];

      if (filterByIra) {
        conditions.push(countyIra == qualNonqual);
      }

      const doNotFilterOut = conditions.every((condition) => condition);

      return doNotFilterOut
        ? baseColor
        : d3.rgb(baseColor.r, baseColor.g, baseColor.b, 0.1);
    });
  }

  // create an array that contains a boolean for each Accordion Item that indicates whether it should be opened or closed. Will bind this to each AccordionItem in HTML
  let accordion_items_open = [true, false, false];
</script>

<!-- ---------------------------------------------------------------------------------------------------------------
HTML 
---------------------------------------------------------------------------------------------------------------- -->

<div
  class="absolute w-[220px] top-[60px] left-[10px] z-10 bg-gray-100 bg-opacity-[0.675] rounded hover:rounded px-[10px] py-1 font-default"
>
  <div class="grid grid-cols-2 pt-1 pb-2 gap-1">
    <button
      class="bg-white hover:bg-blue-700 hover:text-white text-blue-700 border border-blue-500 text-sm py-0 px-1 rounded font-default"
      on:click={redoTutorial}>Start tutorial</button
    >
    <button
      class="bg-blue-500 hover:bg-blue-700 text-white text-sm py-0 px-1 rounded font-default"
      on:click={resetView}>Reset view</button
    >
  </div>
  <Accordion id="accordion" class="text-gray-900" flush>
    <AccordionItem
      id="accordion-search"
      bind:open={accordion_items_open[0]}
      class="py-0 justify-between w-full text-gray-900"
    >
      <span slot="header" class="py-1 text-center font-bold justify-between"
        >Search</span
      >
      <div class="py-0">
        <label for="state-select" class="text-sm">State:</label>
        <select
          id="state-select"
          class="text-sm"
          on:change={handleStateSelection}
          on:change={selectState}
        >
          {#if selectedState === ""}
            <option value="" disabled selected>Select a state</option>
          {:else}
            <option value="" disabled>Select a state</option>
          {/if}
          {#each uniqueStates as state}
            {#if state === selectedState}
              <option value={state} selected>{state}</option>
            {:else}
              <option value={state}>{state}</option>
            {/if}
          {/each}
        </select>
      </div>
      <div class="py-1">
        <label for="county-select" class="text-sm">County:</label>
        <select
          id="county-select"
          class="text-xs"
          on:change={handleCountySelection}
        >
          {#if selectedCounty === ""}
            <option value="" disabled selected>Select a county</option>
          {:else}
            <option value="" disabled>Select a county</option>
          {/if}
          {#each counties_list as county}
            {#if county === selectedCounty}
              <option value={county} selected>{county}</option>
            {:else}
              <option value={county}>{county}</option>
            {/if}
          {/each}
        </select>
      </div>
    </AccordionItem>

    <AccordionItem
      bind:open={accordion_items_open[1]}
      class="py-1 w-full text-gray-900"
    >
      <span
        slot="header"
        class="text-center font-bold text-black justify-between"
        >IRA Energy Communities</span
      >
      <!-- checkbox to filter by IRA or not -->
      <div class="flex items-center ml-2 p-2">
        <input
          id="default-checkbox"
          type="checkbox"
          bind:checked={filterByIra}
          class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
        <label
          for="default-checkbox"
          class="ml-2 text-xs font-medium text-gray-900 dark:text-gray-300 text-center"
          >IRA energy communities</label
        >
      </div>

      <!-- toggle for qualifying vs non-qualifying counties, when  checkbox is checked-->
      <label class="relative inline-flex items-center cursor-pointer pb-5">
        <span
          class="mr-2 text-[10px] font-medium text-gray-900 dark:text-gray-300"
          style="color: {filterByIra ? 'rgb(17, 24, 39' : 'rgb(156, 163, 175)'}"
          >Non-qualifying</span
        >
        <span class="relative">
          <input
            type="checkbox"
            bind:checked={qualNonqual}
            disabled={filterByIra == false}
            class="sr-only peer"
          />
          <div
            class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
          />
        </span>
        <span
          class="ml-3 text-[10px] font-medium text-gray-900 dark:text-gray-300"
          style="color: {filterByIra ? 'rgb(17, 24, 39' : 'rgb(156, 163, 175)'}"
          >Qualifying</span
        >
      </label>
    </AccordionItem>

    <AccordionItem
      bind:open={accordion_items_open[2]}
      class="py-0 m-0 items-center w-full text-gray-900"
    >
      <span
        slot="header"
        class="text-center font-bold text-black dark:text-gray-300 py-1 justify-between"
        >Demographic Filters</span
      >
      <!-- demographic filter variables -->
      <div class="p-0">
        <h4 style="margin: 0px; text-align: center; font-size: 12px">
          Urbanity (1-3 urban, 4-9 rural)
        </h4>
        <div class="filterSlider">
          <RangeSlider
            range
            bind:values={ruccBounds}
            min={1}
            max={9}
            step={1}
            pips
            pipstep={1}
            first={"label"}
            last={"label"}
            formatter={(v) => Math.round(v)}
            float
            springValues={{ stiffness: 1, damping: 1 }}
          />
        </div>
        <h4 class="m-0 text-center text-xs space-x-0">Median income</h4>
        <div class="filterSlider">
          <RangeSlider
            range
            bind:values={incBounds}
            min={15000}
            max={85000}
            step={500}
            pips
            pipstep={20}
            first={"label"}
            last={"label"}
            formatter={(v) => Math.round(v / 100) / 10}
            prefix={"$"}
            suffix={"k"}
            float
            springValues={{ stiffness: 1, damping: 1 }}
          />
        </div>
        <h4 style="margin: 0px; text-align: center; font-size: 12px">
          Minority population share
        </h4>
        <div class="filterSlider">
          <RangeSlider
            range
            bind:values={minBounds}
            min={0}
            max={100}
            step={0.5}
            pips
            pipstep={50}
            first={"label"}
            last={"label"}
            formatter={(v) => Math.round(v * 10) / 10}
            suffix={"%"}
            float
            springValues={{ stiffness: 1, damping: 1 }}
          />
        </div>
        <h4 style="margin: 0px; text-align: center; font-size: 12px">
          Migrant population share
        </h4>
        <div class="filterSlider">
          <RangeSlider
            range
            bind:values={migBounds}
            min={0}
            max={0.5}
            step={0.005}
            pips
            pipstep={20}
            first={"label"}
            last={"label"}
            formatter={(v) => Math.round(v * 1000) / 10}
            suffix={"%"}
            float
            springValues={{ stiffness: 1, damping: 1 }}
          />
        </div>
        <h4 style="margin: 0px; text-align: center; font-size: 12px">
          Unemployment rate
        </h4>
        <div class="filterSlider">
          <RangeSlider
            range
            bind:values={unempBounds}
            min={0}
            max={15.5}
            step={0.25}
            pips
            pipstep={20}
            first={"label"}
            last={"label"}
            formatter={(v) => Math.round(v * 100) / 100}
            suffix={"%"}
            float
            springValues={{ stiffness: 1, damping: 1 }}
          />
        </div>
        <h4 style="margin: 0px; text-align: center; font-size: 12px">
          Poverty rate
        </h4>
        <div class="filterSlider">
          <RangeSlider
            range
            bind:values={povBounds}
            min={0}
            max={60}
            step={1}
            pips
            pipstep={20}
            first={"label"}
            last={"label"}
            formatter={(v) => Math.round(v * 100) / 100}
            suffix={"%"}
            float
            springValues={{ stiffness: 1, damping: 1 }}
          />
        </div>
        <h4 style="margin: 0px; text-align: center; font-size: 12px">
          Tertiary education attainment
        </h4>
        <div class="filterSlider">
          <RangeSlider
            range
            bind:values={edBounds}
            min={0}
            max={70}
            step={1}
            pips
            pipstep={25}
            first={"label"}
            last={"label"}
            formatter={(v) => Math.round(v * 100) / 100}
            suffix={"%"}
            float
            springValues={{ stiffness: 1, damping: 1 }}
          />
        </div>
      </div>
    </AccordionItem>
  </Accordion>
</div>

<PanelApp {FIPScode} {showPanel} {processedData} {color} />

<!-- style="margin: 0; text-align: center"> -->
<!-- class="panel top-[60px] w-[350px] p-0" -->

<!-- Legend -->
<div
  class="fixed top-[60px] right-2 bg-gray-100 p-1 font-default z-10 bg-opacity-[0.675] rounded"
>
  <h1 class="text-center text-sm font-bold space-y-0">
    Employee Carbon Footprint (ECF)<br />(tons CO<sub>2</sub>e per employee)
  </h1>
  <div id="legendContainer" class="top-0 m-0" />
</div>

<div id="chart-container" />

{#if beginTutorial === true}
  <div class="tutorial">
    {#if step === 1}
      <!-- <h2>Step 2: county!</h2>
        <p>zoom to county.</p> -->
      <button class="tutorial-button" on:click={handleClick}>Next step</button>
    {:else if step === 2}
      <!-- <h2>Step 3: Play with filter</h2>
        <p>Play w/ filter</p> -->
      <button class="tutorial-button" on:click={handleClick}>Next Step</button>
    {:else if step === 3}
      <!-- <h2>Step 4: Play with filter</h2>
        <p>Play w/ filter</p> -->
      <button class="tutorial-button" on:click={handleClick}>Next Step</button>
    {:else if step === 4}
      <!-- <h2>Step 4: Play with filter</h2>
        <p>Play w/ filter</p> -->
      <button class="tutorial-button" on:click={handleClick}>Next Step</button>
    {:else if step === 5}
      <!-- <h2>Step 4: Play with filter</h2>
        <p>Play w/ filter</p> -->
      <button class="tutorial-button" on:click={resetTutorial}
        >Finish tutorial</button
      >
    {/if}
  </div>
{/if}

<!-- {#if beginTutorial === false}
    <div style="position: absolute; bottom: 20px; right: 50%">
      asdf
    </div>
  {/if} -->

<style>
  .filterSlider {
    font-size: 10px;
  }

  #chart-container {
    width: 100%;
    height: calc(
      100% - 50px
    ); /* 100% of the viewport height minus the 50px navigation bar height */
    margin: 0 auto;
    position: relative;
  }

  .panel {
    position: absolute;
    top: 60px;
    left: 10px;
    background-color: rgba(244, 244, 245, 0.675);
    border-radius: 5px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    z-index: 3;
    font-family: "Cardo", serif;
  }

  .box {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .tutorial {
    position: absolute;
    bottom: 20px;
    right: 50px;
  }

  body {
    font-family: "Cardo", serif;
  }

  #state-select {
    font-family: "Cardo", serif;
  }

  #county-select {
    font-family: "Cardo", serif;
  }

  .tutorial-button {
    background-color: #4caf50;
    border: none;
    color: white;
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    border-radius: 4px;
    font-family: "Cardo", serif;
  }

  .generic-button {
    background-color: #808080;
    border: none;
    color: white;
    padding: 4px 10px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 14px;
    border-radius: 4px;
    font-family: "Cardo", serif;
  }
</style>
