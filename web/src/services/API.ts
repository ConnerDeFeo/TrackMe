import { fetchAuthSession } from "aws-amplify/auth";

const API = {
    handleMissingIdToken: () => {
        throw new Error("User is not authenticated, ID token is missing.");
    },
    get: async (path: string): Promise<Response> => {
        const session = await fetchAuthSession();
        const idToken = session.tokens?.idToken?.toString();
        if (!idToken) {
            API.handleMissingIdToken();
        }
        return await fetch(path, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${idToken}`
            }
        });
    },
    post: async (path: string, data: Record<string, any> = {}): Promise<Response> => {
        const session = await fetchAuthSession();
        const idToken = session.tokens?.idToken?.toString();
        if (!idToken) {
            API.handleMissingIdToken();
        }
        return await fetch(path, {
            method: 'POST',  
            headers: {
                'Content-Type': 'application/json',  
                Authorization: `Bearer ${idToken}`
            },
            body: JSON.stringify(data),
        });
    },
    put: async (path: string, data: Record<string, any> = {}): Promise<Response> => {
        const session = await fetchAuthSession();
        const idToken = session.tokens?.idToken?.toString();
        if (!idToken) {
            API.handleMissingIdToken();
        }
        return await fetch(path, {
            method: 'PUT',  
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${idToken}`
            },
            body: JSON.stringify(data),
        });
    },
    delete: async (path: string): Promise<Response> => {
        const session = await fetchAuthSession();
        const idToken = session.tokens?.idToken?.toString();
        if (!idToken) {
            API.handleMissingIdToken();
        }
        return await fetch(path, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${idToken}`
            }
        });
    },
    upload: async (path: string, file: File): Promise<Response> => {
        const session = await fetchAuthSession();
        const idToken = session.tokens?.idToken?.toString();
        if (!idToken) {
            API.handleMissingIdToken();
        }
        const formData = new FormData();
        formData.append("file", file);
        return await fetch(path, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${idToken}`
            },
            body: formData,
        });
    }
};
  
export default API;