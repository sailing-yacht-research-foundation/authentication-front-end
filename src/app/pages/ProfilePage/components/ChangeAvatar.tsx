import React, { useRef, useState } from 'react';
import { StyleConstants } from 'styles/StyleConstants';
import { Auth, Storage } from 'aws-amplify';
import { getProfilePicture, getUserAttribute } from 'utils/user-utils';
import { CameraFilled } from '@ant-design/icons';
import { Image, Spin, Typography } from 'antd';
import { toast } from 'react-toastify';
import Resizer from "react-image-file-resizer";
import styled from 'styled-components';

export const ChangeAvatar = (props) => {
    const { authUser } = props;

    const fileUploadRef = useRef<HTMLInputElement>(null);

    const [isUploadingProfilePicture, setIsUploadingProfilePicture] = useState<boolean>(false);

    const resizeImage = async (file) => {
        return new Promise((resolve) => Resizer.imageFileResizer(
            file, 500, 500, "PNG", 100, 0,
            (uri) => {
                resolve(uri);
            },
            'file'
        ));
    }

    const onFileChanged = async (e) => {
        e.preventDefault();
        // const file = await resizeImage(e.target.files[0]);
        const file = e.target.files[0];
        const avatarFileName = `${(+ new Date())}-${String(authUser.username).substring(0, 8)}-profile-picture.png`;

        setIsUploadingProfilePicture(true);

        Storage.put(avatarFileName, file, {
            contentType: "image/png",
            level: 'public',
        })
            .then(result => {
                setIsUploadingProfilePicture(false);

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
                setIsUploadingProfilePicture(false);
            });
    }

    const triggerChooseAvatar = () => {
        if (fileUploadRef && fileUploadRef.current) fileUploadRef.current.click();
    }

    return (
        <>
            <Spin spinning={isUploadingProfilePicture} tip="Uploading...">
                <Wrapper>
                    <AvatarHolder>
                        <Image style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }} src={getProfilePicture(authUser)} />
                    </AvatarHolder>
                    <ChangeAvatarButton>
                        <CameraFilled style={{ color: StyleConstants.MAIN_TONE_COLOR, fontSize: '25px' }} onClick={() => triggerChooseAvatar()} size={20} />
                        <input ref={fileUploadRef} accept="image/png, image/jpeg" onChange={onFileChanged} hidden={true} type="file" />
                    </ChangeAvatarButton>
                </Wrapper>
            </Spin>
            <Typography.Title style={{ marginTop: '15px', textAlign: 'center' }} level={3}>{getUserAttribute(authUser, 'name')}</Typography.Title>
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