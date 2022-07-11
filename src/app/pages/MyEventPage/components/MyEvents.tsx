import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Tabs } from 'antd';

import { translations } from 'locales/translations';
import { CreateButton, PageDescription, PageHeaderContainerSimple, PageHeading, PageInfoContainer } from 'app/components/SyrfGeneral';
import { EventList } from './EventList';
import { InvitedEventLists } from './InvitedEventsList';
import { getMyInvitedEvents } from 'services/live-data-server/participants';
import { AiFillPlusCircle } from 'react-icons/ai';
import { useHistory } from 'react-router-dom';
import { media } from 'styles/media';

export const MyEvents = () => {

    const { t } = useTranslation();

    const [numberOfInvitations, setNumberOfInvitation] = React.useState<number>(0);

    const history = useHistory();

    const getNumberOfInvitedEvents = async () => {
        const response = await getMyInvitedEvents(1);

        if (response.success) {
            setNumberOfInvitation(response.data.count);
        }
    }

    React.useEffect(() => {
        getNumberOfInvitedEvents();
    }, []);

    return (
        <Container>
            <PageHeaderContainerSimple style={{ 'alignSelf': 'flex-start', width: '100%', padding: '0px 12px' }}>
                <PageInfoContainer style={{ paddingRight: '8px' }}>
                    <PageHeading style={{ padding: '0px' }}>{t(translations.my_event_list_page.my_events)}</PageHeading>
                    <PageDescription style={{ padding: '0px' }}>{t(translations.my_event_list_page.events_are_regattas)}</PageDescription>
                </PageInfoContainer>
                <CreateButtonWrapper>
                    <CreateButton style={{ margin: '0px' }} onClick={() => history.push("/events/create")} icon={<AiFillPlusCircle
                        style={{ marginRight: '5px' }}
                        size={18} />}>{t(translations.my_event_list_page.create_a_new_event)}</CreateButton>
                </CreateButtonWrapper>
            </PageHeaderContainerSimple>
            <StyledTabs<React.ElementType> animated defaultActiveKey="1">
                <StyledTabs.TabPane tab={'Events'} key="1">
                    <EventList />
                </StyledTabs.TabPane>

                <StyledTabs.TabPane tab={<><div>{t(translations.my_event_list_page.invitations)} {numberOfInvitations > 0 && <NumberOfInvitationsDot>{numberOfInvitations}</NumberOfInvitationsDot>}</div></>} key="2">
                    <InvitedEventLists reloadInvitationCount={() => getNumberOfInvitedEvents()} />
                </StyledTabs.TabPane>
            </StyledTabs>
        </Container>
    )
}

const CreateButtonWrapper = styled.div`
    display: block;
    ${media.medium`
        display: none;
    `}
`;

const Container = styled.div`
    padding-top: 12px;
`;

const StyledTabs = styled(Tabs)`
  margin-bottom: 0;
  position: relative;
  width: 100%;

  .ant-tabs-tab {
    font-size: 22px;
  }
  .ant-tabs-tab:first-child {
    margin-left: 10px;
  }
`;

const NumberOfInvitationsDot = styled.div`
    display: inline-flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    background: #ff0000;
    color: #fff;
    font-size: 14px;
`;
