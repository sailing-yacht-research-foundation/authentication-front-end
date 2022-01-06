import React from 'react';
import { Modal, Spin, Input, Button } from 'antd';
import { toast } from 'react-toastify';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { debounce, showToastMessageOnRequestError } from 'utils/helpers';
import { useSelector } from 'react-redux';
import { selectUser } from 'app/pages/LoginPage/slice/selectors';
import { getUserAttribute, renderAvatar } from 'utils/user-utils';
import styled from 'styled-components';
import { searchForProfiles } from 'services/live-data-server/profile';
import { Link } from 'react-router-dom';
import { inviteCompetitor } from 'services/live-data-server/event-calendars';
import { getAllByCalendarEventId } from 'services/live-data-server/participants';

export const CompetitorInviteModal = (props) => {

    const { t } = useTranslation();

    const { showModal, setShowModal, eventId } = props;

    const [isLoading, setIsLoading] = React.useState(false);

    const [results, setResults] = React.useState<any[]>([]);

    const participants = React.useRef<any[]>([]);

    const user = useSelector(selectUser);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debounceSearchPeople = React.useCallback(debounce((keyword) => onSearchPeople(keyword), 300), []);

    const hideAssignModal = () => {
        setShowModal(false);
    }

    const onSearchPeople = async (keyword) => {
        if (!keyword) {
            setResults([]);
            return;
        }

        getAllParticipants();

        setIsLoading(true);
        const response = await searchForProfiles(keyword, getUserAttribute(user, 'locale'));
        setIsLoading(false);

        if (!response.success) {
            showToastMessageOnRequestError(response.error);
        } else {
            setResults(response.data?.rows.filter(item => !participants.current.includes(item.id)));
        }
    }

    const updateResultList = (userProfileId) => {
        setResults(results.filter(profile => profile.id !== userProfileId));
    }

    const getAllParticipants = async () => {
        const response = await getAllByCalendarEventId(eventId, 1, 100);

        if (response.success) {
            participants.current = response.data?.rows?.map(participant => participant.userProfileId).filter(Boolean);
        }
    }

    return (
        <Modal
            title={t(translations.my_event_create_update_page.invite_competitors)}
            bodyStyle={{ display: 'flex', justifyContent: 'center', overflow: 'hidden', flexDirection: 'column' }}
            visible={showModal}
            footer={null}
            onCancel={hideAssignModal}
        >
            <Spin spinning={isLoading}>
                <Input.Search allowClear onSearch={debounceSearchPeople} placeholder={t(translations.my_event_create_update_page.search_for_competitors)} />
                <ResultContainer>
                    {results.map((profile, index) => {
                        return <PeopleResultItem onInvited={updateResultList} key={index} profile={profile} eventId={eventId} />
                    })}
                </ResultContainer>
            </Spin>
        </Modal>
    )
}

const PeopleResultItem = ({ profile, eventId, onInvited }) => {

    const { t } = useTranslation();

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const renderActionButton = (profile) => {
        return <Spin spinning={isLoading}>
            <InviteButton onClick={() => inviteUser(profile)} type="primary">{t(translations.participant_list.invite)}</InviteButton>
        </Spin>;
    }

    const inviteUser = async (profile) => {
        setIsLoading(true);
        const response = await inviteCompetitor(eventId, profile.name, profile.id);
        setIsLoading(false);

        if (response.success) {
            if (response.data[0].success) {
                toast.success(t(translations.participant_list.successfully_invited_user));
                onInvited(profile.id);
            } else {
                toast.info(t(translations.participant_list.there_is_error_happended_when_inviting_this_user));
            }
        } else {
            showToastMessageOnRequestError(response.error);
        }
    }

    return (<PeopleItem>
        <PeopleInnerWrapper>
            <PeopleAvatar>
                <img alt={profile.name} src={renderAvatar(profile.avatar)} className="avatar-img" />
            </PeopleAvatar>
            <PeopleInfo>
                <PeopleName to={`/profile/${profile.id}`}>{profile.name}</PeopleName>
            </PeopleInfo>
        </PeopleInnerWrapper>
        <ButtonOutter>{renderActionButton(profile)}</ButtonOutter>
    </PeopleItem>)
}

const ResultContainer = styled.div`
    margin-top: 25px;
`;

const PeopleItem = styled.div`
    display: flex;
    align-items: center;
    text-align: left;
    &:not(:last-child) {
       padding-bottom: 10px;
       margin-bottom: 20px;
       border-bottom: 1px solid #eee;
    }
    overflow: hidden;
`;

const PeopleInfo = styled.div`
    margin-left: 15px;
`;

const PeopleAvatar = styled.div`
    width: 45px;
    height: 45px;
`;

const PeopleName = styled(Link)`
    display: block;
`;

const InviteButton = styled(Button)``;

const PeopleInnerWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    flex: 0 0 auto;
`;

const ButtonOutter = styled.div`
    margin-left: auto;
`;