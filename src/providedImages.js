import { ImageInfo, ImageSource } from './ImageInfo';

import img1 from './images/ito-jakuchu-red-parrot-on-the-branch-of-a-tree.jpg';
import img2 from './images/david-clode-eOSqRq2Qm1c-unsplash.jpg';
import img3 from './images/casey-horner-80UR4DM2Rz0-unsplash.jpg';
import img4 from './images/van-gogh-roses-nga.jpg';
import img5 from './images/scott-webb-lYzgtps0UtQ-unsplash.jpg';
import img6 from './images/travel-sourced-FsmcD6uKcHk-unsplash.jpg';


const providedImages = [
    new ImageInfo('Red Parrot on the Branch of a Tree', img1, 6, 8, 'Itō Jakuchū', 
        new ImageSource('Metropolitan Museum of Art', true, false, 'https://www.metmuseum.org/art/collection/search/57123'), 'Red Parrot'),
    new ImageInfo('Coral', img2, 7, 10, 'David Clode',
        new ImageSource('Unsplash', false, true, 'https://unsplash.com/photos/eOSqRq2Qm1c')),
    new ImageInfo('Starry Sky', img3, 7, 10, 'Casey Horner',
        new ImageSource('Unsplash', false, true, 'https://unsplash.com/photos/80UR4DM2Rz0')),
    new ImageInfo('Roses', img4, 8, 10, 'Vincent van Gogh',
        new ImageSource('National Gallery of Art', true, false, 'https://www.nga.gov/collection/art-object-page.72328.html')),
    new ImageInfo('Succulents', img5, 8, 5, 'Scott Webb',
        new ImageSource('Unsplash', false, true, 'https://unsplash.com/photos/lYzgtps0UtQ')),
    new ImageInfo('Jellyfish', img6, 7, 10, 'Travel Sourced',
        new ImageSource('Unsplash', false, true, 'https://unsplash.com/photos/FsmcD6uKcHk'))
];

export default providedImages;