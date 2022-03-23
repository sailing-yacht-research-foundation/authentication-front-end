import React from 'react';
import { Modal, Spin } from 'antd';

export const ModalPreviewPricing = () => {

    const [isLoading, setIsLoading] = React.useState<boolean>(false);


    return (<Modal>
        <Spin spinning={isLoading}>
        </Spin>
    </Modal>)
}