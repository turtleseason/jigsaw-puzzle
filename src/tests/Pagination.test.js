import { render, screen, getByRole, getByText } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import Pagination from '../controls/Pagination.js';


describe('Pagination', () => {
    test('renders without exploding', () => {
        render(<Pagination currentPage={3}/>);
    });

    test('renders correctly in middle of page range', () => {
        const { asFragment } = render(<Pagination currentPage={5} numPageLinks={2}/>);
        expect(asFragment()).toMatchSnapshot();
    });

    // (For comparison of testing methods - manually checking for important elements vs. snapshot testing)
    test('renders correctly in middle of page range (non-snapshot)', () => {
        render(<Pagination currentPage={5} numPageLinks={2}/>);

        expect(screen.getByRole('link', {name : '< Back'})).toBeVisible();
        expect(screen.getByRole('link', {name : 'More >'})).toBeVisible();
        
        const expectedItems = ['...', '3', '4', '5', '6', '7', '...'];
        
        const listItems = screen.getAllByRole('listitem');
        expect(listItems).toHaveLength(expectedItems.length);
        
        for (let i = 0; i < listItems.length; i++) {
            const content = expectedItems[i];
            if (content === '...' || content === '5') {
                expect(getByText(listItems[i], content)).toBeInTheDocument();
            } else {
                expect(getByRole(listItems[i], 'link', { name: content })).toBeInTheDocument();
            }
        }
    });
    
    test('renders correctly at start of page range', () => {
        const { asFragment } = render(<Pagination currentPage={1} minPage={1} numPageLinks={2}/>);
        expect(asFragment()).toMatchSnapshot();
    });
    
    test('renders correctly at end of page range', () => {
        const { asFragment } = render(<Pagination currentPage={10} maxPage={10}/>);
        expect(asFragment()).toMatchSnapshot();
    });

    test('renders correctly for whole page range', () => {
        const { asFragment } = render(<Pagination currentPage={2} minPage={1} maxPage={4} numPageLinks={2}/>);
        expect(asFragment()).toMatchSnapshot();
    });

    test('"back" callback works', () => {
        const mockFn = jest.fn();
        
        render(<Pagination currentPage={5} minPage={1} maxPage={10} onPageChange={mockFn}/>);

        userEvent.click(screen.getByRole('link', { name: /Back/ }));
        expect(mockFn).toHaveBeenCalledWith(4);
    });

    test('"next" callback works', () => {
        const mockFn = jest.fn();

        render(<Pagination currentPage={5} minPage={1} maxPage={10} onPageChange={mockFn}/>);

        userEvent.click(screen.getByRole('link', { name: /More/ }));
        expect(mockFn).toHaveBeenCalledWith(6);
    });

    test('number link callbacks work', () => {
        const mockFn = jest.fn();

        render(<Pagination currentPage={5} numPageLinks={3} onPageChange={mockFn}/>);

        for (let i = 2; i <= 8; i++) {
            if (i !== 5) {  // skip current page (it is not a link)
                userEvent.click(screen.getByRole('link', { name: i }));
                expect(mockFn).toHaveBeenLastCalledWith(i);        
            }
        }
    });
});