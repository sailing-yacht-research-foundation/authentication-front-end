import React, { useRef, useState } from 'react';
import { StyleConstants } from 'styles/StyleConstants';
import { Auth, Storage } from 'aws-amplify';
import { getProfilePicture, getUserAttribute } from 'utils/user-utils';
import { CameraFilled } from '@ant-design/icons';
import { Image, Spin, Typography, Modal } from 'antd';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import Avatar from 'react-avatar-edit';
import { dataURLtoFile } from 'utils/helper';

export const ChangeAvatar = (props) => {
    const { authUser } = props;

    const [isUploadingProfilePicture, setIsUploadingProfilePicture] = useState<boolean>(false);

    const [base64ConvertedURL, setBase64ConvertedURL] = React.useState<string>('');

    const [cropAvatarModalVisible, setCropAvatarModalVisible] = useState<boolean>(false);

    const onSubmitCroppedAvatar = async () => {
        if (base64ConvertedURL === '') {
            toast.error('Please choose an image to crop!');
            return;
        }

        const avatarFileName = `${(+ new Date())}-${String(authUser.username).substring(0, 8)}-profile-picture.png`;
        const file = dataURLtoFile(base64ConvertedURL, avatarFileName);

        setIsUploadingProfilePicture(true);
        setCropAvatarModalVisible(false);

        Storage.put(avatarFileName, file, {
            contentType: "image/png",
            level: 'public',
        })
            .then(result => {
                onAfterUploadingAvatar();

                Auth.currentAuthenticatedUser().then(user => {
                    Auth.updateUserAttributes(user, {
                        'picture': avatarFileName
                    }).then(response => {
                        toast.success('Upload avatar success');
                        props.cancelUpdateProfile();
                    }).catch(error => {
                        toast.error(error.message);
                    })
                }).catch(error => {
                    toast.error(error.message);
                })
            })
            .catch(err => {
                toast.error(err.message);
                onAfterUploadingAvatar();
            });
    }

    const onAvatarCropped = (convertedBase64ImageURL) => {
        setBase64ConvertedURL(convertedBase64ImageURL)
    }

    const onClearCropper = () => {
        setBase64ConvertedURL('');
    }

    const onAfterUploadingAvatar = () => {
        setBase64ConvertedURL('');
        setIsUploadingProfilePicture(false);
    }

    return (
        <>
            <Modal
                title="Change profile picture"
                bodyStyle={{ display: 'flex', justifyContent: 'center', overflow: 'hidden' }}
                visible={cropAvatarModalVisible}
                onOk={onSubmitCroppedAvatar}
                onCancel={() => setCropAvatarModalVisible(false)}>
                <Avatar
                    onClose={onClearCropper}
                    width={390}
                    height={295}
                    exportAsSquare={true}
                    onCrop={onAvatarCropped}
                />
            </Modal>
            <Spin spinning={isUploadingProfilePicture} tip="Uploading...">
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
`

const ChangeAvatarButton = styled.div`
    position: absolute;
    right: 10px;
    bottom: 20px;
    z-index: 1;
    cursor: pointer;
`

const AvatarHolder = styled.div`
    width: 150px;
    height: 150px;
    border-radius: 50%;
    overflow:hidden;
    border: 1px solid ${StyleConstants.MAIN_TONE_COLOR};
`