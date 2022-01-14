import React from 'react';
import { Form, Select, Space, Switch } from 'antd';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { SyrfFieldLabel, SyrfFormSelect } from 'app/components/SyrfForm';
import { renderAvatar, getUserAttribute } from 'utils/user-utils';
import styled from 'styled-components';
import { debounce } from 'utils/helpers';
import { searchGroupForAssigns } from 'services/live-data-server/groups';
import { searchForProfiles } from 'services/live-data-server/profile';
import { selectUser } from 'app/pages/LoginPage/slice/selectors';
import { useSelector } from 'react-redux';
import { AdminType } from 'utils/constants';

export const AssignAdminsFormItem = (props) => {

    const user = useSelector(selectUser);

    const { event } = props;

    const debounceSearch = React.useCallback(debounce((keyword) => onSearch(keyword), 300), []);

    const { t } = useTranslation();

    const [items, setItems] = React.useState<any[]>([]);

    const handleSwitchChange = (checked, e, item) => {
        e.stopPropagation();

        setItems(items.map(i => {
            if (i.id === item.id) {
                i.isIndividualAssignment = checked
            }

            return i;
        }))
    }

    const renderItemResults = () => {
        return items.map(item => <Select.Option style={{ padding: '5px' }} value={JSON.stringify(item)}>
            <ItemAvatar src={renderAvatar(item.avatar)} /> {item.name}, type: {item.type}
            {item.type === AdminType.GROUP && <Switch checked={item.isIndividualAssignment} style={{ marginLeft: '10px' }} checkedChildren={t(translations.my_event_create_update_page.group_members_assignment)} unCheckedChildren={t(translations.my_event_create_update_page.group_assignment)} onChange={(checked, e) => handleSwitchChange(checked, e, item)} />}
        </Select.Option>)
    }

    const onSearch = async (keyword) => {
        setItems([]);
        const groupResponse = await searchGroupForAssigns(keyword);
        const peopleResponse = await searchForProfiles(keyword, getUserAttribute(user, 'locale'));
        let groupRows = [];
        let peopleRows = [];

        if (groupResponse.success) {
            groupRows = groupResponse.data.rows.map(group => {
                return {
                    type: AdminType.GROUP,
                    id: group.id,
                    avatar: group.groupImage,
                    name: group.groupName,
                    isIndividualAssignment: false
                }
            });
        }

        if (peopleResponse.success) {
            peopleRows = peopleResponse.data.rows.map(p => {
                return {
                    type: AdminType.INDIVIDUAL,
                    id: p.id,
                    avatar: p.avatar,
                    name: p.name,
                    isIndividualAssignment: false
                }
            })
        }

        setItems([...groupRows, ...peopleRows]);
    }

    React.useEffect(() => {
        let groupRows = [];
        let peopleRows = [];
        if (event.editors) {
            peopleRows = event.editors.map(editor => ({
                type: AdminType.INDIVIDUAL,
                id: editor.id,
                avatar: editor.avatar,
                name: editor.name,
                isIndividualAssignment: false
            }));
        }

        if (event.groups) {
            groupRows = event.groups.map(group => {
                return {
                    type: AdminType.GROUP,
                    id: group.id,
                    avatar: group.groupImage,
                    name: group.groupName,
                    isIndividualAssignment: false
                }
            });
        }

        setItems([...peopleRows, ...groupRows]);
    }, [event]);

    return (
        <Form.Item
            label={<SyrfFieldLabel>{t(translations.my_event_create_update_page.editors)}</SyrfFieldLabel>}
            name="admins"
            data-tip={t(translations.tip.set_admins_for_this_event)}>
            <SyrfFormSelect mode="multiple"
                style={{ width: '100%' }}
                placeholder={t(translations.tip.set_admins_for_this_event)}
                onSearch={debounceSearch}
                filterOption={false}
                allowClear
                maxTagCount={'responsive' as const}
            >
                {renderItemResults()}
            </SyrfFormSelect>
        </Form.Item>
    )
}

const ItemAvatar = styled.img`
    with: 25px;
    height: 25px;
    margin-right: 5px;
    border-radius: 50%;
`;