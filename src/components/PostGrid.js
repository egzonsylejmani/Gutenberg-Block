import { useState, useEffect } from '@wordpress/element';
import { Spinner } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';
import React from 'react';
import parse from 'html-react-parser';

import '../style.scss';

const PostGrid = ({ postType, categoryId, customHeading }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (postType && categoryId) {
            fetchPosts();
        }
    }, [postType, categoryId]);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const response = await apiFetch({
                path: `/wp/v2/${postType}?categories=${categoryId}&_embed`
            });
            setPosts(response);
        } catch (err) {
            console.error(err);
            setError('Error loading posts');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="post-grid-container">
                <Spinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="post-grid-container">
                <p className="error-message">{error}</p>
            </div>
        );
    }

    if (!posts || posts.length === 0) {
        return (
            <div className="post-grid-container">
                {customHeading && (
                    <h2 className="post-grid-header">{customHeading}</h2>
                )}
                <p className="no-posts-message">
                    {__('No posts found in this category.', 'my-block')}
                </p>
            </div>
        );
    }

    return (
        <div className="post-grid-container">
            {customHeading && (
                <h2 className="post-grid-header">{customHeading}</h2>
            )}
            <div className="post-grid">
                {posts.map(post => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>
        </div>
    );
};

const PostCard = ({ post }) => {
    const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
    const author = post._embedded?.['author']?.[0]?.name;

    return (
        <article className="post-card">
            {featuredImage && (
                <div className="post-thumbnail">
                    <img src={featuredImage} alt={parse(post.title.rendered)} />
                </div>
            )}
            
            <div className="post-content">
                <h2 className="post-title">
                    <a href={post.link}>
                        {parse(post.title.rendered)}
                    </a>
                </h2>
                
                <div className="post-meta">
                    <span className="post-date">
                        {new Date(post.date).toLocaleDateString()}
                    </span>
                    {author && (
                        <span className="post-author">
                            by {author}
                        </span>
                    )}
                </div>
                
                <div className="post-excerpt">
                    {parse(post.excerpt.rendered)}
                </div>
                
                <a href={post.link} className="read-more">
                    Read More →
                </a>
            </div>
        </article>
    );
};

export default PostGrid;