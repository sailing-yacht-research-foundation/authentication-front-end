import { Modal } from 'antd';
import { selectIsAuthenticated, selectUser } from 'app/pages/LoginPage/slice/selectors';
import { translations } from 'locales/translations';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useTour } from '@reactour/tour';
import styled from 'styled-components';
import { getUserAttribute } from 'utils/user-utils';
import { updateProfile } from 'services/live-data-server/user';
import { UseLoginSlice } from 'app/pages/LoginPage/slice';
import { useHistory } from 'react-router';

export const TutorialModal = React.forwardRef((props, ref) => {

    const { t } = useTranslation();

    const user = useSelector(selectUser);

    const { setIsOpen, currentStep } = useTour();

    const isAuthenticated = useSelector(selectIsAuthenticated);

    const [showModal, setShowModal] = React.useState<boolean>(false);

    const { actions } = UseLoginSlice();

    const dispatch = useDispatch();

    const history = useHistory();

    const showTour = () => {
        history.push('/');
        setIsOpen(true);
        setShowModal(false);
    }

    const updateTourAttribute = async (showuserTour: boolean) => {
        if (isAuthenticated && user.attributes) {
            const userData = {
                firstName: user.firstName,
                lastName: user.lastName,
                attributes: {
                    picture: getUserAttribute(user, 'picture'),
                    language: getUserAttribute(user, 'language'),
                    locale: getUserAttribute(user, 'locale'),
                    bio: getUserAttribute(user, 'bio'),
                    sailing_number: getUserAttribute(user, 'sailing_number'),
                    birthdate: getUserAttribute(user, 'birthdate'),
                    address: getUserAttribute(user, 'address'),
                    phone_number: getUserAttribute(user, 'phone_number'),
                    showed_tour: showuserTour
                }
            }
            await updateProfile(userData);
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
        if (currentStep === 3) {
            history.push('/events/create');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentStep]);

    React.useEffect(() => {
        if (user.attributes && isAuthenticated && (
            !getUserAttribute(user, 'showed_tour') ||
            getUserAttribute(user, 'showed_tour') === 'false'
        )) {
            setShowModal(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    return (
        <Modal
            title={t(translations.misc.want_to_take_a_quick_tour)}
            visible={showModal}
            onOk={() => {
                showTour();
            }}
            onCancel={() => {
                dismissTour();
            }}>
            <ModalMessage>{t(translations.misc.look_like_you_are_new, { username: user.firstName + ' ' + user.lastName })}</ModalMessage>
        </Modal>
    )
});

const ModalMessage = styled.div`
    margin: 0 5px;
    margin-bottom: 15px;
`;