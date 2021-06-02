import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Auth, Storage } from 'aws-amplify';
import { getAvatar } from 'utils/user-utils';
import { EditFilled } from '@ant-design/icons';
import { Image } from 'antd';
import { selectUser } from 'app/pages/LoginPage/slice/selectors';
import { toast } from 'react-toastify';

export const ChangeAvatar = (props) => {
    const user = useSelector(selectUser);

    const fileUploadRef = useRef<HTMLInputElement>(null);

    const onFileChanged = (e) => {
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];

        const avatarFileName = `${'_' + Math.random().toString(36).substr(2, 9)}-profile-picture.png`;
        Storage.put(avatarFileName, file, {
            contentType: "image/png"
        })
            .then(result => {
                Auth.currentAuthenticatedUser().then(user => {
                    Auth.updateUserAttributes(user, {
                        'picture': avatarFileName
                    }).then(response => {
                        toast.success('Upload avatar success');
                    }).catch(error => {
                        console.log(error);
                    })
                }).catch(error => {
                    console.log(error);
                })
            })
            .catch(err => {
                toast.error(err.message);
            });
    }

    const triggerChooseAvatar = () => {
        if (fileUploadRef && fileUploadRef.current) fileUploadRef.current.click();
    }

    return (
        <Wrapper>
            <AvatarHolder>
                <Image src={getAvatar(user)} />
            </AvatarHolder>
            <ChangeAvatarButton>
                <EditFilled onClick={() => triggerChooseAvatar()} size={20} />
                <input ref={fileUploadRef} accept="image/png, image/jpeg" onChange={onFileChanged} hidden={true} type="file" />
            </ChangeAvatarButton>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    position: relative;
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
`