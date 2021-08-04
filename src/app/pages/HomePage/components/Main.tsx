import React from 'react';
import { Tabs, Button } from 'antd';
import { MapViewTab } from './MapViewTab/index';
import { FilterTab } from '../FilterTab';
import styled from 'styled-components';
import { AiFillPlusCircle } from 'react-icons/ai';
import { FiMap } from 'react-icons/fi';
import { BsListUl } from 'react-icons/bs';
import { isMobile } from 'utils/helpers';
import { selectIsAuthenticated } from 'app/pages/LoginPage/slice/selectors';
import { useSelector } from 'react-redux';

const { TabPane } = Tabs;

export const Main = () => {

    const isAuthenticated = useSelector(selectIsAuthenticated);

    return (
        <StyledTabs animated defaultActiveKey="1">
            <TabPane tab={<FiMap />} key="1">
                <MapViewTab />
            </TabPane>
            <TabPane tab={<BsListUl />} key="2">
                <FilterTab />
            </TabPane>
            {
                (isMobile() || !isAuthenticated) && <ButtonCreateContainer>
                    <Button
                        shape="round"
                        size={'large'}
                        icon={<AiFillPlusCircle
                            style={{ marginRight: '5px' }}
                            size={18} />}
                        type="primary">
                        Create
                    </Button>
                </ButtonCreateContainer>
            }
        </StyledTabs>
    )
}

const StyledTabs = styled(Tabs)`
    margin-bottom: 0;
    position: relative;

    .ant-tabs-tab {
        font-size: 22px;
    }
    .ant-tabs-tab:first-child {
        margin-left: 10px;
    }
`;

const ButtonCreateContainer = styled.div`
    position: absolute;
    right: 20px;
    top: 10px;
`;