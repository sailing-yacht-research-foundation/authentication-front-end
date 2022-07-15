import { Modal } from 'antd';
import { selectIsAuthenticated, selectUser } from 'app/pages/LoginPage/slice/selectors';
import { translations } from 'locales/translations';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useTour } from '@reactour/tour';
import styled from 'styled-components';
import { getUserAttribute, getUserName } from 'utils/user-utils';
import { updateUserSpecificAttributes } from 'services/live-data-server/user';
import { UseLoginSlice } from 'app/pages/LoginPage/slice';
import { useHistory } from 'react-router';
import { isMobile } from 'react-device-detect';
import { useSiderSlice } from '../SiderContent/slice';

const tourStepNavigation = [
    '/',
    '/events/create',
    '/tracks',
    'events',
    '/groups',
    '/boats',
    '/profile/search',
    '/account',
    '/notifications',
]

export const TutorialModal = React.forwardRef<any, any>((props, ref) => {

    const { t } = useTranslation();

    const user = useSelector(selectUser);

    const { setIsOpen, currentStep } = useTour();

    const isAuthenticated = useSelector(selectIsAuthenticated);

    const [showModal, setShowModal] = React.useState<boolean>(false);

    const { actions } = UseLoginSlice();

    const siderActions = useSiderSlice().actions;

    const dispatch = useDispatch();

    const history = useHistory();

    const showTour = () => {
        setIsOpen(true);
        setShowModal(false);
    }

    const toggleSider = (toggled) => {
        if (isMobile) {
            dispatch(siderActions.setIsToggled(toggled));
        }
    }

    const updateTourAttribute = async (showuserTour: boolean) => {
        if (isAuthenticated && user.attributes) {
            const userData = {
                attributes: {
                    showed_tour: showuserTour
                }
            }
            await updateUserSpecificAttributes(userData);
            dispatch(actions.getUser());
        }
    }

    const dismissTour = () => {
        setShowModal(false);
        updateTourAttribute(true);
    }

    React.useImperativeHandle(ref, () => ({
        dismissTour() {
            dismissTour();
        }
    }));

    React.useEffect(() => {
        if (currentStep >= 1) {
            if (currentStep == 1 && isMobile) {
                history.push('/');
            } else {
                history.push(tourStepNavigation[currentStep]);
            }

            if (currentStep === 8 || currentStep == 0) { // notifications and search hide the sider.
                toggleSider(false);
            } else {
                toggleSider(true);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentStep]);

    React.useEffect(() => {
        // if (user.attributes && isAuthenticated && (
        //     !getUserAttribute(user, 'showed_tour') ||
        //     getUserAttribute(user, 'showed_tour') === 'false'
        // )) {
            history.push('/');
            setShowModal(true);
        // }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    return (
        <Modal
            title={t(translations.misc.want_to_take_a_quick_tour)}
            visible={showModal}
            onOk={showTour}
            onCancel={dismissTour}>
            <ModalMessage>{t(translations.misc.look_like_you_are_new, { username: getUserName(user) })}</ModalMessage>
        </Modal>
    )
});

const ModalMessage = styled.div`
    margin: 0 5px;
    margin-bottom: 15px;
`;
