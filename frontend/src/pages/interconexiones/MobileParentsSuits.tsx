import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

interface Suit {
    type: string;
    data: string[];
}

interface Node extends d3.SimulationNodeDatum {
    id: string;
}

interface ForceGraphProps {
    suits: Suit[];
}

const ForceGraph: React.FC<ForceGraphProps> = ({ suits }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        const width = 1500;
        const height = 1500;

        // Transformamos los datos para obtener nodos y enlaces
        const links = suits.flatMap((group) =>
            group.data.flatMap((source, i) =>
                group.data.slice(i + 1).map((target) => ({
                    source,
                    target,
                    type: group.type,
                }))
            )
        );

        const nodes: Node[] = Array.from(
            new Set(links.flatMap((l) => [l.source, l.target])),
            (id) => ({ id })
        );

        const types = Array.from(new Set(suits.map((d) => d.type)));
        const color = d3.scaleOrdinal(types, d3.schemeCategory10);

        const simulation = d3
            .forceSimulation(nodes)
            .force(
                "link",
                d3
                    .forceLink(links)
                    .id((d: any) => d.id)
                    .distance(100)
            )
            .force("charge", d3.forceManyBody().strength(-1500))
            .force("x", d3.forceX())
            .force("y", d3.forceY())
            .force("collision", d3.forceCollide().radius(20));

        const svg = d3
            .select(svgRef.current)
            .attr("viewBox", [-width / 2, -height / 3, width, height])
            .attr("style", "font: 12px sans-serif.");

        svg.selectAll("*").remove();

        svg
            .append("defs")
            .selectAll("marker")
            .data(types)
            .join("marker")
            .attr("id", (d) => `arrow-${d}`)
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 15)
            .attr("refY", -0.5)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto")
            .append("path")
            .attr("fill", (d) => color(d) as string)
            .attr("d", "M0,-5L10,0L0,5");

        const link = svg
            .append("g")
            .attr("fill", "none")
            .attr("stroke-width", 3)
            .selectAll("path")
            .data(links)
            .join("path")
            .attr("stroke", (d) => color(d.type) as string);

        const node = svg
            .append("g")
            .attr("fill", "currentColor")
            .attr("stroke-linecap", "round")
            .attr("stroke-linejoin", "round")
            .selectAll<SVGGElement, Node>("g")
            .data(nodes)
            .join("g")
            .call(
                d3.drag<SVGGElement, Node>()
                    .on("start", (event, d) => {
                        if (!event.active) simulation.alphaTarget(0.3).restart();
                        d.fx = d.x;
                        d.fy = d.y;
                    })
                    .on("drag", (event, d) => {
                        d.fx = event.x;
                        d.fy = event.y;
                    })
                    .on("end", (event, d) => {
                        if (!event.active) simulation.alphaTarget(0);
                        d.fx = null;
                        d.fy = null;
                    })
            );

        node
            .append("circle")
            .attr("stroke", "white")
            .attr("stroke-width", 2)
            .attr("r", 10);

        node
            .append("text")
            .attr("x", 12)
            .attr("y", "0.31em")
            .attr("font-size", "30px")
            .text((d) => d.id)
            .clone(true)
            .lower()
            .attr("fill", "none")
            .attr("stroke", "white")
            .attr("stroke-width", 3);

        simulation.on("tick", () => {
            link.attr("d", (d) => {
                const dx = (d as any).target.x - (d as any).source.x;
                const dy = (d as any).target.y - (d as any).source.y;
                const dr = Math.sqrt(dx * dx + dy * dy);
                return `M${(d as any).source.x},${(d as any).source.y
                    }A${dr},${dr} 0 0,1 ${(d as any).target.x},${(d as any).target.y}`;
            });

            node.attr("transform", (d) => `translate(${d.x},${d.y})`);
        });

        return () => {
            simulation.stop();
        };
    }, [suits]);

    const types = Array.from(new Set(suits.map((d) => d.type)));

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: "flex", gap: "10px" }}>
                {Array.from(new Set(suits.map(suit => suit.type))).map(type => (
                    <div key={type} style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ width: '20px', height: '20px', backgroundColor: d3.schemeCategory10[types.indexOf(type)] }}></span>
                        {type}
                    </div>
                ))}
            </div>
            <svg className='prevent-select' ref={svgRef} style={{objectFit: "contain"}} />
        </div>
    );
};

export default ForceGraph;
