import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { AiFillPlusCircle } from 'react-icons/ai';
import { useHistory } from 'react-router';
import { Tabs } from 'antd';

import { translations } from 'locales/translations';
import { CreateButton, PageDescription, PageHeaderContainerSimple, PageHeading, PageInfoContainer } from 'app/components/SyrfGeneral';
import { EventList } from './EventList';
import { InvitedEventLists } from './InvitedEventsList';

export const MyEvents = () => {

    const { t } = useTranslation();
    const history = useHistory();

    return (
        <Container>
            <PageHeaderContainerSimple style={{ 'alignSelf': 'flex-start', width: '100%', padding: '0px 15px' }}>
                <PageInfoContainer style={{ paddingRight: '8px' }}>
                    <PageHeading style={{ padding: '0px', marginBottom: '4px' }}>{t(translations.my_event_list_page.my_events)}</PageHeading>
                    <PageDescription style={{ padding: '0px', marginBottom: '8px' }}>{t(translations.my_event_list_page.events_are_regattas)}</PageDescription>
                </PageInfoContainer>
                <div>
                    <CreateButton style={{ margin: '0px' }} onClick={() => history.push("/events/create")} icon={<AiFillPlusCircle
                        style={{ marginRight: '5px' }}
                        size={18} />}>{t(translations.my_event_list_page.create_a_new_event)}</CreateButton>
                </div>
            </PageHeaderContainerSimple>
            <StyledTabs<React.ElementType> animated defaultActiveKey="1">
                <StyledTabs.TabPane tab={'Events'} key="1">
                    <EventList />
                </StyledTabs.TabPane>

                <StyledTabs.TabPane tab={<><div>Invited Events <span style={{ display:'inline-flex', justifyContent: 'center', alignItems: 'center', borderRadius: '50%', width:'25px', height: '25px', background: '#ff0000', color: '#fff'}}>5</span></div></>} key="2">
                    <InvitedEventLists />
                </StyledTabs.TabPane>
            </StyledTabs>

        </Container>
    )
}

const Container = styled.div`
    padding: 24px 0px;
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
