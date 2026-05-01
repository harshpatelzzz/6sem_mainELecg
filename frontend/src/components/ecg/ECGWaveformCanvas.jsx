import { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function ECGWaveformCanvas({ data }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !data || data.length === 0) return;

    const container = containerRef.current;
    
    // Use ResizeObserver for responsive width/height
    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width === 0 || height === 0) return;

      d3.select(container).selectAll("*").remove();

      const svg = d3
        .select(container)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "overflow-hidden drop-shadow-[0_0_5px_var(--bio)]");

      const margin = { top: 20, right: 20, bottom: 20, left: 20 };
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      const g = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const xScale = d3
        .scaleLinear()
        .domain([0, data.length - 1])
        .range([0, innerWidth]);

      const yExtent = d3.extent(data);
      // add a bit of padding to Y extent
      const yPadding = (yExtent[1] - yExtent[0]) * 0.1;
      const yScale = d3
        .scaleLinear()
        .domain([yExtent[0] - yPadding, yExtent[1] + yPadding])
        .range([innerHeight, 0]);

      const lineGenerator = d3
        .line()
        .x((_, i) => xScale(i))
        .y((d) => yScale(d))
        .curve(d3.curveMonotoneX);

      const path = g
        .append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "var(--bio)")
        .attr("stroke-width", 1.5)
        .attr("d", lineGenerator);

      const totalLength = path.node().getTotalLength();

      path
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [data]);

  return (
    <div className="relative w-full h-64 sm:h-80 md:h-96 ecg-grid rounded-xl overflow-hidden glass border border-[var(--border)]">
      {console.log("STEP 7: WAVEFORM RECEIVED", data?.length)}
      {!data || data.length === 0 ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-px bg-[var(--bio)] opacity-30 shadow-[0_0_10px_var(--bio)] absolute" />
          <span className="text-display text-[var(--bio)] text-xl opacity-70 tracking-widest z-10">AWAITING SIGNAL</span>
        </div>
      ) : (
        <>
          <div ref={containerRef} className="w-full h-full" />
          <div className="scan-line absolute inset-0 pointer-events-none opacity-50" />
        </>
      )}
    </div>
  );
}
