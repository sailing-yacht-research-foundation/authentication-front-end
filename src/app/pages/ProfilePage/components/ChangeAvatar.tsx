import React, { useState } from 'react';
import { StyleConstants } from 'styles/StyleConstants';
import { getProfilePicture, getUserAttribute } from 'utils/user-utils';
import { CameraFilled } from '@ant-design/icons';
import { Image, Spin, Modal } from 'antd';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import Avatar from 'react-avatar-edit';
import { dataURLtoFile } from 'utils/helpers';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { updateProfile, uploadAvatar } from 'services/live-data-server/user';

export const ChangeAvatar = (props) => {
    const { authUser } = props;

    const [isUploadingProfilePicture, setIsUploadingProfilePicture] = useState<boolean>(false);

    const [base64ConvertedURL, setBase64ConvertedURL] = React.useState<string>('');

    const [cropAvatarModalVisible, setCropAvatarModalVisible] = useState<boolean>(false);

    const { t } = useTranslation();

    const onSubmitCroppedAvatar = async (imageData) => {
        if (base64ConvertedURL === '' && !imageData) {
            toast.error(t(translations.profile_page.update_profile.please_choose_an_image_to_crop));
            return;
        }

        const avatarFileName = `${(+ new Date())}-${String(authUser.username).substring(0, 8)}-profile-picture.png`;
        let file = dataURLtoFile(base64ConvertedURL || imageData, avatarFileName);

        setIsUploadingProfilePicture(true);
        setCropAvatarModalVisible(false);

        const formData = new FormData();
        formData.append("image", file);
        const response = await uploadAvatar(formData);

        onAfterUploadingAvatar();

        if (response.success) {
            const avatarUrl = response.data?.url;
            if (authUser.attributes) {
                const userData = {
                    firstName: authUser.firstName,
                    lastName: authUser.lastName,
                    attributes: {
                        picture: avatarUrl,
                        language: getUserAttribute(authUser,'language'),
                        locale: getUserAttribute(authUser,'locale'),
                        bio: getUserAttribute(authUser,'bio'),
                        sailing_number: getUserAttribute(authUser,'sailing_number'),
                        birthdate: getUserAttribute(authUser,'birthdate'),
                        address: getUserAttribute(authUser,'address'),
                        phone_number: getUserAttribute(authUser,'phone_number'),
                        showed_tour: getUserAttribute(authUser, 'showed_tour'),
                    }
                }
                await updateProfile(userData);
                props.cancelUpdateProfile();
            }
            toast.success(t(translations.profile_page.update_profile.upload_profile_picture_successfully));
        } else {
            if (response.error?.response && response.error?.response?.status === 400) // file too large
                toast.error(t(translations.profile_page.update_profile.your_file_is_too_large_please_choose_another));
            else
                toast.error(t(translations.profile_page.update_profile.error_happened_when_upload_profile_picture));
        }
    }

    const onAvatarCropped = (convertedBase64ImageURL) => {
        setBase64ConvertedURL(convertedBase64ImageURL)
        console.log(convertedBase64ImageURL)
    }

    const onClearCropper = () => {
        setBase64ConvertedURL('');
    }

    const getBase64 = (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
      }

    const onAfterUploadingAvatar = () => {
        setBase64ConvertedURL('');
        setIsUploadingProfilePicture(false);
    }

    const onFileUpload = async (file) => {
        if (file.type === 'image/gif') {
            const imageData = await getBase64(file);
            if (!imageData) return;
            onSubmitCroppedAvatar(imageData);
        };
    }

    return (
        <>
            <Modal
                title={t(translations.profile_page.update_profile.change_profile_picture)}
                bodyStyle={{ display: 'flex', justifyContent: 'center', overflow: 'hidden' }}
                visible={cropAvatarModalVisible}
                onOk={onSubmitCroppedAvatar}
                onCancel={() => setCropAvatarModalVisible(false)}>
                <Avatar
                    onClose={onClearCropper}
                    width={390}
                    height={295}
                    onFileLoad={onFileUpload}
                    exportAsSquare={true}
                    mimeTypes="image/jpeg,image/png,image/gif"
                    onCrop={onAvatarCropped}
                />
            </Modal>
            <Spin spinning={isUploadingProfilePicture} tip={t(translations.profile_page.update_profile.uploading)}>
                <Wrapper>
                    <AvatarHolder>
                        <Image style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }} src={getProfilePicture(authUser)} />
                    </AvatarHolder>
                    <ChangeAvatarButton>
                        <CameraFilled style={{ color: StyleConstants.MAIN_TONE_COLOR, fontSize: '25px' }} onClick={() => setCropAvatarModalVisible(true)} size={20} />
                    </ChangeAvatarButton>
                </Wrapper>
            </Spin>
        </>
    )
}

const Wrapper = styled.div`
    position: relative;
    width: 150px;
`;

const ChangeAvatarButton = styled.div`
    position: absolute;
    right: 10px;
    bottom: 20px;
    z-index: 1;
    cursor: pointer;
`;

const AvatarHolder = styled.div`
    width: 150px;
    height: 150px;
    border-radius: 50%;
    overflow:hidden;
    border: 1px solid ${StyleConstants.MAIN_TONE_COLOR};
`;