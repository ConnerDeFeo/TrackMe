import API from "./API";

const RelationService = {
    addRelation: async(relationId:string) => {
        return await API.post(`${process.env.EXPO_PUBLIC_API_URL}/relations/add_relation`, {relationId});
    },
    removeRelation: async(targetId:string) => {
        return await API.delete(`${process.env.EXPO_PUBLIC_API_URL}/relations/remove_user_relation?targetId=${targetId}`);
    },
    getMutualUserRelationships: async() => {
        return await API.get(`${process.env.EXPO_PUBLIC_API_URL}/relations/get_mutual_user_relations`);
    },
    getRelationInvites: async() => {
        return await API.get(`${process.env.EXPO_PUBLIC_API_URL}/relations/get_relation_invites`);
    },
    searchUserRelation: async(search_term?:string) => {
        let query = `${process.env.EXPO_PUBLIC_API_URL}/relations/search_user_relation`;
        if(search_term){
            query += `?searchTerm=${search_term}`;
        }
        return await API.get(query);
    },
    getPendingProposals: async () => {
        return await API.get(`${process.env.EXPO_PUBLIC_API_URL}/relations/get_pending_proposals`);
    },
    getMutualAthletes: async () => {
        return await API.get(`${process.env.EXPO_PUBLIC_API_URL}/relations/get_mutual_athletes`);
    }
};

export default RelationService;