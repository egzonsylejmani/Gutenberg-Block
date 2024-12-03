<?php

/**
 * Plugin Name:       Technical Task Block
 * Description:       Technical Task Block.
 * Requires at least: 6.6
 * Requires PHP:      7.2
 * Version:           0.1.0
 * Author:            Egzon Sylejmani
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       technical-task-block
 *
 * @package          TechnicalTaskBlock
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

function create_block_technical_task_block_init() {
    register_block_type( __DIR__ . '/build', array(
        'render_callback' => 'render_technical_task_block'
    ));

    wp_register_script(
        'technical-task-frontend',
        plugins_url( 'build/view.js', __FILE__ ),
        array( 'wp-element', 'wp-api-fetch' ),
        filemtime( plugin_dir_path( __FILE__ ) . 'build/view.js' )
    );
}
add_action( 'init', 'create_block_technical_task_block_init' );

function render_technical_task_block( $attributes ) {
    wp_enqueue_script( 'technical-task-frontend' );
    
    $post_type = $attributes['selectedPostType'] ?? '';
    $category = $attributes['selectedCategory'] ?? '';
	$custom_header = $attributes['customHeading'] ?? '';
    
    return sprintf(
		'<div class="wp-block-create-block-technical-task" data-post-type="%s" data-category="%s" data-custom-header="%s"></div>',
        esc_attr($post_type),
        esc_attr($category),
		esc_attr($custom_header)
    );
}