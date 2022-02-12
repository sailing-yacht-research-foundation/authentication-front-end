import React from 'react';
import { Modal } from 'antd';

export const ConfirmModal = (props) => {

    const { showModal, title, content, onOk, onCancel } = props;

    return (
        <Modal visible={showModal} onOk={onOk} onCancel={onCancel} title={title}>
            <span>{content}</span>
        </Modal>
    )
}