import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

interface DataNode {
    name: string;
    wname?: string[];
    children?: DataNode[];
}

interface ZoomableCirclePackingProps {
    data: DataNode;
}

const ZoomableCirclePacking: React.FC<ZoomableCirclePackingProps> = ({
    data,
}) => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        const width = 932;
        const height = width;

        const color = d3
            .scaleLinear<string>()
            .domain([0, 5])
            .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
            .interpolate(d3.interpolateHcl);

        const pack = (data: DataNode) =>
            d3.pack<DataNode>().size([width, height]).padding(3)(
                d3
                    .hierarchy<DataNode>(data)
                    .sum((d) => (d.wname ? d.wname.length : 0))
                    .sort((a, b) => (b.value || 0) - (a.value || 0))
            );

        const root = pack(data);

        const svg = d3
            .create("svg")
            .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
            .attr(
                "style",
                `max-width: 100%; height: auto; display: block; margin: 0 -14px; background: ${color(
                    0
                )}; cursor: pointer;`
            );

        const node = svg
            .append("g")
            .selectAll("circle")
            .data(root.descendants().slice(1))
            .join("circle")
            .attr("fill", (d) => (d.children ? color(d.depth) : "white"))
            .attr("pointer-events", (d) => (!d.children ? "none" : null))
            .on("mouseover", function () {
                d3.select(this).attr("stroke", "#000");
            })
            .on("mouseout", function () {
                d3.select(this).attr("stroke", null);
            })
            .on(
                "click",
                (event, d) => focus !== d && (zoom(event, d), event.stopPropagation())
            );

        const label = svg
            .append("g")
            .style("font", "15px sans-serif")
            .attr("pointer-events", "none")
            .attr("text-anchor", "middle")
            .selectAll("text")
            .data(root.descendants())
            .join("text")
            .style("fill-opacity", (d) => (d.parent === root ? 1 : 0))
            .style("display", (d) => (d.parent === root ? "inline" : "none"))
            .each(function (d) {
                // Añade el nombre en una línea
                d3.select(this)
                    .append("tspan")
                    .attr("x", 0)
                    .attr("dy", "0em")
                    .text(d.data.name)
                    .style("font-weight", "bold") 
                    .style("font-size", "16px");

                // Añade los nombres de los trabajos en una línea debajo
                if (d.data.wname) {
                    d.data.wname.forEach((work, index) => {
                        d3.select(this)
                            .append("tspan")
                            .attr("x", 0)
                            .attr("dy", "1.2em") // Espacio entre líneas
                            .text(work.length > 20 ? `${work.substring(0, 20)}...` : work) // Recorta a 10 caracteres
                            .style("font-size", "12px");
                    });
                }
            });


        svg.on("click", (event) => zoom(event, root));

        let focus = root;
        let view: [number, number, number] = [root.x, root.y, root.r * 2];
        zoomTo([root.x, root.y, root.r * 2]);

        function zoomTo(v: [number, number, number]) {
            const k = width / v[2];
            label.attr(
                "transform",
                (d) => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`
            );
            node.attr(
                "transform",
                (d) => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`
            );
            node.attr("r", (d) => d.r * k);
        }

        function zoom(event: MouseEvent, d: any) {
            if (!d) return;
            focus = d;

            const newView: [number, number, number] = [focus.x, focus.y, focus.r * 2];

            const t = d3
                .transition()
                .duration(event.altKey ? 7500 : 750)
                .tween("zoom", () => {
                    const i = d3.interpolateZoom(view, newView);
                    return (t: number) => zoomTo(i(t));
                });

            label
                .filter(function (d) {
                    return d.parent === focus || this !== null;
                })
                .transition(t)
                .style("fill-opacity", (d) => (d.parent === focus ? 1 : 0))
                .on("start", function (d) {
                    if (d.parent === focus && this !== null)
                        (this as SVGTextElement).style.display = "inline";
                })
                .on("end", function (d) {
                    if (d.parent !== focus && this !== null)
                        (this as SVGTextElement).style.display = "none";
                });

            view = newView;
        }

        if (svgRef.current) {
            svgRef.current.innerHTML = "";
            svgRef.current.appendChild(svg.node()!);
        }
    }, [data]);

    return (
        <div>
            <svg ref={svgRef} className="prevent-select" width="932" height="932" />
        </div>
    );
};

export default ZoomableCirclePacking;
