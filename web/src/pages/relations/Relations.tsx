import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RelationService from "../../services/RelationService";
import UserDisplay from "../../common/components/display/UserDisplay";
import RelationActionButton from "../../common/components/display/RelationActionButton";
import { RelationStatus } from "../../common/constants/Enums";
import SearchBar from "../../common/components/SearchBar";
import TrackmeButton from "../../common/components/TrackmeButton";

const Relations = () => {
    // currentUsers: list of users as arrays [id, name, …, status]
    // searchTerm: current text in the search bar
    // loading: whether we’re waiting on a network response
    const [currentUsers, setCurrentUsers] = useState<string[][]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [pendingProposals, setPendingProposals] = useState<number>(0);

    const navigate = useNavigate();

    // Fetch initial relations once on mount
    useEffect(() => {
        const fetchRelations = async () => {
            const resp = await RelationService.searchUserRelation();
            if (resp.ok) {
                const data = await resp.json();
                setCurrentUsers(data);
            } else {
                setCurrentUsers([]);
            }
        };
        const fetchPendingProposals = async () => {
            const resp = await RelationService.getRelationInvitesCount();
            if (resp.ok) {
                const data = await resp.json();
                setPendingProposals(data.count);
            } else {
                setPendingProposals(0);
            }
        };
        fetchPendingProposals();
        fetchRelations();
    },[]);

    // Search by term, update list & loading state
    const handleSearch = async (term: string) => {
        const resp = await RelationService.searchUserRelation(term);
        if (resp.ok) {
            setCurrentUsers(await resp.json());
        } else {
            setCurrentUsers([]);
        }
        setSearchTerm(term);
    };

    // Add a relation then refresh list
    const handleAddRelation = async (relationId: string) => {
        const resp = await RelationService.addRelation(relationId);
        if (resp.ok) {
            setCurrentUsers((prevUsers) =>{
                return prevUsers.map(user => {
                    if (user[0] === relationId) {
                        if(user[6] === RelationStatus.AwaitingResponse){
                            return [...user.slice(0, 5), RelationStatus.Added];
                        }
                        return [...user.slice(0, 5), RelationStatus.Pending];
                    }
                    return user;
                });
            });
        }
    };

    // Remove a relation then refresh list
    const handleRelationRemoval = async (relationId: string) => {
        const resp = await RelationService.removeRelation(relationId);
        if (resp.ok) {
            setCurrentUsers((prevUsers) =>
                prevUsers.map(user => user[0] === relationId ? [...user.slice(0, 5), RelationStatus.NotAdded] : user
            ));
        }
    };
    return(
        <div className="max-w-5xl mx-auto pt-4">
            <div className="flex justify-between items-center mb-4 px-2">
                <TrackmeButton onClick={() => navigate('relation-invites')}>Invites ({pendingProposals})</TrackmeButton>
                <TrackmeButton onClick={() => navigate('friends')}>Friends</TrackmeButton>
            </div>
            <SearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                handleSearch={handleSearch}
                placeholder="Search friends..."
            />
            {currentUsers.map(([id, username, firstName, lastName, _, status]) => (
                <div key={id} className="flex flex-row justify-between items-center p-4 border-b">
                    <UserDisplay username={username} firstName={firstName} lastName={lastName} />
                    <RelationActionButton
                        relationStatus={status as RelationStatus}
                        relationId={id}
                        handleAddRelation={handleAddRelation}
                        handleRelationRemoval={handleRelationRemoval}
                    />
                </div>
            ))}
        </div>
    );
}

export default Relations;