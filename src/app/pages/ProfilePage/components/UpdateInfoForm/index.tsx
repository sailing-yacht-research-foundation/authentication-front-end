import 'react-phone-input-2/lib/style.css';

import React, { useState } from 'react';
import { Form, Spin } from 'antd';
import moment from 'moment';
import styled from 'styled-components';
import { getUserAttribute, getUserInterestsAsArray } from 'utils/user-utils';
import { SyrfFormButton, SyrfFormWrapper } from 'app/components/SyrfForm';
import { removePlusFromPhoneNumber, replaceObjectPropertiesFromNullToEmptyString, showToastMessageOnRequestError } from 'utils/helpers';
import { PrivateUserInformation } from './PrivateUserInformation';
import { toast } from 'react-toastify';
import { PublicUserInformation } from './PublicUserInformation';
import { EditEmailChangeModal } from './EditEmailChangeModal';
import { media } from 'styles/media';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { updateInterests, updateProfile } from 'services/live-data-server/user';
import { TIME_FORMAT } from 'utils/constants';
import { ShareableInformation } from './ShareableInformation';

const defaultFormFields = {
    email: '',
    name: '',
    phone_number: '',
    sailing_number: '',
    birthdate: '',
    language: '',
    country: '',
};

export const UpdateInfo = (props) => {
    const [isUpdatingProfile, setIsUpdatingProfile] = useState<boolean>(false);

    const { authUser } = props;

    const [address, setAddress] = React.useState<string>(getUserAttribute(authUser, 'address') || '');

    const [showEmailChangeAlertModal, setShowEmailChangeAlertModal] = React.useState<boolean>(false);

    const [form] = Form.useForm();

    const [formHasBeenChanged, setFormHasBeenChanged] = React.useState<boolean>(false);

    const { t } = useTranslation();

    // for storing fields filled by user from the form for later use when
    // user still chooses to change the email.
    const [formFieldsBeforeUpdate, setFormFieldsBeforeUpdate] = React.useState(defaultFormFields);

    const onFinish = (values) => {
        values = replaceObjectPropertiesFromNullToEmptyString(values);
        updateUserInfo(values);
    }

    const updateUserInfo = async ({
        phone_number,
        sailing_number,
        birthdate,
        language,
        country,
        bio,
        first_name,
        last_name,
        isPrivate,
        interests
    }) => {

        setIsUpdatingProfile(true);

        const response: any = await updateProfile({
            firstName: first_name,
            lastName: last_name,
            attributes: {
                language: language,
                locale: country,
                bio: bio,
                sailing_number: sailing_number,
                birthdate: birthdate ? birthdate.format(TIME_FORMAT.number) : moment('2002-01-01').format(TIME_FORMAT.number),
                address: address,
                phone_number: phone_number ? removePlusFromPhoneNumber(phone_number) : '',
                picture: getUserAttribute(authUser, 'picture'),
                showed_tour: getUserAttribute(authUser, 'showed_tour'),
            },
            isPrivate: !!isPrivate
        });

        if (response.success) {
            const interestResponse = await updateInterests(interestsArrayToObject(interests));
            if (!interestResponse.success) {
                showToastMessageOnRequestError(interestResponse.error);
            }
            onUpdateProfileSuccess();
        } else {
            showToastMessageOnRequestError(response.error);
            setIsUpdatingProfile(false);
            setFormFieldsBeforeUpdate(defaultFormFields);
        }
    }

    const onUpdateProfileSuccess = () => {
        setIsUpdatingProfile(false);
        toast.success(t(translations.profile_page.update_profile.your_profile_has_been_successfully_updated));
        props.cancelUpdateProfile();
        setFormFieldsBeforeUpdate(defaultFormFields);
        setFormHasBeenChanged(false);
    }

    const interestsArrayToObject = (interestsArray) => {
        return {
            "HANDICAP": interestsArray.includes('HANDICAP'),
            "ONEDESIGN": interestsArray.includes('ONEDESIGN'),
            "KITESURFING": interestsArray.includes('KITESURFING'),
            "WINGING": interestsArray.includes('WINGING'),
            "WINDSURFING": interestsArray.includes('WINDSURFING'),
            "CRUISING": interestsArray.includes('CRUISING')
        }
    }

    return (
        <Wrapper>
            <EditEmailChangeModal
                formFieldsBeforeUpdate={formFieldsBeforeUpdate}
                defaultFormFields={defaultFormFields}
                authUser={authUser}
                form={form}
                updateUserInfo={updateUserInfo}
                setShowEmailChangeAlertModal={setShowEmailChangeAlertModal}
                setFormFieldsBeforeUpdate={setFormFieldsBeforeUpdate}
                showEmailChangeAlertModal={showEmailChangeAlertModal}
            />
            <SyrfFormWrapper className="no-background">
                <Spin spinning={isUpdatingProfile} tip={t(translations.profile_page.update_profile.updating_your_profile)}>
                    <Form
                        onValuesChange={() => setFormHasBeenChanged(true)}
                        form={form}
                        layout="vertical"
                        name="basic"
                        initialValues={{
                            email: authUser.email,
                            last_name: authUser.lastName,
                            first_name: authUser.firstName,
                            bio: getUserAttribute(authUser, 'bio'),
                            phone_number: getUserAttribute(authUser, 'phone_number'),
                            address: getUserAttribute(authUser, 'address'),
                            birthdate: !!getUserAttribute(authUser, 'birthdate') ? moment(getUserAttribute(authUser, 'birthdate')) : moment('2002-01-01 00:00:00').utcOffset('+0000'),
                            sailing_number: getUserAttribute(authUser, 'sailing_number'),
                            facebook: getUserAttribute(authUser, 'facebook'),
                            instagram: getUserAttribute(authUser, 'instagram'),
                            twitter: getUserAttribute(authUser, 'twitter'),
                            language: getUserAttribute(authUser, 'language'),
                            country: getUserAttribute(authUser, 'locale'),
                            isPrivate: authUser.isPrivate,
                            interests: getUserInterestsAsArray(authUser)
                        }}
                        onFinish={onFinish}
                    >
                        <PublicUserInformation
                            authUser={authUser}
                            cancelUpdateProfile={props.cancelUpdateProfile} />

                        <PrivateUserInformation
                            address={address} setAddress={setAddress}
                            authUser={authUser} />

                        <ShareableInformation/>

                        <Form.Item>
                            <StyledSyrfFormButtonWrapper>
                                <SyrfFormButton disabled={!formHasBeenChanged} type="primary" htmlType="submit">
                                    {t(translations.profile_page.update_profile.save)}
                                </SyrfFormButton>
                            </StyledSyrfFormButtonWrapper>
                        </Form.Item>
                    </Form>
                    <DisclaimerText>{t(translations.profile_page.update_profile.your_personal_details_will_never_be_shared_with_3rd_party_app)}</DisclaimerText>
                </Spin >
            </SyrfFormWrapper >
        </Wrapper >
    )
}

const Wrapper = styled.div`
    margin-top: 50px;
    width: 100%;
    display:flex;
    justify-content: center;
`;

const DisclaimerText = styled.div`
    font-size: 13px;
    padding: 0 15px;

    ${media.medium`
        padding: 0;
    `}
`;

const StyledSyrfFormButtonWrapper = styled.div`
    padding: 0 15px;

    ${media.medium`
        padding: 0;
    `}
`;