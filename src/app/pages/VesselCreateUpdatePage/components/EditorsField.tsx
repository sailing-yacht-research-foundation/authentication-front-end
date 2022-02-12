import React from 'react';
import { Form, Select, Switch } from 'antd';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { SyrfFieldLabel, SyrfFormSelect } from 'app/components/SyrfForm';
import { renderAvatar, getUserAttribute } from 'utils/user-utils';
import { debounce } from 'utils/helpers';
import { searchGroupForAssigns } from 'services/live-data-server/groups';
import { searchForProfiles } from 'services/live-data-server/profile';
import { selectUser } from 'app/pages/LoginPage/slice/selectors';
import { useSelector } from 'react-redux';
import { AdminType } from 'utils/constants';
import { ItemAvatar } from 'app/components/SyrfGeneral';
import { useHistory } from 'react-router-dom';

export const EditorsField = (props) => {

    const user = useSelector(selectUser);

    const { vessel } = props;

    const history = useHistory();

    // eslint-disable-next-line
    const debounceSearch = React.useCallback(debounce((keyword) => onSearch(keyword), 300), []);

    const [showIndividualField, setShowIndividualField] = React.useState<boolean>(false);

    const { t } = useTranslation();

    const [items, setItems] = React.useState<any[]>([]);

    const navigateToProfile = (e, item) => {
        e.stopPropagation();
        history.push(`/${item.type === AdminType.GROUP ? 'groups' : 'profile'}/${item.id}`);
    }

    const renderItemResults = () => {
        return items.map(item => <Select.Option style={{ padding: '5px' }} value={JSON.stringify(item)}>
            <ItemAvatar onClick={(e) => navigateToProfile(e, item)} src={renderAvatar(item.avatar)} /> {item.name} - {item.type === AdminType.GROUP ? 'group' : 'individual'}
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
                }
            });
        }

        if (peopleResponse.success) {
            peopleRows = peopleResponse.data.map(p => {
                return {
                    type: AdminType.INDIVIDUAL,
                    id: p.id,
                    avatar: p.avatar,
                    name: p.name,
                }
            })
        }

        setItems([...groupRows, ...peopleRows]);
    }

    React.useEffect(() => {
        let groupRows = [];
        let peopleRows = [];
        if (vessel.editors) {
            peopleRows = vessel.editors.map(editor => ({
                type: AdminType.INDIVIDUAL,
                id: editor.id,
                avatar: editor.avatar,
                name: editor.name,
            }));
        }

        if (vessel.groupEditors) {
            groupRows = vessel.groupEditors.map(group => {
                return {
                    type: AdminType.GROUP,
                    id: group.id,
                    avatar: group.groupImage,
                    name: group.groupName,
                }
            });
        }

        setItems([...peopleRows, ...groupRows]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [vessel]);

    const handleOnChange = (items) => {
        const editors = items ? items.map(item => JSON.parse(item)) : [];
        setShowIndividualField(editors.filter(editor => editor.type === AdminType.GROUP).length > 0);
    }

    return (
        <>
            <Form.Item
                label={<SyrfFieldLabel>{t(translations.vessel_create_update_page.admins)}</SyrfFieldLabel>}
                name="admins"
                data-tip={t(translations.tip.set_admins_for_this_boat)}>
                <SyrfFormSelect mode="multiple"
                    style={{ width: '100%' }}
                    placeholder={t(translations.tip.set_admins_for_this_boat)}
                    onSearch={debounceSearch}
                    onChange={handleOnChange}
                    filterOption={false}
                    allowClear
                    maxTagCount={'responsive' as const}
                >
                    {renderItemResults()}
                </SyrfFormSelect>
            </Form.Item>

            {showIndividualField && <Form.Item
                label={<SyrfFieldLabel>{t(translations.vessel_create_update_page.assign_for_all_group_member)}</SyrfFieldLabel>}
                name="isIndividualAssignment"
                valuePropName="checked"
            >
                <Switch />
            </Form.Item>}
        </>
    )
}