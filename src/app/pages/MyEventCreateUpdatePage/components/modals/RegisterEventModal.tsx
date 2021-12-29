import React from 'react';
import { Modal, Spin, Form } from 'antd';
import { SyrfFieldLabel, SyrfFormButton, SyrfFormSelect, SyrfInputField } from 'app/components/SyrfForm';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';

export const RegisterEventModal = () => {

    const { t } = useTranslation();

    return (<Modal
        title={'Register yourself to this event'}
        bodyStyle={{ display: 'flex', justifyContent: 'center', overflow: 'hidden', flexDirection: 'column' }}
        visible={true}
        footer={null}
    >
        <Spin spinning={false}>
            <Form
                layout="vertical"
                name="basic"
                style={{ width: '100%' }}
            >

                <Form.Item
                    label={<SyrfFieldLabel>Your competitor name</SyrfFieldLabel>}
                    name="groupId"
                    rules={[{ required: true, message: 'Please enter your name as a competitor' }]}
                >
                    <SyrfInputField placeholder='Your name as a competitor'/>
                </Form.Item>

                <Form.Item
                    label={<SyrfFieldLabel>Select a boat</SyrfFieldLabel>}
                    name="groupId"
                    rules={[{ required: true, message: 'Please select a boat to join this event.' }]}
                >
                    <SyrfFormSelect
                        showSearch
                        allowClear
                        placeholder={'Select a boat'}
                        optionFilterProp="children"
                    >
                    </SyrfFormSelect>
                </Form.Item>

                <Form.Item
                    label={<SyrfFieldLabel>Select a class</SyrfFieldLabel>}
                    name="personId"
                    rules={[{ required: true, message: 'In order to join this event, you must select a class.' }]}
                >
                    <SyrfFormSelect
                        showSearch
                        allowClear
                        placeholder={'The class that you want to register your boat.'}
                        optionFilterProp="children"
                    >
                    </SyrfFormSelect>
                </Form.Item>


                <Form.Item>
                    <SyrfFormButton type="primary" htmlType="submit">
                        Register As Competitor to this event
                    </SyrfFormButton>
                </Form.Item>
            </Form>
        </Spin>
    </Modal>);
}