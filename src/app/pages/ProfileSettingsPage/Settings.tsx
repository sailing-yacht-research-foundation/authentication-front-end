import React from 'react';
import styled from 'styled-components';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { ProfileTabs } from '../ProfilePage/components/ProfileTabs';
import { Collapse } from 'antd';
import { media } from 'styles/media';
import { NotificationSettings } from './NotificationSettings';
import { DeveloperOptionSetting } from './DeveloperOptionSetting';
import { SyrfFormWrapper } from 'app/components/SyrfForm';

export const Settings = () => {

    const { t } = useTranslation();

    return (
        <Wrapper>
            <ProfileTabs />
            <StyledCollapsed>
                <StyledCollapsedPanel header={t(translations.profile_page.update_profile.notifications)} key="1">
                    <NotificationSettings/>
                </StyledCollapsedPanel>
                <StyledCollapsedPanel header={t(translations.profile_page.update_profile.developer_option)} key="2">
                    <DeveloperOptionSetting/>
                </StyledCollapsedPanel>
            </StyledCollapsed>
        </Wrapper>
    )
}

export const StyledSyrfFormWrapper = styled(SyrfFormWrapper)`
    width: 100% !important;
`;

const StyledCollapsedPanel = styled(Collapse.Panel)`
    background: #fff;
    padding: 10px 5px;

    ${media.medium`
        padding: 30px 20px;
    `};
`;

const StyledCollapsed = styled(Collapse)`
    width: 100%;
    border: none;
    background: transparent;
    margin-top: 30px;

    .ant-collapse-header {
        font-weight: bold;
        font-size: 20px;
    }

    .ant-collapse-content {
        border: none;
    }

    ${media.medium`
    width: 65%;
    padding: 30px 56px;
`}
`;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 132px;
    align-items: center;
    width: 100%;
    position: relative;
    padding-bottom: 50px;

    .ant-form-item-control-input {
        text-align: right;
    }

    .ant-form  {
        .ant-form-item {
            .ant-form-item-control {
                flex: 1 1 !important;
            }
            .ant-form-item-label {
                flex: 1 1 !important;
                label {
                    line-height: 1.5em !important;
                }
            }
        }
    }

    ${media.large`
        .ant-form-item-control-input {
            text-align: none;
        }

        .ant-form  {
            .ant-form-item {
                .ant-form-item-control {
                    flex: 1 1 !important;
                }
                .ant-form-item-label {
                   text-align: left;
                   flex: none !important;
                }
            }
        }
    `};
`;
