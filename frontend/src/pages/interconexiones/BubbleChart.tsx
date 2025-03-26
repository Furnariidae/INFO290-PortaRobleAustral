import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

interface DataNode {
    id: string;
    value: number;
    color: string; // Agrega el campo color
    children?: DataNode[];
}

interface BubbleChartProps {
    data: DataNode[];
}

const BubbleChart: React.FC<BubbleChartProps> = ({ data }) => {

    console.log(data)
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (!svgRef.current) return;

        const width = 928;
        const height = width;
        const margin = 1;

        const name = (d: DataNode) => d.id || '';
        const names = (d: DataNode) => name(d).split(/(?=[A-Z][a-z])|\s+/g);

        const format = d3.format(",d");

        const pack = d3.pack<DataNode>()
            .size([width - margin * 2, height - margin * 2])
            .padding(3);

        const root = d3.hierarchy({ children: data } as DataNode)
            .sum(d => d.value || 0);

        const svg = d3.select(svgRef.current)
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [-margin, -margin, width, height])
            .attr("style", "max-width: 100%; height: auto; font: 20px sans-serif;")
            .attr("text-anchor", "middle");

        const node = svg.append("g")
            .selectAll()
            .data(pack(root).leaves())
            .join("g")
            .attr("transform", d => `translate(${d.x},${d.y})`);

        node.append("title")
            .text(d => `${d.data.id}\n${format(d.value || 0)}`);

        node.append("circle")
            .attr("fill-opacity", 0.7)
            .attr("fill", d => d.data.color) // Usa el color especificado en los datos
            .attr("r", d => d.r);

        const text = node.append("text")
            .attr("clip-path", d => `circle(${d.r})`);

        text.selectAll()
            .data(d => names(d.data))
            .join("tspan")
            .attr("x", 0)
            .attr("y", (d, i, nodes) => `${i - nodes.length / 2 + 0.35}em`)
            .text(d => d);

        text.append("tspan")
            .attr("x", 0)
            .attr("y", d => `${names(d.data).length / 2 + 0.35}em`)
            .attr("fill-opacity", 0.7)
            .text(d => format(d.value || 0));

    }, [data]);

    return <svg className='prevent-select' ref={svgRef} width="932" height="932"/>;
};

export default BubbleChart;
