import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor, waitForElementToBeRemoved, getByRole } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import ImageSearchModal from '../controls/ImageSearchModal.js';
import { testSearchResults } from './testData/testSearchResults.js';


const proxyUrl = process.env.REACT_APP_PROXY_URL;

const searchURL = `${proxyUrl}/search/:query/page/:pageNumber`;
const downloadURL = `${proxyUrl}/download/:photoId/`;

const server = setupServer(
    rest.get(searchURL, (req, res, ctx) =>
        res(ctx.status(200),
            ctx.json({
                status: 200,
                type: 'success',
                response: {
                    results: testSearchResults[req.params.pageNumber - 1],
                    total: 17,
                    total_pages: 2,
                },
            })
        )
    ),
    rest.get(downloadURL, (req, res, ctx) =>
        res(ctx.status(200), ctx.json({ type: 'success' }))
    )
);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('renders without exploding', async () => {
    render(<ImageSearchModal isOpen={true} setImage={() => { }} generateDefaultDimensions={() => { }} toggleModal={() => { }} />);
});

test('happy path works', async () => {
    const mockSetImage = jest.fn();
    const mockDimensions = jest.fn(() => { return { rows: 4, cols: 2 }; });

    render(
        <ImageSearchModal
            isOpen={true}
            setImage={mockSetImage}
            generateDefaultDimensions={mockDimensions}
            toggleModal={() => { }}
        />
    );

    userEvent.type(screen.getByRole('textbox', { name: /Search by keyword/i }), 'cat');
    userEvent.click(screen.getByRole('button', { name: /Search/i }));

    const results = await screen.findAllByTestId('result');

    userEvent.click(results[0]);
    userEvent.click(results[1]);

    expect(screen.getByRole('dialog')).toMatchSnapshot('snapshot with search results');

    userEvent.click(screen.getByRole('button', { name: /Use selected image/i }));

    const expected = testSearchResults[0][1];
    expect(mockSetImage).toHaveBeenCalledTimes(1);
    expect(mockSetImage).toHaveBeenCalledWith(
        expect.objectContaining({
            name: expect.stringContaining('Unsplash Photo'),
            url: expected.urls.regular,
            author: expected.user.name,
            defaultRows: 4,
            defaultCols: 2,
            source: expect.objectContaining({
                sourceName: expect.stringMatching(/Unsplash/i),
                nameIsTitle: false,
                isPhoto: true,
                sourceUrl: expected.links.html,
            }),
        })
    );
});

test('happy path works (with page navigation)', async () => {
    const mockSetImage = jest.fn();
    const mockDimensions = jest.fn(() => { return { rows: 4, cols: 2 }; });
    const mockScroll = jest.fn();

    // Stub DOM method that doesn't exist in the testing environment
    window.HTMLElement.prototype.scrollIntoView = mockScroll;

    render(
        <ImageSearchModal
            isOpen={true}
            setImage={mockSetImage}
            generateDefaultDimensions={mockDimensions}
            toggleModal={() => { }}
        />
    );

    userEvent.type(screen.getByRole('textbox', { name: /Search by keyword/i }), 'cat');
    userEvent.click(screen.getByRole('button', { name: /Search/i }));

    const firstPageResults = await screen.findAllByTestId('result');

    userEvent.click(await screen.findByRole('button', { name: '2' }));

    await waitForElementToBeRemoved(firstPageResults[0]);

    const results = await screen.findAllByTestId('result');
    userEvent.click(results[2]);

    expect(screen.getByRole('dialog')).toMatchSnapshot('snapshot on page 2 of search results');

    userEvent.click(screen.getByRole('button', { name: /Use selected image/i }));

    const expected = testSearchResults[1][2];
    expect(mockSetImage).toHaveBeenCalledTimes(1);
    expect(mockSetImage).toHaveBeenCalledWith(
        expect.objectContaining({
            name: expect.stringContaining('Unsplash Photo'),
            url: expected.urls.regular,
            author: expected.user.name,
            defaultRows: 4,
            defaultCols: 2,
            source: expect.objectContaining({
                sourceName: expect.stringMatching(/Unsplash/i),
                nameIsTitle: false,
                isPhoto: true,
                sourceUrl: expected.links.html,
            }),
        })
    );
    expect(mockScroll).toHaveBeenCalledTimes(1);
});

test('renders correctly with no results', async () => {
    server.use(rest.get(searchURL, (req, res, ctx) =>
        res(ctx.status(200), ctx.json({
            status: 200,
            type: 'success',
            response: {
                results: [],
                total: 0,
                total_pages: 0,
            },
        }))
    ));

    render(<ImageSearchModal isOpen={true} setImage={() => { }} generateDefaultDimensions={() => { }} toggleModal={() => { }} />);

    userEvent.type(screen.getByRole('textbox', { name: /Search by keyword/i }), 'cat');
    userEvent.click(screen.getByRole('button', { name: /Search/i }));

    expect(await screen.findByText(/No results found/)).toBeVisible();
    expect(screen.getByRole('dialog')).toMatchSnapshot();
});

test('search fails if empty/whitespace', async () => {
    server.use(rest.get(searchURL, () => { throw Error('Unexpected network request'); }));

    render(<ImageSearchModal isOpen={true} setImage={() => { }} generateDefaultDimensions={() => { }} toggleModal={() => { }} />);

    const input = screen.getByRole('textbox', { name: /Search by keyword/i });

    // Would be good to rewrite the form so that the validity state is more accessible instead of checking for a class
    //
    // In theory, another way to test would be to check the presence of the "Please enter a search term" error text,
    // but that doesn't work (seems to be because the CSS that hides/shows it isn't loaded in the testing environment)
    expect(input).not.toHaveClass('is-invalid');

    userEvent.click(screen.getByRole('button', { name: /Search/i }));

    expect(input).toHaveValue('');
    expect(input).toHaveClass('is-invalid');

    userEvent.type(screen.getByRole('textbox', { name: /Search by keyword/i }), '    ');
    userEvent.click(screen.getByRole('button', { name: /Search/i }));

    expect(input).toHaveValue('    ');
    expect(input).toHaveClass('is-invalid');
});

test('search escapes special characters', async () => {
    const query = 'q:u/e&r?=y';
    const escapedQuery = encodeURIComponent(query);

    let searchedQuery = '';

    server.use(rest.get(searchURL, (req, res, ctx) => {
        searchedQuery = req.params.query;
        return res(ctx.status(200), ctx.json({
            status: 200,
            type: 'success',
            response: {
                results: testSearchResults[req.params.pageNumber - 1],
                total: 17,
                total_pages: 2,
            }
        }));
    }));

    render(<ImageSearchModal isOpen={true} setImage={() => { }} generateDefaultDimensions={() => { }} toggleModal={() => { }} />);

    userEvent.type(screen.getByRole('textbox', { name: /Search by keyword/i }), query);
    userEvent.click(screen.getByRole('button', { name: /Search/i }));

    await waitFor(() => expect(searchedQuery).toBe(escapedQuery));
});

test('renders error message correctly (proxy error)', async () => {
    server.use(rest.get(searchURL, (req, res, ctx) => res(ctx.status(400))));

    render(<ImageSearchModal isOpen={true} setImage={() => { }} generateDefaultDimensions={() => { }} toggleModal={() => { }} />);

    userEvent.type(screen.getByRole('textbox', { name: /Search by keyword/i }), 'cat');
    userEvent.click(screen.getByRole('button', { name: /Search/i }));

    const errorMessage = await screen.findByRole('alert');
    expect(errorMessage).toBeVisible();
    expect(errorMessage).toMatchSnapshot();
});

test('renders error message correctly (upstream error)', async () => {
    server.use(
        rest.get(searchURL, (req, res, ctx) =>
            res(ctx.status(200), ctx.json({
                status: 400,
                type: 'failure',
                errors: ['Pretend something bad happened'],
            }))
        ),
    );

    render(<ImageSearchModal isOpen={true} setImage={() => { }} generateDefaultDimensions={() => { }} toggleModal={() => { }} />);

    userEvent.type(screen.getByRole('textbox', { name: /Search by keyword/i }), 'cat');
    userEvent.click(screen.getByRole('button', { name: /Search/i }));

    const errorMessage = await screen.findByRole('alert');
    expect(errorMessage).toBeVisible();
    expect(errorMessage).toMatchSnapshot();
});

test('renders rate limit error message correctly (proxy)', async () => {
    server.use(rest.get(searchURL, (req, res, ctx) => res(ctx.status(429))));

    render(<ImageSearchModal isOpen={true} setImage={() => { }} generateDefaultDimensions={() => { }} toggleModal={() => { }} />);

    userEvent.type(screen.getByRole('textbox', { name: /Search by keyword/i }), 'cat');
    userEvent.click(screen.getByRole('button', { name: /Search/i }));

    const errorMessage = await screen.findByRole('alert');
    expect(errorMessage).toBeVisible();
    expect(getByRole(errorMessage, 'heading')).toHaveTextContent(/Rate limit exceeded/i);
    expect(errorMessage).toMatchSnapshot();
});

test('renders rate limit error message correctly (upstream)', async () => {
    server.use(
        rest.get(searchURL, (req, res, ctx) =>
            res(ctx.status(200), ctx.json({
                status: 429,
                type: 'failure',
                errors: ['Rate limit exceeded'],
            }))
        ),
    );

    render(<ImageSearchModal isOpen={true} setImage={() => { }} generateDefaultDimensions={() => { }} toggleModal={() => { }} />);

    userEvent.type(screen.getByRole('textbox', { name: /Search by keyword/i }), 'cat');
    userEvent.click(screen.getByRole('button', { name: /Search/i }));

    const errorMessage = await screen.findByRole('alert');
    expect(errorMessage).toBeVisible();
    expect(getByRole(errorMessage, 'heading')).toHaveTextContent(/Rate limit exceeded/i);
    expect(errorMessage).toMatchSnapshot();
});