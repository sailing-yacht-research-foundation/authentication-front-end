import * as React from 'react';
import { Input, Form, Button, Row } from 'antd';
import { Auth } from 'aws-amplify';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { selectUser } from 'app/pages/LoginPage/slice/selectors';

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

export const ChangePasswordForm = (props) => {
    const user = useSelector(selectUser);

    const onFinish = (values) => {
        const { oldPassword, newPassword } = values;

        Auth.changePassword(user, oldPassword, newPassword).then(response => {
            toast.success('Password changed successfully');
        }).catch(error => {
            toast.error(error.message);
        }) 
    }

    return (
        <Form
            {...layout}
            name="basic"
            onFinish={onFinish}
        >
            <Form.Item
                label="Old password"
                name="oldPassword"
                rules={[{ required: true, max: 16, min: 8 }]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item
                label="New password"
                name="newPassword"
                rules={[{ required: true, max: 16, min: 8 }]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit" style={{ float: 'right' }}>
                    Change password
                    </Button>
            </Form.Item>
        </Form>
    );
}