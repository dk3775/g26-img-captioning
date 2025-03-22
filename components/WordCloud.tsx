'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import cloud from 'd3-cloud';

interface WordCloudProps {
  words: Array<{ text: string; value: number }>;
  width?: number;
  height?: number;
}

const WordCloud = ({ words, width = 300, height = 300 }: WordCloudProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!words.length || !svgRef.current) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    // Create color scale
    const colorScale = d3.scaleOrdinal()
      .range(['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', 
              '#D4A5A5', '#9B59B6', '#3498DB', '#F1C40F', '#1ABC9C']);

    const layout = cloud()
      .size([width, height])
      .words(words)
      .padding(5)
      .rotate(() => 0)
      .fontSize(d => Math.sqrt(d.value) * 15)
      .on("end", draw);

    layout.start();

    function draw(words: any) {
      const svg = d3.select(svgRef.current)
        .attr("width", layout.size()[0])
        .attr("height", layout.size()[1])
        .append("g")
        .attr("transform", `translate(${layout.size()[0] / 2},${layout.size()[1] / 2})`);

      svg.selectAll("text")
        .data(words)
        .enter().append("text")
        .style("font-size", d => `${d.size}px`)
        .style("font-family", "Inter, sans-serif")
        .style("font-weight", "bold")
        .style("fill", (_, i) => colorScale(i.toString()))
        .attr("text-anchor", "middle")
        .attr("transform", d => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
        .text(d => d.text);
    }
  }, [words, width, height]);

  return (
    <div className="flex items-center justify-center">
      <svg 
        ref={svgRef} 
        className="w-full h-full"
        style={{ minHeight: '300px' }}
      />
    </div>
  );
};

export default WordCloud;


