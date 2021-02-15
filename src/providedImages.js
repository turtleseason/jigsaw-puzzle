import { ImageInfo, ImageSource } from './ImageInfo';


const providedImages = [
    new ImageInfo('Red Parrot on the Branch of a Tree', 'images/ito-jakuchu-red-parrot-on-the-branch-of-a-tree.jpg', 6, 8, 'Itō Jakuchū', 
        new ImageSource('Metropolitan Museum of Art', true, false, 'https://www.metmuseum.org/art/collection/search/57123'), 'Red Parrot'),
    new ImageInfo('Coral', 'images/david-clode-eOSqRq2Qm1c-unsplash.jpg', 7, 10, 'David Clode',
        new ImageSource('Unsplash', false, true, 'https://unsplash.com/photos/eOSqRq2Qm1c')),
    new ImageInfo('Starry Sky', 'images/casey-horner-80UR4DM2Rz0-unsplash.jpg', 7, 10, 'Casey Horner',
        new ImageSource('Unsplash', false, true, 'https://unsplash.com/photos/80UR4DM2Rz0')),
    new ImageInfo('Roses', 'images/van-gogh-roses-nga.jpg', 8, 10, 'Vincent van Gogh',
        new ImageSource('National Gallery of Art', true, false, 'https://www.nga.gov/collection/art-object-page.72328.html')),
    new ImageInfo('Succulents', 'images/scott-webb-lYzgtps0UtQ-unsplash.jpg', 11, 7, 'Scott Webb',
        new ImageSource('Unsplash', false, true, 'https://unsplash.com/photos/lYzgtps0UtQ')),
    new ImageInfo('Jellyfish', 'images/travel-sourced-FsmcD6uKcHk-unsplash.jpg', 7, 10, 'Travel Sourced',
        new ImageSource('Unsplash', false, true, 'https://unsplash.com/photos/FsmcD6uKcHk')),
    new ImageInfo('freebirb', 'lunar_festival.png', 7, 10, 'Kan Gao')
];

export default providedImages;