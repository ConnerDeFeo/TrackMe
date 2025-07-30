const API = {
    get: async (path: string): Promise<Response> => {
        return await fetch(path, {
        credentials: 'include', 
        method: 'GET'
        });
    },
    post: async (path: string, data: Record<string, any> = {}): Promise<Response> => {
        return await fetch(path, {
        credentials: 'include', 
        method: 'POST',  
        headers: {
            'Content-Type': 'application/json',  
        },
        body: JSON.stringify(data),
        });
    },
    put: async (path: string, data: Record<string, any> = {}): Promise<Response> => {
        return await fetch(path, {
        credentials: 'include', 
        method: 'PUT',  
        headers: {
            'Content-Type': 'application/json',  
        },
        body: JSON.stringify(data),
        });
    },
    delete: async (path: string): Promise<Response> => {
        return await fetch(path, {
        credentials: 'include', 
        method: 'DELETE'
        });
    },
    upload: async (path: string, file: File): Promise<Response> => {
        const formData = new FormData();
        formData.append("file", file);
        return await fetch(path, {
        credentials: 'include', 
        method: 'POST',  
        body: formData,
        });
    }
};
  
export default API;