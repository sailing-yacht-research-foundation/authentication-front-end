import { Button, Col, Row } from 'antd';
import { translations } from 'locales/translations';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { selectUser } from '../LoginPage/slice/selectors';
import { ChangeEmailModal } from './Modals/ChangeEmailModal';
import { ChangePasswordModal } from './Modals/ChangePasswordModal';
import { StyledSyrfFormWrapper } from './Settings';

export const EmailSetting = () => {

    const { t } = useTranslation();

    const authUser = useSelector(selectUser);

    const [isShowingChangePasswordModal, setIsShowingChangePasswordModal] = React.useState<boolean>(false);
    const [isShowingChangeEmailModal, setIsShowingChangeEmailModal] = React.useState<boolean>(false);

    return (
        <StyledSyrfFormWrapper>
            <ChangePasswordModal visible={isShowingChangePasswordModal} hideModal={() => setIsShowingChangePasswordModal(false)} />
            <ChangeEmailModal visible={isShowingChangeEmailModal} hideModal={() => setIsShowingChangeEmailModal(false)} />
            <Row gutter={12}>
                <Col span={8}>
                    {t(translations.settings_page.email)}
                </Col>
                <Col span={8}>
                    {authUser.email}
                </Col>
                <StyledColumnRightAlign span={8}>
                    <Button onClick={() => setIsShowingChangeEmailModal(true)} type='link'>{t(translations.settings_page.change)}</Button>
                </StyledColumnRightAlign>
            </Row>

            <Row gutter={12} style={{ marginTop: '15px' }}>
                <Col span={8}>
                    {t(translations.settings_page.password)}
                </Col>
                <Col span={8}>
                    ●●●●●●●●●●●●●●
                </Col>
                <StyledColumnRightAlign span={8}>
                    <Button onClick={() => setIsShowingChangePasswordModal(true)} type='link'>{t(translations.settings_page.change)}</Button>
                </StyledColumnRightAlign>
            </Row>
        </StyledSyrfFormWrapper>
    );
}

const StyledColumnRightAlign = styled(Col)`
    text-align: right;
`;