import 'react-phone-number-input/style.css'

import React, { useState } from 'react';
import { Input, Form, Button, Row, Select, Divider, DatePicker, Checkbox, Spin } from 'antd';
import { Auth } from 'aws-amplify';
import { LANGUAGE_BY_LOCALE as locales } from 'utils/locale-list';
import PhoneInput from 'react-phone-number-input'

const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

export function SignupPage(props) {
  const [amplifyFeedBack, setAmplifyFeedBack] = useState({
    show: false,
    message: ''
  });

  const [isSigningUp, setIsSigningUp] = useState<Boolean>(false);

  const onFinish = (values) => {
    const { email, name, password, locale, phone_number, sailing_number, address, facebook, instagram, twitter, birthdate } = values;
    console.log(values);
    Auth.signUp({
      username: email,
      password: password,
      attributes: {
        name: name,
        locale: locale,
        phone_number: phone_number,
        address: address,
        birthdate: birthdate.format("YYYY-MM-DD"),
        'custom:sailing_number': sailing_number,
        'custom:facebook': facebook,
        'custom:instagram': instagram,
        'custom:twitter': twitter,
      }
    }).then(response => {
      let registerSuccess = !!response.user;
      if (registerSuccess) {
        props.history.push('/verify-account', {
          state: {
            email: response.user?.getUsername()
          }
        });
      }
    }).catch(err => {
      if (err.code) {
        setAmplifyFeedBack({
          show: true,
          message: err.message
        });
      }
    })
  }

  const renderLocaleDropdownList = () => {
    const objectArray = Object.entries(locales);
    return objectArray.map(([key, value]) => {
      return <Option value={key}>{value}</Option>
    });
  }

  return (
    <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
      <Spin tip="Signing you up...">
        <Form
          {...layout}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: 'email' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            hasFeedback={amplifyFeedBack.show}
            help={amplifyFeedBack.message}
            rules={[{ required: true, max: 16, min: 8 }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Locale"
            name="locale"
            rules={[{ required: true }]}
          >
            <Select placeholder={'Select a locale'} style={{ width: 120 }} onChange={onLocaleDropdownChanged}>
              {
                renderLocaleDropdownList()
              }
            </Select>
          </Form.Item>

          <Divider />

          <Form.Item
            label="Phone Number"
            name="phone_number"
            rules={[{ type: 'string' }]}
          >
            <PhoneInput
              placeholder="Enter phone number" />
          </Form.Item>

          <Form.Item
            label="Address"
            name="address"
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Date Of Birth"
            name="birthdate"
          >
            <DatePicker
              dateRender={current => {
                // const style = {};
                // if (current.date() === 1) {
                //   style.border = '1px solid #1890ff';
                //   style.borderRadius = '50%';
                // }
                return (
                  <div className="ant-picker-cell-inner">
                    {current.date()}
                  </div>
                );
              }}
            />
          </Form.Item>

          <Form.Item
            label="World Sailing Number"
            name="sailing_number"
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Facebook profile"
            name="facebook"
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Instagram profile"
            name="instagram"
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Twitter profile"
            name="twitter"
          >
            <Input />
          </Form.Item>

          <Divider />

          <Form.Item {...tailLayout} name="eula_agree" valuePropName="checked" rules={[
            {
              validator: (_, value) =>
                value ? Promise.resolve() : Promise.reject(new Error('You should accept our EULA.')),
            },
          ]}>
            <Checkbox>Agree to EULA</Checkbox>
          </Form.Item>

          <Form.Item {...tailLayout} name="pp_agree" valuePropName="checked" rules={[
            {
              validator: (_, value) =>
                value ? Promise.resolve() : Promise.reject(new Error('You must agree to our privacy policy.')),
            },
          ]}>
            <Checkbox value={1}>Agree to Privacy policy</Checkbox>
          </Form.Item>

          <Form.Item {...tailLayout} name="email_not_shared" valuePropName="checked" rules={[
            {
              validator: (_, value) =>
                value ? Promise.resolve() : Promise.reject(new Error('You must acknowledge that email provided will not be a shared email.')),
            },
          ]}>
            <Checkbox value={1}>Acknowledge that email provided will not be a shared email (one email per user).</Checkbox>
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              Signup
          </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Row>
  );
}
