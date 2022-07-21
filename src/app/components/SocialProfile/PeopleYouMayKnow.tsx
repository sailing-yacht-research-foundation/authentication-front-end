import React from 'react';

import { getHotRecommandation, getTopRecommandation } from 'services/live-data-server/profile';
import { getUserAttribute } from 'utils/user-utils';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from 'app/pages/LoginPage/slice/selectors';
import { UserFollowerFollowingRow } from 'app/components/SocialProfile/UserFollowerFollowingRow';
import { InfluencerModal } from './InfluencerModal';
import { PeopleYouMayKnowModal } from './PeopleYouMayKnowModal';
import { usePublicProfileSlice } from 'app/pages/PublicProfilePage/slice';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { localesList } from 'utils/languages-util';
import { FollowerType } from 'utils/constants';
import { Title, TitleWrapper, PeopleList, SeeMore } from './social-style';

export const PeopleYouMayKnow = () => {

    const user = useSelector(selectUser);

    const [recommendations, setRecommendation] = React.useState<any>([]);

    const [influencers, setInfluencers] = React.useState<any[]>([]);

    const currentUserId = localStorage.getItem('user_id');

    const [showInfluencerModal, setShowInfluencerModal] = React.useState<boolean>(false);

    const [showPeopleYouMayKnowModal, setShowPeopleYouMayKnowModal] = React.useState<boolean>(false);

    const dispatch = useDispatch();

    const { t } = useTranslation();

    const { actions } = usePublicProfileSlice();

    const userCountry = localesList[user?.country?.toUpperCase()];

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
        return influencers.map(profile => {
            return <UserFollowerFollowingRow type={FollowerType.INFLUENCER} key={profile.id} profile={profile} profileId={profile.id} />
        });
    }

    React.useEffect(() => {
        if (user?.attributes) {
            getRecommandedProfiles();
            getInfluencers();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const reloadCurrentListAndUserFollowersFollowings = () => {
        getRecommandedProfiles();
        getInfluencers();
        dispatch(actions.getFollowers({ profileId: currentUserId, page: 1 }));
        dispatch(actions.getFollowing({ profileId: currentUserId, page: 1 }));
    }

    const renderRecommendedProfiles = () => {
        return recommendations.map(profile => {
            return <UserFollowerFollowingRow key={profile.id} reloadParentList={reloadCurrentListAndUserFollowersFollowings} profile={profile} profileId={profile.id} />
        });
    }

    return (
        <>
            <InfluencerModal showModal={showInfluencerModal} setShowModal={setShowInfluencerModal} />
            <PeopleYouMayKnowModal showModal={showPeopleYouMayKnowModal} setShowModal={setShowPeopleYouMayKnowModal} />
            {recommendations.length > 0 &&
                <>
                    <TitleWrapper>
                        <Title>{t(translations.public_profile.most_popular_accounts_in_country, { country: userCountry || '' })}</Title>
                        <SeeMore onClick={() => setShowPeopleYouMayKnowModal(true)}>{t(translations.public_profile.see_more)}</SeeMore>
                    </TitleWrapper>
                    <PeopleList>
                        {renderRecommendedProfiles()}
                    </PeopleList>
                </>
            }

            {influencers.length > 0 &&
                <>
                    <TitleWrapper>
                        <Title>{t(translations.public_profile.trending_accounts_in_country, { country: userCountry || '' })}</Title>
                        <SeeMore onClick={() => setShowInfluencerModal(true)}>{t(translations.public_profile.see_more)}</SeeMore>
                    </TitleWrapper>
                    <PeopleList>
                        {renderInfluencers()}
                    </PeopleList>
                </>
            }
        </>
    );
}
