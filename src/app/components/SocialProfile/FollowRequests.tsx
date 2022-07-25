import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { useSocialSlice } from './slice';
import { FollowRequestModal } from './FollowRequestModal';
import { selectPagination } from './slice/selector';
import { RequestItem } from './RequestItem';
import { Title, TitleWrapper, PeopleList, SeeMore } from './social-style';

export const FollowRequests = () => {
    const { t } = useTranslation();

    const { actions } = useSocialSlice();

    const pagination = useSelector(selectPagination);

    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(actions.getFollowRequests({ page: 1, size: 10 }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const renderFollowRequests = () => {
        if (pagination.rows.length > 0)
            return pagination.rows.map(request => <RequestItem key={request.id} reloadParentList={() => dispatch(actions.getFollowRequests({ page: 1, size: 10 }))} request={request} />);
        return <span>{t(translations.public_profile.you_dont_have_any_follow_requests)}</span>
    }

    return (
        <>
            <FollowRequestModal />
            {pagination.rows.length > 0 &&
                <>
                    <TitleWrapper>
                        <Title>{t(translations.public_profile.pending_follow_requests)}</Title>
                        {pagination.total > 10 && <SeeMore onClick={() => dispatch(actions.setShowFollowRequestModal(true))}>{t(translations.public_profile.see_more)}</SeeMore>}
                    </TitleWrapper>
                    <PeopleList>
                        {renderFollowRequests()}
                    </PeopleList>
                </>
            }
        </>
    );
}
