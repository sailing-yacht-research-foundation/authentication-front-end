import 'react-phone-input-2/lib/style.css';

import React, { useState } from 'react';
import { Form, Spin } from 'antd';
import moment from 'moment';
import styled from 'styled-components';
import { checkForVerifiedField, getUserAttribute } from 'utils/user-utils';
import Auth from '@aws-amplify/auth';
import { SyrfFormButton, SyrfFormWrapper } from 'app/components/SyrfForm';
import { FIELD_VALIDATE, removePlusFromPhoneNumber, replaceObjectPropertiesFromNullToEmptyString } from 'utils/helper';
import { PrivateUserInformation } from './PrivateUserInformation';
import { toast } from 'react-toastify';
import { PublicUserInformation } from './PublicUserInformation';
import { VerifyPhoneModal } from './VerifyPhoneModal';
import { EditEmailChangeModal } from './EditEmailChangeModal';
import { media } from 'styles/media';

const defaultFormFields = {
    email: '',
    name: '',
    phone_number: '',
    sailing_number: '',
    birthdate: '',
    language: '',
    country: '',
    share_social: ''
};

export const UpdateInfo = (props) => {
    const [isUpdatingProfile, setIsUpdatingProfile] = useState<boolean>(false);

    const { authUser } = props;

    const [showPhoneVerifyModal, setShowPhoneVerifyModal] = useState<boolean>(false);

    const [address, setAddress] = React.useState<string>(getUserAttribute(authUser, 'address') || '');

    const [phoneVerifyModalMessage, setPhoneVerifyModalMessage] = React.useState<string>('');

    const [showEmailChangeAlertModal, setShowEmailChangeAlertModal] = React.useState<boolean>(false);

    const [form] = Form.useForm();

    const [formHasBeenChanged, setFormHasBeenChanged] = React.useState<boolean>(false);

    // for storing fields filled by user from the form for later use when
    // user still chooses to change the email.
    const [formFieldsBeforeUpdate, setFormFieldsBeforeUpdate] = React.useState(defaultFormFields);

    const onFinish = (values) => {
        values = replaceObjectPropertiesFromNullToEmptyString(values);
        const { email } = values;

        if (checkForEmailChanged(email)) {
            setShowEmailChangeAlertModal(true);
            setFormFieldsBeforeUpdate(values);
        } else {
            updateUserInfo(values);
        }
    }

    const updateUserInfo = ({
        email,
        phone_number,
        sailing_number,
        birthdate,
        language,
        country,
        share_social,
        bio,
        first_name,
        last_name,
    }) => {

        setIsUpdatingProfile(true);

        Auth.currentAuthenticatedUser().then(user => {
            Auth.updateUserAttributes(user, {
                email: email,
                phone_number: phone_number ? removePlusFromPhoneNumber(phone_number) : '',
                address: address,
                birthdate: birthdate ? birthdate.format("YYYY-MM-DD") : moment('2002-01-01').format("YYYY-MM-DD"),
                locale: country,
                'custom:sailing_number': sailing_number,
                'custom:language': language,
                'custom:share_social': share_social ? 'y' : '', // y stands for yes
                'custom:first_name': first_name,
                'custom:last_name': last_name,
                'custom:bio': bio,
                name: first_name + ' ' + last_name
            }).then(response => {
                onUpdateProfileSuccess();
            }).catch(error => {
                toast.error(error.message);
                setIsUpdatingProfile(false);
                setFormFieldsBeforeUpdate(defaultFormFields);
            })
        }).catch(error => {
            toast.error(error.message);
            setIsUpdatingProfile(false);
            setFormFieldsBeforeUpdate(defaultFormFields);
        })
    }

    const onUpdateProfileSuccess = () => {
        setIsUpdatingProfile(false);
        toast.success('Your profile has been successfully updated!');
        props.cancelUpdateProfile();
        checkPhoneVerifyStatus();
        setFormFieldsBeforeUpdate(defaultFormFields);
        setFormHasBeenChanged(false);
    }

    const checkPhoneVerifyStatus = () => {
        Auth.currentAuthenticatedUser().then(user => {
            if (!!getUserAttribute(user, 'phone_number') && !checkForVerifiedField(user, FIELD_VALIDATE.phone)) { // user inputed phone and it's not verified
                showPhoneVerifyModalWithMessage(
                    `Hey ${getUserAttribute(user, 'name')}, your phone number is not verified, you will receive a call to verify your phone number.`
                );
            }
        }).catch((error) => {
            toast.error(error.message);
        })
    }

    const checkForEmailChanged = (email) => {
        const oldEmail = getUserAttribute(authUser, 'email');
        const newEmail = email;

        return oldEmail !== newEmail;
    }

    const showPhoneVerifyModalWithMessage = (message: string) => {
        setPhoneVerifyModalMessage(message);
        setShowPhoneVerifyModal(true);
        sendPhoneVerification();
    }

    const sendPhoneVerification = () => {
        Auth.verifyCurrentUserAttribute('phone_number').then(() => {
            toast.success('You will receive a phone call to verify your phone number.');
        }).catch(error => {
            toast.error(error.message);
        });
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

            <VerifyPhoneModal
                showPhoneVerifyModal={showPhoneVerifyModal}
                sendPhoneVerification={sendPhoneVerification}
                setShowPhoneVerifyModal={setShowPhoneVerifyModal}
                message={phoneVerifyModalMessage}
                setPhoneVerifyModalMessage={setPhoneVerifyModalMessage}
                cancelUpdateProfile={props.cancelUpdateProfile} />

            <SyrfFormWrapper className="no-background">
                <Spin spinning={isUpdatingProfile} tip="Updating your profile...">
                    <Form
                        onValuesChange={() => setFormHasBeenChanged(true)}
                        form={form}
                        layout="vertical"
                        name="basic"
                        initialValues={{
                            email: getUserAttribute(authUser, 'email'),
                            last_name: getUserAttribute(authUser, 'custom:last_name'),
                            first_name: getUserAttribute(authUser, 'custom:first_name'),
                            bio: getUserAttribute(authUser, 'custom:bio'),
                            phone_number: getUserAttribute(authUser, 'phone_number'),
                            address: getUserAttribute(authUser, 'address'),
                            birthdate: moment(getUserAttribute(authUser, 'birthdate')),
                            sailing_number: getUserAttribute(authUser, 'custom:sailing_number'),
                            facebook: getUserAttribute(authUser, 'custom:facebook'),
                            instagram: getUserAttribute(authUser, 'custom:instagram'),
                            twitter: getUserAttribute(authUser, 'custom:twitter'),
                            language: getUserAttribute(authUser, 'custom:language'),
                            country: getUserAttribute(authUser, 'locale'),
                            share_social: !!getUserAttribute(authUser, 'custom:share_social'),
                        }}
                        onFinish={onFinish}
                    >
                        <PublicUserInformation
                            authUser={authUser}
                            cancelUpdateProfile={props.cancelUpdateProfile} />

                        <PrivateUserInformation
                            setShowPhoneVerifyModal={setShowPhoneVerifyModal}
                            address={address} setAddress={setAddress}
                            sendPhoneVerification={sendPhoneVerification}
                            authUser={authUser} />

                        <Form.Item>
                            <StyledSyrfFormButtonWrapper>
                                <SyrfFormButton disabled={!formHasBeenChanged} type="primary" htmlType="submit">
                                    Save
                                </SyrfFormButton>
                            </StyledSyrfFormButtonWrapper>
                        </Form.Item>
                    </Form>
                    <DisclaimerText>* Your personal details will never be shared with 3rd party apps without your permission and will never be sold to advertisers.</DisclaimerText>
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