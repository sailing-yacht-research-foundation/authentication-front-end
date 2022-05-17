import React from 'react';
import { translations } from 'locales/translations';
import { requiredCompetitorsInformation } from 'utils/constants';
import { renderRequirementBasedOnEventKey } from 'utils/helpers';
import { Form, Checkbox } from 'antd';
import { CalendarEvent } from 'types/CalendarEvent';

export const InformationSharing = ({ event, t }: { event: Partial<CalendarEvent>, t: any }) => {
    const requiredInformation: any = [];
    if (!event)
        return <></>;

    Object.keys(event).forEach(key => {
        if (requiredCompetitorsInformation.includes(key) && event[key] === true)
            requiredInformation.push(<li>{renderRequirementBasedOnEventKey(t, key)}</li>);
    });

    return <>
        <ul>
            {requiredInformation.map(information => information)}
        </ul>

        {requiredInformation.length > 0 && <Form.Item
            name="allowShareInformation"
            valuePropName="checked"
        >
            <Checkbox>{t(translations.my_event_list_page.agree_to_share_information)}</Checkbox>
        </Form.Item>}
    </>;
}
