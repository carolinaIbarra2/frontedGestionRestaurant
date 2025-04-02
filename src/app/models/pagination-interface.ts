//export para que sea accesible desde otros archivos
export interface PaginatedResponse {
    items: any[];      // Lista de usuarios
    total_pages: number;
    current_page: number;
    total_items: number;
}
  