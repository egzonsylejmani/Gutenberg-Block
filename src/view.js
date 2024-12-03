import { render, createElement } from '@wordpress/element';
import PostGrid from './components/PostGrid';

// Find all instances of our block on the page
document.addEventListener('DOMContentLoaded', () => {
    const containers = document.querySelectorAll('.wp-block-create-block-technical-task');
    
    containers.forEach(container => {
        const postType = container.dataset.postType;
        const categoryId = container.dataset.category;
        const customHeading = container.dataset.customHeader;
        
        if (postType && categoryId) {
            render(
                createElement(PostGrid, {
                    postType: postType,
                    categoryId: categoryId,
                    customHeading: customHeading
                }),
                container
            );
        }
    });
});