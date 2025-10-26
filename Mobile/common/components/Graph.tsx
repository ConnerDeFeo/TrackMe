import { Text, View } from "react-native";
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";
import * as d3 from 'd3'; 
import { useState } from "react";

const GRAPH_ASPECT_RATIO = 9 / 16;

/**
 * Graph component that renders a line chart with gradient fill
 * @param data - Array of numeric data points to plot
 * @param xStart - Label for the start of the x-axis
 * @param xEnd - Label for the end of the x-axis
 * @param className - Optional additional CSS class names
 */
const Graph = ({data, xStart, xEnd, className}: {data: number[],xStart:string, xEnd:string, className?: string}) => {
    // Track the width of the graph container for responsive sizing
    const [width, setWidth] = useState<number>(0);
    const height = width * GRAPH_ASPECT_RATIO;
    const padding = 20;
    
    // Add 10% extra space above the highest data point
    const multiplier = 1.1;
    const max = Math.max(...data);

    // Configure y-axis scale (vertical) - inverted because SVG coordinates start at top
    const yScale = d3.scaleLinear()
        .domain([0, max*multiplier])
        .range([height, padding]);
    
    // Configure x-axis scale (horizontal) - maps data indices to pixel positions
    const xScale = d3.scaleLinear()
        .domain([0, data.length - 1])
        .range([0, width]);

    // Create line generator for the chart line
    const lineFn = d3.line<number>()
        .x((_, i) => xScale(i))
        .y(d => yScale(d));

    // Create area generator for the gradient fill below the line
    const areaFn = d3.area<number>()
        .x((_, i) => xScale(i))
        .y0(height) // Bottom of the area (graph bottom)
        .y1(d => yScale(d)); // Top of the area (follows the line)
    
    // Generate SVG path strings
    const svgLine = lineFn(data) || undefined;
    const svgArea = areaFn(data) || undefined;

    return(
        <View className={`flex-row ${className}`}>
            {/* Y-axis labels */}
            <View className="justify-between mb-4">
                <Text className="mr-2">{(max * multiplier).toString().slice(0, 5)}</Text>
                <Text className="ml-auto mr-2">0</Text>
            </View>
            
            {/* Main graph container */}
            <View className="w-[80%]">
                <View 
                    onLayout={(event) => {
                        // Capture container width for responsive graph sizing
                        const { width: layoutWidth } = event.nativeEvent.layout;
                        setWidth(layoutWidth);
                    }}
                    className="border trackme-border-gray w-full"
                >
                    <Svg height={height} width={width}>
                        {/* Define gradient for area fill */}
                        <Defs>
                            <LinearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                                <Stop offset={0} stopColor="#007AFF" stopOpacity={1} />
                                <Stop offset={1} stopColor="#007AFF" stopOpacity={0.1} />
                            </LinearGradient>
                        </Defs>
                        {/* Draw the line chart */}
                        <Path d={svgLine || ""} stroke="#007AFF" fill="none" strokeWidth={3}/>
                        {/* Draw the gradient-filled area below the line */}
                        <Path d={svgArea || ""} fill="url(#gradient)" />
                    </Svg>
                </View>
                
                {/* X-axis labels */}
                <View className="flex-row justify-between">
                    <Text>{xStart}</Text>
                    <Text>{xEnd}</Text>
                </View>
            </View>
        </View>
    );
};

export default Graph;