import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { useState, useEffect } from '@wordpress/element';
import { SelectControl, Spinner, TextControl } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';
import PostGrid from './components/PostGrid';

export default function Edit({ attributes, setAttributes }) {
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [posts, setPosts] = useState([]);
    const [loadingPosts, setLoadingPosts] = useState(false);

    const postTypes = [
        { label: __('Posts', 'my-block'), value: 'posts' },
        { label: __('Pages', 'my-block'), value: 'pages' }
    ];

    useEffect(() => {
        if (attributes.selectedPostType) {
            setLoadingCategories(true);
            apiFetch({ path: '/wp/v2/categories' })
                .then((fetchedCategories) => {
                    const categoryOptions = fetchedCategories.map((cat) => ({
                        label: cat.name,
                        value: cat.id.toString(),
                    }));
                    setCategories(categoryOptions);
                })
                .catch((error) => console.error('Error fetching categories:', error))
                .finally(() => setLoadingCategories(false));
        }
    }, [attributes.selectedPostType]);

    useEffect(() => {
        if (attributes.selectedPostType && attributes.selectedCategory) {
            setLoadingPosts(true);
            apiFetch({
                path: `/wp/v2/${attributes.selectedPostType}?categories=${attributes.selectedCategory}&_embed`
            })
                .then((response) => {
                    setPosts(response);
                })
                .catch((error) => console.error('Error fetching posts:', error))
                .finally(() => setLoadingPosts(false));
        }
    }, [attributes.selectedPostType, attributes.selectedCategory]);

    return (
        <div {...useBlockProps()}>
            <div className="post-grid-controls">
                <TextControl
                    label={__('Custom Heading H2', 'my-block')}
                    value={attributes.customHeading}
                    onChange={(value) => setAttributes({ customHeading: value })}
                    placeholder={__('Enter custom heading text...', 'my-block')}
                />
                <SelectControl
                    label={__('Select Post Type', 'my-block')}
                    value={attributes.selectedPostType}
                    options={[
                        { label: __('Select a post type...', 'my-block'), value: '' },
                        ...postTypes,
                    ]}
                    onChange={(value) => {
                        setAttributes({ selectedPostType: value });
                        setAttributes({ selectedCategory: '' });
                        setPosts([]);
                    }}
                />

                {attributes.selectedPostType && (
                    loadingCategories ? (
                        <Spinner />
                    ) : (
                        <SelectControl
                            label={__('Select Category', 'my-block')}
                            value={attributes.selectedCategory}
                            options={[
                                { label: __('Select a category...', 'my-block'), value: '' },
                                ...categories,
                            ]}
                            onChange={(value) => setAttributes({ selectedCategory: value })}
                        />
                    )
                )}

                {attributes.selectedPostType && !attributes.selectedCategory && (
                    <p className="error-message">
                        {__('Please select a category to display posts.', 'my-block')}
                    </p>
                )}
            </div>

            {attributes.selectedPostType && attributes.selectedCategory && (
                loadingPosts ? (
                    <Spinner />
                ) : (
                    posts.length > 0 ? (
                        <PostGrid
                            postType={attributes.selectedPostType}
                            categoryId={attributes.selectedCategory}
                            customHeading={attributes.customHeading}
                        />
                    ) : (
                        <p className="no-posts-message">
                            {__('No posts found in this category.', 'my-block')}
                        </p>
                    )
                )
            )}
        </div>
    );
}
