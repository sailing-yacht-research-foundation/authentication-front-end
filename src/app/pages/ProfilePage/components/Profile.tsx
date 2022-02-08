import React from 'react';
import styled from 'styled-components';
import { UpdateInfo } from './UpdateInfoForm/index';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from 'app/pages/LoginPage/slice/selectors';
import { loginActions } from 'app/pages/LoginPage/slice';
import { ProfileTabs } from './ProfileTabs';
import { DeleteUserModal } from './DeleteUserModal';
import { SyrfButtonDescription, SyrfButtonTitle, SyrfFormTitle, SyrfFormWrapper } from 'app/components/SyrfForm';
import { Row, Col, Button } from 'antd';
import { media } from 'styles/media';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import ReactTooltip from 'react-tooltip';

export const Profile = () => {

    const [showDeleteUserModal, setShowDeleteUserModal] = React.useState<boolean>(false);

    const authUser = useSelector(selectUser);

    const dispatch = useDispatch();

    const { t } = useTranslation();

    const cancelUpdateProfile = () => {
        getAuthorizedAuthUser();
    }

    const getAuthorizedAuthUser = async () => {
        dispatch(loginActions.getUser());
    }

    return (
        <Wrapper>
            <DeleteUserModal
                showDeleteUserModal={showDeleteUserModal}
                setShowDeleteUserModal={setShowDeleteUserModal}
                authUser={authUser}
            />
            <ProfileTabs />
            { authUser.username && <UpdateInfo cancelUpdateProfile={cancelUpdateProfile} authUser={authUser} /> }
            <SyrfFormWrapper className="danger-zone">
                <SyrfFormTitle>{t(translations.profile_page.update_profile.danger_zone)}</SyrfFormTitle>
                <Row gutter={24}>
                    <Col xs={21} sm={24} md={12} lg={12}>
                        <SyrfButtonTitle>{t(translations.profile_page.update_profile.delete_my_account)}</SyrfButtonTitle>
                        <SyrfButtonDescription>{t(translations.profile_page.update_profile.you_will_delete_your_account_along_with_all_associated_information)}</SyrfButtonDescription>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12}>
                        <DeleteAccountButtonWrapper>
                            <Button data-tip={t(translations.tip.delete_account)} danger onClick={() => setShowDeleteUserModal(true)}>
                                {t(translations.profile_page.update_profile.permantly_delete_my_account)}
                            </Button>
                        </DeleteAccountButtonWrapper>
                    </Col>
                </Row>
            </SyrfFormWrapper>
            <ReactTooltip/>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 132px;
    align-items: center;
    width: 100%;
    position: relative;
    padding-bottom: 50px;
`;

const DeleteAccountButtonWrapper = styled.div`
    text-align: center;
    margin-top: 20px;

    > a { color: red; }

    ${media.medium`
        margin-top: 0;
    `}
`;