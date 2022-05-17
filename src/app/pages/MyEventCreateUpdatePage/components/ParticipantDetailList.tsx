import React from 'react';
import { Spin, Table } from 'antd';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { TIME_FORMAT } from 'utils/constants';
import { renderEmptyValue } from 'utils/helpers';
import { getDetailedEventParticipantInfoById } from 'services/live-data-server/event-calendars';

export const ParticipantDetailList = (props) => {

    const { t } = useTranslation();

    const { eventId, participant } = props;

    const [participantData, setParticipantData] = React.useState({});

    const columns = [
        {
            title: t(translations.participant_list.agreed_to_waivers),
            dataIndex: 'waiverAgreements',
            key: 'waiverAgreements',
            render: (value) => renderEmptyValue(Array.isArray(value) ? value.map(waiver => waiver.waiverType).join(', ') : ''),
        },
        {
            title: t(translations.participant_list.email),
            dataIndex: 'email',
            key: 'email',
            render: (value) => renderEmptyValue(value),
        },
        {
            title: t(translations.participant_list.birth_date),
            dataIndex: 'birthdate',
            key: 'birthdate',
            render: (value) => moment(value).format(TIME_FORMAT.date_text),
        },
        {
            title: t(translations.participant_list.address),
            dataIndex: 'address',
            key: 'address',
            render: (value) => renderEmptyValue(value),
        },
        {
            title: t(translations.participant_list.phone_number),
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            render: (value) => renderEmptyValue(value),
        },
        {
            title: t(translations.participant_list.allow_to_share_information),
            dataIndex: 'allowShareInformation',
            key: 'allowShareInformation',
            render: (value) => String(value),
        },
        {
            title: t(translations.participant_list.has_covid_vaccination_card),
            dataIndex: 'hasCovidVaccinationCard',
            key: 'hasCovidVaccinationCard',
            render: (value) => String(value),
        },
        {
            title: t(translations.participant_list.passportNumber),
            dataIndex: 'immigrationInformation.passportNumber',
            key: 'immigrationInformation.passportNumber',
            render: (value, record) => renderEmptyValue(record.immigrationInformation?.passportNumber),
        },
        {
            title: t(translations.participant_list.passport_issued_date),
            dataIndex: 'immigrationInformation.issueDate',
            key: 'immigrationInformation.issueDate',
            render: (value, record) => renderEmptyValue(record.immigrationInformation?.issueDate),
        },
        {
            title: t(translations.participant_list.passport_expiration_date),
            dataIndex: 'immigrationInformation.expirationDate',
            key: 'immigrationInformation.expirationDate',
            render: (value, record) => renderEmptyValue(record.immigrationInformation?.expirationDate),
        },
        {
            title: t(translations.participant_list.passport_issued_country),
            dataIndex: 'immigrationInformation.issueCountry',
            key: 'immigrationInformation.issueCountry',
            render: (value, record) => renderEmptyValue(record.immigrationInformation?.issueCountry),
        },
        {
            title: t(translations.participant_list.emergency_contact_name),
            dataIndex: 'emergencyContact.name',
            key: 'emergencyContact.name',
            render: (value, record) => renderEmptyValue(record.emergencyContact?.name),
        },
        {
            title: t(translations.participant_list.emergency_contact_relationship),
            dataIndex: 'emergencyContact.relationship',
            key: 'emergencyContact.relationship',
            render: (value, record) => renderEmptyValue(record.emergencyContact?.relationship),
        },
        {
            title: t(translations.participant_list.emergency_contact_name),
            dataIndex: 'emergencyContact.phone',
            key: 'emergencyContact.phone',
            render: (value, record) => renderEmptyValue(record.emergencyContact?.phone),
        },
        {
            title: t(translations.participant_list.emergency_contact_email),
            dataIndex: 'emergencyContact.email',
            key: 'emergencyContact.email',
            render: (value, record) => renderEmptyValue(record.emergencyContact?.email),
        },
        {
            title: t(translations.participant_list.food_allergies),
            dataIndex: 'foodAllergies',
            key: 'foodAllergies',
            render: (value, record) => record.foodAllergies?.join(', '),
        },
        {
            title: t(translations.participant_list.medical_problems),
            dataIndex: 'medicalProblems',
            key: 'medicalProblems',
            render: (value) => renderEmptyValue(value),
        },
    ];

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const getDetailedParticipantInfoById = async () => {
        setIsLoading(true);
        const response = await getDetailedEventParticipantInfoById(eventId, participant.id);
        setIsLoading(false);

        if (response.success) {
            setParticipantData(response.data.data);
        }
    }

    React.useEffect(() => {
        getDetailedParticipantInfoById();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        console.log(participantData);
    }, [participantData]);

    return (
        <>
            <Spin spinning={isLoading}>
                <Table columns={columns}
                    size="small"
                    scroll={{ x: "max-content" }}
                    dataSource={[participantData]} pagination={false} />
            </Spin>
        </>
    )
}