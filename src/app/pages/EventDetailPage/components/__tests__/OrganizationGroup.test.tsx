import React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import Provider from 'app/components/Provider/index';
import { OrganizationGroup } from '../OrganizationGroup';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { defineWindowMatchMedia } from 'utils/test-helpers';

const uuid = require('uuid');
const shallowRenderer = createRenderer();

describe('OrganizationGroup', () => {
    it('should render to match the snapshot', () => {
        shallowRenderer.render(
            <Provider>
                <OrganizationGroup event={{}} />
            </Provider>);
        const renderedOutput = shallowRenderer.getRenderOutput();
        expect(renderedOutput).toMatchSnapshot();
    });

    it('should render nothing if the organizerGroupDetail is not truthy', () => {
        const event = {
            organizerGroupId: ''
        }

        const { container } = render(<OrganizationGroup event={event} />);

        expect(container.firstChild).toBeNull();
    });

    it('should render the card if the organizerGroupId is provided', () => {
        defineWindowMatchMedia();
        const event = {
            organizerGroupId: uuid.v4()
        }
        const { container } = render(<BrowserRouter><OrganizationGroup event={event} /></BrowserRouter>);

        expect(container.firstChild).toBeTruthy();
    });
});
