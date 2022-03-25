import React from 'react';
import { Modal } from 'antd';

interface IConfirmModal {
    loading?: boolean,
    showModal: boolean,
    title: string,
    content: string,
    onOk: ((e: React.MouseEvent<HTMLElement, MouseEvent>) => void), onCancel: ((e: React.MouseEvent<HTMLElement, MouseEvent>) => void)
}

export const ConfirmModal = ({ loading, showModal, title, content, onOk, onCancel }: IConfirmModal) => {

    return (
        <Modal confirmLoading={!!loading} visible={showModal} onOk={onOk} onCancel={onCancel} title={title}>
            <span>{content}</span>
        </Modal>
    )
}