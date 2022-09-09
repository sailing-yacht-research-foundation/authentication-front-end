import MyProvider from 'app/components/Provider';
import * as React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import * as EventListModule from '../EventList';
import { render } from '@testing-library/react';
import { InvitedEventLists } from '../InvitedEventsList';
import * as InvitedEventListModule from '../InvitedEventsList';
import { defineWindowMatchMedia } from 'utils/test-helpers';

const shallowRenderer = createRenderer();

describe('InvitedEventList', () => {
    
    beforeAll(() => {
        defineWindowMatchMedia();
    });

    it('should render and match snapshot', () => {
        shallowRenderer.render(
            <MyProvider>
                <InvitedEventLists />
            </MyProvider>
        );
        const renderedOutput = shallowRenderer.getRenderOutput();
        expect(renderedOutput).toMatchSnapshot();
    });

    it("It should have been rendered with correct received props", () => {
        const invitedEventListComponentSpy = jest.spyOn(InvitedEventListModule, 'InvitedEventLists');

        const { container, getByText } = render(
            <MyProvider>
                <InvitedEventLists reloadInvitationCount={10} />
            </MyProvider>
        );

        expect(invitedEventListComponentSpy).toHaveBeenCalledWith(expect.objectContaining({
            reloadInvitationCount: 10
        }), {});
    });
});
