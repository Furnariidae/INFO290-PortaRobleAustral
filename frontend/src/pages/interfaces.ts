export interface InicioData {
    id: string;
    descripcion: string;
    imagen: string;
}

export interface Persona {
    nombre: string;
}

export interface Institucion {
    nombre: string;
    imagen: string;
}

export interface Tesis {
    id: string;
    titulo: string;
    autor: string[];
    fecha_inicio: string;
    fecha_fin?: string;
    estado: string;
    resumen: string;
    pdf: boolean;
    carta_de_apoyo?: string;
    url_github?: string;
    galeria_imagenes: string[];
    participantes: string[];
    patrocinantes: string[];
    copatrocinantes: string[];
    instituciones: Institucion[];
    nivel: string;
    tipo: string;
    carrera: string;
    etiquetas: string[];
}

export interface TesisDetalleProps {
    tipo: string;
}

export interface Integrante {
    id: string;
    nombre: string;
    linkedin: string;
    fecha: string;
    imagen: string;
    correo: string;
    profesion: string;
    index: number;
    orden?: number;
}

export interface Proyecto {
    id: string;
    titulo: string;
    estado: string;
    fecha_inicio: string;
    fecha_fin?: string;
    autor: string;
    imagen: string;
    galeria_imagenes: string[];
    resumen: string;
    cuerpo: string;
    instituciones: Institucion[];
    participantes: string[];
    url_proyecto?: string;
    url_github?: string;
    pdf: boolean;
    etiquetas: string[];
}

export interface Articulo {
    id: string;
    titulo: string;
    galeria: string[];
    autor: string;
    etiquetas: string[];
    participantes: string[];
    instituciones: Institucion[];
    fechaIni: string;
    fechaFin: string;
    resumen: string;
    cuerpo: string;
    carta_de_apoyo?: string;
    estado: string;
    link: string;
    url_github?: string;
    pdf: boolean;
}

export interface Practica {
    id: string;
    nombre: string;
    estado: string;
    fechaIni: string;
    fechaFin?: string;
    galeria: string[];
    resumen: string;
    instituciones: Institucion[];
    participantes: string[];
    nivel: string;
    tipo: string;
    etiquetas: string[];
}

export interface PracticaDetalleProps {
    tipo: string;
}
interface Link {
    correo?: string;
    web?: string;
}
export interface Colaboracion {
    id: string;
    nombre: string;
    links: Link[];
    fecha_ini: string;
    fecha_fin: string;
    imagen: string;
}

export interface Noticia {
    id: string;
    titulo: string;
    resumen: string;
    fecha: string;
    imagenes: string[];
    cuerpo: string;
    autor: string;
}
