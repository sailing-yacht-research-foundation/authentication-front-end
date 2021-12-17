import React from 'react';
import styled from 'styled-components';
import { getHotRecommandation, getTopRecommandation } from 'services/live-data-server/profile';
import { getUserAttribute } from 'utils/user-utils';
import { useSelector } from 'react-redux';
import { selectUser } from 'app/pages/LoginPage/slice/selectors';
import { UserFollowerFollowingRow } from 'app/components/UserFollowerFollowingRow';
import { InfluencerModal } from './InfluencerModal';
import { PeopleYouMayKnowModal } from './PeopleYouMayKnowModal';

export const PeopleYouMayKnow = () => {

    const user = useSelector(selectUser);

    const [recommendations, setRecommendation] = React.useState<any>([]);

    const [influencers, setInfluencers] = React.useState<any[]>([]);

    const currentUserId = localStorage.getItem('user_id');

    const [showInfluencerModal, setShowInfluencerModal] = React.useState<boolean>(false);

    const [showPeopleYouMayKnowModal, setShowPeopleYouMayKnowModal] = React.useState<boolean>(false);

    const getRecommandedProfiles = async () => {
        const response = await getTopRecommandation({ locale: getUserAttribute(user, 'locale'), page: 1, size: 4 });

        if (response.success) {
            const profiles = response.data?.rows.filter(profile => currentUserId !== profile.id);
            setRecommendation(profiles);
        }
    }

    const getInfluencers = async () => {
        const response = await getHotRecommandation({ locale: getUserAttribute(user, 'locale'), page: 1, size: 4 });

        if (response.success) {
            const profiles = response.data?.rows.filter(profile => currentUserId !== profile.id);
            setInfluencers(profiles);
        }
    }

    const renderInfluencers = () => {
        return recommendations.map(profile => {
            return <UserFollowerFollowingRow profile={profile} profileId={profile.id} />
        });
    }

    React.useEffect(() => {
        if (user) {
            getRecommandedProfiles();
            getInfluencers();
        }
    }, [user]);

    const renderRecommendedProfiles = () => {
        return recommendations.map(profile => {
            return <UserFollowerFollowingRow profile={profile} profileId={profile.id} />
        });
    }

    return (
        <Wrapper>
            <InfluencerModal showModal={showInfluencerModal} setShowModal={setShowInfluencerModal} />
            <PeopleYouMayKnowModal showModal={showPeopleYouMayKnowModal} setShowModal={setShowPeopleYouMayKnowModal} />
            {recommendations.length > 0 &&
                <>
                    <TitleWrapper>
                        <Title>People you may know</Title>
                        <SeeMore onClick={() => setShowPeopleYouMayKnowModal(true)}>See more</SeeMore>
                    </TitleWrapper>
                    <PeopleList>
                        {renderRecommendedProfiles()}
                    </PeopleList>
                </>
            }

            {influencers.length > 0 &&
                <>
                    <TitleWrapper>
                        <Title>Top influencers</Title>
                        <SeeMore onClick={() => setShowInfluencerModal(true)}>See more</SeeMore>
                    </TitleWrapper>
                    <PeopleList>
                        {renderInfluencers()}
                    </PeopleList>
                </>
            }
        </Wrapper>
    );
}

const Wrapper = styled.div`
    flex: .3;
    margin-left: 15px;
    padding: 10px;
`;

const TitleWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 30px;
`;

const Title = styled.h3`
    margin: 0;
`;

const PeopleList = styled.div`
    margin-top: 15px;
`;

const SeeMore = styled.a`
    color: #40a9ff;
`;