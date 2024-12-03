import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import Edit from './edit';
import save from './save';
import './style.scss';

registerBlockType('create-block/technical-task', {
	title: __('Technical Task Block', 'technical-task'),
	description: __('A block for managing and displaying categories and subcategories of posts', 'technical-task'),
	category: 'common',
	icon: 'clipboard',
	supports: {
		html: false,
		multiple: true,
		reusable: true,
		anchor: true,
		align: ['wide', 'full']
	},
	attributes: {
		selectedPostType: {
			type: 'string',
			default: ''
		},
		selectedCategory: {
			type: 'string',
			default: '',
			required: true
		},
		customHeading: {
			type: 'string',
			default: ''
		}
	},
	edit: Edit,
	save: save,
	deprecated: [
		{
			attributes: {
				selectedPostType: {
					type: 'string',
					default: ''
				},
				selectedCategory: {
					type: 'string',
					default: ''
				},
				customHeading: {
					type: 'string',
					default: 'h2'
				}
			},
			isEligible: ({ selectedCategory }) => !selectedCategory,
			migrate: (attributes) => {
				return {
					...attributes,
					selectedCategory: ''
				};
			},
			save
		}
	]
});