import React, { useState, useEffect } from "react";
import BubbleChart from "./BubbleChart";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { WordCloudComponent } from "./WordCloudComponent";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import ForceGraph from "./MobileParentsSuits";
import ZoomableCirclePacking from "./ZoomableCirclePacking";
import "./PaginaInterconexiones.css";
import { PassThrough } from "stream";

interface Word_WordCloud {
    text: string;
    value: number;
}

interface Word_ColorBubble {
    id: string;
    value: number;
    color: string;
}

interface Word_RelationshipGraph {
    type: string;
    data: string[];
}

interface DataNode {
    name: string;
    wname?: string[];
    children?: DataNode[];
}

const PaginaInterconexiones = () => {
    const [cluster, setCluster] = useState('');
    const apiUrl = process.env.REACT_APP_API_URL || "http://tu_api_url_por_defecto";
    const [loading, setLoading] = useState(false);
    const [WordCloudData, setWordCloudData] = useState([]);
    const [ColorBubblesData, setColorBubblesData] = useState([]);
    const [RelationshipGraphData, setRelationshipGraphData] = useState([]);
    const [ZoomableBubbleData, setZoomableBubbleData] = useState<DataNode>({
        name: "root",
        children: []
    });

    const handleChangeCluster = async (event: SelectChangeEvent) => {
        const selectedCluster = event.target.value;
        setCluster(selectedCluster);

        switch (selectedCluster) {
            case "WordCloud": {
                if (WordCloudData.length === 0) {
                    try {
                        const data = await fetchDataInterconexiones("/word_cloud_endpoint");
                        if (data) {
                            setWordCloudData(data.map((item: Word_WordCloud) => ({ text: item.text, value: item.value })));
                        }
                    } catch (error) {
                        console.error("Error al procesar WordCloud:", error);
                    }
                }
                break;
            }
            case "ColorBubble": {
                if (ColorBubblesData.length === 0) {
                    try {
                        const data = await fetchDataInterconexiones("/color_bubble_endpoint");
                        if (data) {
                            setColorBubblesData(data.map((item: Word_ColorBubble) => ({ id: item.id, value: item.value, color: item.color })));
                        }
                    } catch (error) {
                        console.error("Error al procesar WordCloud:", error);
                    }
                }
                break;
            }
            case "RelationshipGraph": {
                if (RelationshipGraphData.length === 0) {
                    try {
                        const data = await fetchDataInterconexiones("/relationship_graph_endpoint");
                        console.log(data); 
                        if (data) {
                            setRelationshipGraphData(data.map((item: Word_RelationshipGraph) => ({ type: item.type, data: item.data })));
                        }
                    } catch (error) {
                        console.error("Error al procesar WordCloud:", error);
                    }
                }
                break;
            }
            case "ZoomableBubble": {
                try {
                    const data = await fetchDataInterconexiones("/zoomable_bubble_endpoint");
                    if (data) {
                        console.log(data);
                        setZoomableBubbleData(data);  
                    }
                } catch (error) {
                    console.error("Error al procesar ZoomableBubble:", error);
                }
                break;
            }
        }
    };

    const fetchDataInterconexiones = async (endpoint: string) => {
        try {
            setLoading(true);
            const response = await fetch(`${apiUrl}/interconexiones${endpoint}`);
            if (!response.ok) {
                throw new Error("Error al obtener los datos");
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error al hacer fetch de las palabras:", error);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="PaginaInterconexiones_Container">
            <Box sx={{ marginTop: "10px", display: "flex", alignContent: "flex-start", justifyContent: "center" }}>
                <FormControl fullWidth style={{ width: "400px" }}>
                    <InputLabel>Cluster</InputLabel>
                    <Select value={cluster} label="Cluster" onChange={handleChangeCluster}>
                        <MenuItem value={"WordCloud"}>Frecuencia de palabras</MenuItem>
                        <MenuItem value={"ColorBubble"}>Etiquetas de publicaciones</MenuItem>
                        <MenuItem value={"RelationshipGraph"}>Relaciones</MenuItem>
                        <MenuItem value={"ZoomableBubble"}>Agrupacion</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <div style={{ marginTop: "10px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                {cluster === "WordCloud" && (
                    loading ? (
                        <p>Cargando...</p>
                    ) : (
                        <div>
                            <p className="descripcion_grafico">
                                Este gráfico de nube de palabras representa la frecuencia de las palabras más destacadas en los títulos de los elementos de la página. Las palabras con mayor relevancia se muestran más grandes, ofreciendo una vista clara de las tendencias principales.
                            </p>
                            <WordCloudComponent words={WordCloudData} />
                        </div>
                    )
                )}
                {cluster === "ColorBubble" && (
                    loading ? (
                        <p>Cargando...</p>
                    ) : (
                        <div>
                            <p className="descripcion_grafico">
                                Este gráfico de burbujas coloreadas agrupa las etiquetas de los trabajos según su frecuencia y relaciones. Los colores indican vínculos o categorías comunes, ayudando a visualizar la conexión entre los términos destacados.
                            </p>
                            <BubbleChart data={ColorBubblesData} />
                        </div>
                    )
                )}
                {cluster === "RelationshipGraph" && (
                    loading ? (
                        <p>Cargando...</p>
                    ) : (
                        <div>
                            <p className="descripcion_grafico">
                                Este gráfico de relaciones ilustra las interacciones y colaboraciones entre los participantes de Roble Austral. Las conexiones resaltan cómo están vinculados, ofreciendo una perspectiva integral de la red social interna.
                            </p>
                            <ForceGraph suits={RelationshipGraphData} />
                        </div>
                    )
                )}
                {cluster === "ZoomableBubble" && (
                    loading ? (
                        <p>Cargando...</p>
                    ) : (
                        <div>
                            <p className="descripcion_grafico">
                                Este gráfico de burbujas con capacidad de zoom muestra la agrupación jerárquica de proyectos, permitiendo explorar niveles de detalle desde una visión general hasta información específica al hacer zoom.
                            </p>
                            <ZoomableCirclePacking data={ZoomableBubbleData} />
                        </div>
                    )
                )}
            </div>

        </div>
    );
};

export default PaginaInterconexiones;
