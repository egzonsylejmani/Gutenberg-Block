import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export default function save({ attributes }) {
    const blockProps = useBlockProps.save();
    
    if (!attributes.selectedPostType || !attributes.selectedCategory) {
        return (
            <div { ...blockProps }>
                <p className="error-message">
                    {__('Please select a post type and category to display posts.', 'my-block')}
                </p>
            </div>
        );
    }

    return <div { ...blockProps } />;
}