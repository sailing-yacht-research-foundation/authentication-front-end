import React from 'react';
import styled from 'styled-components';
import { getTopRecommandation } from 'services/live-data-server/profile';
import { getUserAttribute } from 'utils/user-utils';
import { useSelector } from 'react-redux';
import { selectUser } from 'app/pages/LoginPage/slice/selectors';
import { ProfileItemWithFollowButton } from './ProfileItemWithFollowButton';

export const PeopleYouMayKnow = () => {

    const user = useSelector(selectUser);

    const [recommendations, setRecommendation] = React.useState<any>([]);

    const currentUserId = localStorage.getItem('user_id');

    const getRecommandedProfiles = async () => {
        const response = await getTopRecommandation(getUserAttribute(user, 'locale'));

        if (response.success) {
            const profiles = response.data?.rows.filter(profile => currentUserId !== profile.id);
            setRecommendation(profiles);
        }
    }

    React.useEffect(() => {
        if (user) {
            getRecommandedProfiles();
        }
    }, [user]);

    const renderRecommendedProfiles = () => {
        return recommendations.map(profile => {
            return <ProfileItemWithFollowButton profile={profile} />
        });
    }

    return (
        <>
            {recommendations.length > 0 && <Wrapper>
                <Title>People you may know</Title>
                <PeopleList>
                    {renderRecommendedProfiles()}
                </PeopleList>
            </Wrapper>
            }

        </>
    );
}

const Wrapper = styled.div`
    flex: .3;
    margin-left: 15px;
    padding: 10px;
`;

const Title = styled.h3`
    margin-top: 30px;
`;

const PeopleList = styled.div`
    margin-top: 15px;
`;