import React from 'react';
import { Modal } from 'antd';

export const ConfirmModal = ({ showModal, title, content, onOk, onCancel }) => {

    return (
        <Modal visible={showModal} onOk={onOk} onCancel={onCancel} title={title}>
            <span>{content}</span>
        </Modal>
    )
}