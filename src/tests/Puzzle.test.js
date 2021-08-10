import { render, screen, getAllByLabelText, getByTestId, prettyDOM } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import App from '../App.js';

const arePuzzlePiecesEqual = (a, b, clipPathsA, clipPathsB) => {
    const clipPathA = clipPathsA.getElementById(a.getAttribute('clip-path').replace('url(#', '').replace(')', ''));
    const clipPathB = clipPathsB.getElementById(b.getAttribute('clip-path').replace('url(#', '').replace(')', ''));

    // approximate compare?
    const positionMatches = a.parentElement.style.left === b.parentElement.style.left
        && a.parentElement.style.top === b.parentElement.style.top;

    const imagePositionMatches = a.firstElementChild.getAttribute('x') === b.firstElementChild.getAttribute('x')
        && a.firstElementChild.getAttribute('y') === b.firstElementChild.getAttribute('y');

    const pieceShapeMatches = clipPathA.firstElementChild.getAttribute('d') === clipPathB.firstElementChild.getAttribute('d');

    return positionMatches && imagePositionMatches && pieceShapeMatches;
};

expect.extend({
    toMatchPieces(received, expected) {
        const initialPieces = getAllByLabelText(expected, /Puzzle piece/);
        const initialClipPaths = getByTestId(expected, 'clip-path-container');

        const resultPieces = getAllByLabelText(received, /Puzzle piece/);
        const resultClipPaths = getByTestId(received, 'clip-path-container');

        let pass = true;
        for (const piece of resultPieces) {
            if (!initialPieces.some(initialPiece => arePuzzlePiecesEqual(piece, initialPiece, resultClipPaths, initialClipPaths))) {
                pass = false;
                break;
            }
        }

        return {
            pass,
            message: () => `expected pieces ${pass ? 'not ' : ''}to match;
            expected: ${initialPieces.map(e => prettyDOM(e.parentElement, undefined, { min: true })).join(',\n')}
            received: ${resultPieces.map(e => prettyDOM(e.parentElement, undefined, { min: true })).join(',\n')}`,
        };
    }
});

describe('Puzzle/App', () => {
    beforeAll(() => {
        // https://stackoverflow.com/a/49204336
        // create-react-app doesn't support configuring jest's testEnvironmentOptions, so this ensures onload will be raised.
        Object.defineProperty(global.Image.prototype, 'src', {
            set(_) {
                setTimeout(() => this.onload());
            }
        });

        // Mock the sizes of elements that the puzzle uses to calculate piece size & position 
        Object.defineProperty(global.Image.prototype, 'naturalWidth', { get() { return 876; } });
        Object.defineProperty(global.Image.prototype, 'naturalHeight', { get() { return 654; } });

        Object.defineProperty(document.documentElement, 'clientWidth', { get() { return window.innerWidth; } });
        Object.defineProperty(document.documentElement, 'clientHeight', { get() { return window.innerHeight; } });

        // Need to set this globally for div elements because there isn't (afaik) currently a way to intercept
        // & update the puzzle node specifically between when it renders and when the puzzle is laid out
        // (otherwise something like https://github.com/jsdom/jsdom/issues/2342#issuecomment-468253441 might be preferable);
        // clientWidth/Height are currently only called on the document and .puzzle-background, so it shouldn't affect anything else
        Object.defineProperty(global.HTMLDivElement.prototype, 'clientWidth', { get() { return window.innerWidth * .95; } });
        Object.defineProperty(global.HTMLDivElement.prototype, 'clientHeight', { get() { return window.innerHeight * .95; } });
    });

    test('loaded puzzle pieces match saved puzzle pieces', async () => {
        const { asFragment } = render(<App />);

        await screen.findAllByLabelText(/Puzzle piece/i);
        const initialView = asFragment();

        userEvent.click(screen.getByRole('button', { name: /Settings/i }));
        userEvent.click(await screen.findByRole('button', { name: /Save now/i }));
        userEvent.click(screen.getByRole('button', { name: /Done/i }));

        userEvent.click(screen.getByRole('button', { name: /New puzzle/i }));

        // Make sure that a new puzzle actually loaded
        await screen.findAllByLabelText(/Puzzle piece/i);  // (is this a reliable way to wait for puzzle reload?)
        expect(asFragment()).not.toMatchPieces(initialView);

        userEvent.click(screen.getByRole('button', { name: /Settings/i }));
        userEvent.click(await screen.findByRole('button', { name: /Load last saved puzzle/i }));
        userEvent.click(screen.getByRole('button', { name: /Done/i }));

        await screen.findAllByLabelText(/Puzzle piece/i);
        expect(asFragment()).toMatchPieces(initialView);
    });
});