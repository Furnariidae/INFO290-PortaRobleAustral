//Funciones relacionadas con fecha 
 
 
 //retorna fecha como string en formato dd/mm/yyyy
 export function formatDate(fechaISO: string | undefined): string {
    if(fechaISO){

      const fecha = new Date(fechaISO);
      const dia = fecha.getDate().toString().padStart(2, '0');
      const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Los meses empiezan desde 0
      const anio = fecha.getFullYear().toString();
      return `${dia}/${mes}/${anio}`;

    } else {

      return ""; //nada si no hay fecha, podría ser actualidad igual o definido por el usuario

    }
  }


  export default formatDate;