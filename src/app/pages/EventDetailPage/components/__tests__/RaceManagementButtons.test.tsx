import { render } from '@testing-library/react';
import MyProvider from 'app/components/Provider';
import { i18n } from 'locales/i18n';
import { translations } from 'locales/translations';
import React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import { CalendarEvent } from 'types/CalendarEvent';
import { CompetitionUnit } from 'types/CompetitionUnit';
import { EventState, RaceStatus } from 'utils/constants';
import { RaceManageButtons } from '../RaceManageButtons';

const shallowRenderer = createRenderer();

describe('RaceManagementButtons', () => {
    it('should render and match snapshot', () => {
        const race: CompetitionUnit = {} as CompetitionUnit;
        const event: CalendarEvent = {} as CalendarEvent;
        shallowRenderer.render(
            <MyProvider>
                <RaceManageButtons race={race} reloadParent={jest.fn} event={event} setCompetitionUnit={jest.fn} showDeleteRaceModal={jest.fn} />
            </MyProvider>);
        const renderedOutput = shallowRenderer.getRenderOutput();
        expect(renderedOutput).toMatchSnapshot();
    });

    it('should render stop race button if the condition matches', async () => {
        const race: CompetitionUnit = { status: RaceStatus.ON_GOING } as CompetitionUnit;
        const event: CalendarEvent = { isEditor: true } as CalendarEvent;
        const t = await i18n;

        const { getByText } = render(<MyProvider>
            <RaceManageButtons race={race} reloadParent={jest.fn} event={event} setCompetitionUnit={jest.fn} showDeleteRaceModal={jest.fn} />
        </MyProvider>);

        expect(getByText(String(t(translations.general.stop)))).toBeInTheDocument();
    });

    it('should render update button if the condition matches', async () => {
        const race: CompetitionUnit = {} as CompetitionUnit;
        const event: CalendarEvent = { isEditor: true, status: EventState.DRAFT } as CalendarEvent;
        const t = await i18n;
        const { getByRole } = render(<MyProvider>
            <RaceManageButtons race={race} reloadParent={jest.fn} event={event} setCompetitionUnit={jest.fn} showDeleteRaceModal={jest.fn} />
        </MyProvider>);

        expect(getByRole('button', t(translations.tip.update_race))).toBeInTheDocument();
    });

    it('should render delete button if the condition matches', async () => {
        const race: CompetitionUnit = { status: RaceStatus.SCHEDULED } as CompetitionUnit;
        const event: CalendarEvent = { isEditor: true, status: EventState.DRAFT } as CalendarEvent;
        const { container } = render(<MyProvider>
            <RaceManageButtons race={race} reloadParent={jest.fn} event={event} setCompetitionUnit={jest.fn} showDeleteRaceModal={jest.fn} />
        </MyProvider>);
    
        expect(container.querySelector('.ant-btn-dangerous')).toBeInTheDocument();
    });
});