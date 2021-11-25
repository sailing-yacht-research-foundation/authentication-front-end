import React, { useState } from 'react';
import { StyleConstants } from 'styles/StyleConstants';
import { CameraFilled } from '@ant-design/icons';
import { Image, Spin, Modal } from 'antd';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import Avatar from 'react-avatar-edit';
import { dataURLtoFile } from 'utils/helpers';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { uploadAvatar } from 'services/live-data-server/groups';

export const GroupAvatar = (props) => {
    const { group } = props;

    const [isUploadingGroupAvatar, setIsUploadingGroupAvatar] = useState<boolean>(false);

    const [base64ConvertedURL, setBase64ConvertedURL] = React.useState<string>('');

    const [cropAvatarModalVisible, setCropAvatarModalVisible] = useState<boolean>(false);

    const { t } = useTranslation();

    const onSubmitCroppedAvatar = async (imageData) => {
        if (base64ConvertedURL === '' && (!imageData || typeof imageData !== 'string')) {
            toast.error(t(translations.profile_page.update_profile.please_choose_an_image_to_crop));
            return;
        }

        const avatarFileName = `${(+ new Date())}-${group.id}.png`;
        let file = dataURLtoFile(base64ConvertedURL || imageData, avatarFileName);

        setIsUploadingGroupAvatar(true);
        setCropAvatarModalVisible(false);

        const formData = new FormData();
        formData.append("image", file);
        const response = await uploadAvatar(group?.id, formData);

        onAfterUploadingAvatar();

        if (response.success) {
            const avatarUrl = response.data?.url;
            /// change group avatar here
            toast.success(t(translations.profile_page.update_profile.upload_profile_picture_successfully));
        } else {
            if (response.error?.response && response.error?.response?.status === 400) // file too large
                toast.error(t(translations.profile_page.update_profile.your_file_is_too_large_please_choose_another));
            else
                toast.error(t(translations.profile_page.update_profile.error_happened_when_upload_profile_picture));
        }
    }

    const onAvatarCropped = (convertedBase64ImageURL) => {
        setBase64ConvertedURL(convertedBase64ImageURL);
    }

    const onClearCropper = () => {
        setBase64ConvertedURL('');
    }

    const onAfterUploadingAvatar = () => {
        setBase64ConvertedURL('');
        setIsUploadingGroupAvatar(false);
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
                    exportAsSquare={true}
                    mimeTypes="image/jpeg,image/png,image/gif"
                    onCrop={onAvatarCropped}
                />
            </Modal>
            <Spin spinning={isUploadingGroupAvatar} tip={t(translations.profile_page.update_profile.uploading)}>
                <Wrapper>
                    <AvatarHolder>
                        <Image style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }} src={group?.groupImage || '/default-avatar.jpeg'} />
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