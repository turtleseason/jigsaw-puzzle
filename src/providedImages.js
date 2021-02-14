import { ImageInfo, ImageSource } from './ImageInfo';


const providedImages = [
    new ImageInfo('Roses', 'images/van-gogh-roses-nga.jpg', 8, 10, 'Vincent van Gogh', new ImageSource('National Gallery of Art', true, false)),
    new ImageInfo('Moonlit field', 'images/luca-huter-vFrhuBvI-hI-unsplash.jpg', 7, 10, 'Luca Huter', new ImageSource('unsplash', false, true)),
    new ImageInfo('Wish', 'images/casey-horner-80UR4DM2Rz0-unsplash.jpg', 7, 10, 'Casey Horner', new ImageSource('unsplash', true, true)),
    new ImageInfo('Coral', 'images/david-clode-eOSqRq2Qm1c-unsplash.jpg', 7, 10, 'David Clode', new ImageSource('unsplash', false, true)),
    new ImageInfo('Jellyfish', 'images/travel-sourced-FsmcD6uKcHk-unsplash.jpg', 7, 10, 'Travel Sourced', new ImageSource('unsplash', false, true)),
    new ImageInfo('Succulents', 'images/scott-webb-lYzgtps0UtQ-unsplash.jpg', 11, 7, 'Scott Webb', new ImageSource('unsplash', false, true)),
    new ImageInfo('freebirb', 'lunar_festival.png', 7, 10, 'Kan Gao'),
];

export default providedImages;