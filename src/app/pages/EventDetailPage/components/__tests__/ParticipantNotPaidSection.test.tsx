import MyProvider from 'app/components/Provider';
import React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import { ParticipantNotPaidSection } from '../ParticipantNotPaidSection';
import { fireEvent, render } from '@testing-library/react';
import { translations } from 'locales/translations';
import { i18n } from 'locales/i18n';
import { act } from 'react-test-renderer';
import * as EventCalendarModule from 'services/live-data-server/event-calendars';
import * as Helpers from 'utils/helpers';
import { toast } from 'react-toastify';

const shallowRenderer = createRenderer();

jest.mock("react-redux", () => ({
    ...jest.requireActual("react-redux"),
    useSelector: () => jest.fn(),
}));

describe('ParticipantNotPaidSection', () => {
    it('should render and match snapshot', () => {
        shallowRenderer.render(
            <MyProvider>
                <ParticipantNotPaidSection event={{}} />
            </MyProvider>);
        const renderedOutput = shallowRenderer.getRenderOutput();
        expect(renderedOutput).toMatchSnapshot();
    });

    it('should render empty component when the condition does not match', () => {
        const { container } = render(<MyProvider>
            <ParticipantNotPaidSection event={{}} />
        </MyProvider>);

        expect(container.firstChild).toBeNull();
    });

    it('should render the component and children if the condition matches', async () => {
        const event = {
            isPaidEvent: true,
            isParticipant: true,
            isPaid: false
        };

        const t = await i18n;

        const { getByText } = render(<MyProvider>
            <ParticipantNotPaidSection event={event} />
        </MyProvider>);

        expect(getByText(String(t(translations.event_detail_page.pay_now)))).toBeInTheDocument();
    });

    it('should call payForEvent if the pay now button is clicked', async () => {
        const event = {
            isPaidEvent: true,
            isParticipant: true,
            isPaid: false
        };
        const t = await i18n;
        const { getByText } = render(<MyProvider>
            <ParticipantNotPaidSection event={event} />
        </MyProvider>);
        const payForEventSpy = jest.spyOn(EventCalendarModule, 'payForEvent');

        act(() => {
            fireEvent.click(getByText(String(t(translations.event_detail_page.pay_now))));
        });

        expect(payForEventSpy).toBeCalled();
    });

    it('should call payForEvent if the pay now button is clicked and call showToastMessageOnRequestError when the request failed', async () => {
        const payForEventSpy = jest.spyOn(EventCalendarModule, 'payForEvent')
        .mockImplementation(() => Promise.resolve({
            success: false
        }));
        const showToastMessageOnRequestErrorSpy = jest.spyOn(Helpers, 'showToastMessageOnRequestError'); 
        const event = {
            isPaidEvent: true,
            isParticipant: true,
            isPaid: false
        };
        const t = await i18n;
        const { getByText } = render(<MyProvider>
            <ParticipantNotPaidSection event={event} />
        </MyProvider>);
       
        act(() => {
            fireEvent.click(getByText(String(t(translations.event_detail_page.pay_now))));
        });
        
        expect(payForEventSpy).toHaveBeenCalled();
        await act(() => Promise.resolve());
        expect(showToastMessageOnRequestErrorSpy).toHaveBeenCalled();
    });

    it('should call payForEvent if the pay now button is clicked and show toast if the request is success', async () => {
        const payForEventSpy = jest.spyOn(EventCalendarModule, 'payForEvent')
        .mockImplementation(() => Promise.resolve({
            success: true,
            data: {
                checkoutUrl: '',
                isPaid: true
            }
        }));
        const toastSpy = jest.spyOn(toast, 'info'); 
        const event = {
            isPaidEvent: true,
            isParticipant: true,
            isPaid: false
        };
        const t = await i18n;
        const { getByText } = render(<MyProvider>
            <ParticipantNotPaidSection event={event} />
        </MyProvider>);
       
        act(() => {
            fireEvent.click(getByText(String(t(translations.event_detail_page.pay_now))));
        });
        
        expect(payForEventSpy).toHaveBeenCalled();
        await act(() => Promise.resolve());
        expect(toastSpy).toHaveBeenCalled();
    });
});