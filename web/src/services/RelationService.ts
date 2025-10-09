import API from "./API";
const VITE_API_URL = import.meta.env.VITE_API_URL;

const RelationService = {
    addRelation: async(relationId:string) => {
        return await API.post(`${VITE_API_URL}/relations/add_relation`, {relationId});
    },
    removeRelation: async(targetId:string) => {
        return await API.delete(`${VITE_API_URL}/relations/remove_user_relation?targetId=${targetId}`);
    },
    getMutualUserRelationships: async() => {
        return await API.get(`${VITE_API_URL}/relations/get_mutual_user_relations`);
    },
    getRelationInvites: async() => {
        return await API.get(`${VITE_API_URL}/relations/get_relation_invites`);
    },
    searchUserRelation: async(search_term?:string) => {
        let query = `${VITE_API_URL}/relations/search_user_relation`;
        if(search_term){
            query += `?searchTerm=${search_term}`;
        }
        return await API.get(query);
    },
    getRelationInvitesCount: async () => {
        return await API.get(`${VITE_API_URL}/relations/get_relation_invites_count`);
    }
};

export default RelationService;