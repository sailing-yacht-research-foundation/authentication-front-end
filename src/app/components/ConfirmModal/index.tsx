import React from 'react';
import { Modal } from 'antd';

export const ConfirmModal = ({ showModal, title, content, onOk, onCancel }: { showModal: boolean, title: string, content: string, onOk: ((e: React.MouseEvent<HTMLElement, MouseEvent>) => void), onCancel: ((e: React.MouseEvent<HTMLElement, MouseEvent>) => void) }) => {

    return (
        <Modal visible={showModal} onOk={onOk} onCancel={onCancel} title={title}>
            <span>{content}</span>
        </Modal>
    )
}