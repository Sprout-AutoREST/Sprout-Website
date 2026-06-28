// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// When deploying to GitHub Pages on its own repo, uncomment and set:

export default defineConfig({
	site: 'https://sprout-flix29.de',
	base: '/sprout-website',
	integrations: [
		starlight({
			title: 'Sprout',
			description:
				'Generate Spring Boot REST APIs from your JPA entities at compile time.',
			logo: {
				src: './src/assets/sprout-logo.svg',
				replacesTitle: false,
			},
			social: [
				{
					icon: 'github',
					label: 'GitHub',
					href: 'https://github.com/Flix-29/Sprout',
				},
			],
			customCss: ['./src/styles/custom.css'],
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						{ label: 'Introduction', slug: 'guides/introduction' },
						{ label: 'Requirements', slug: 'guides/requirements' },
						{ label: 'Installation', slug: 'guides/installation' },
						{ label: 'Quick Start', slug: 'guides/quick-start' },
					],
				},
				{
					label: 'Reference',
					items: [
						{ label: 'Generated Code Layout', slug: 'reference/generated-code' },
						{ label: 'Marker Class', slug: 'reference/marker-class' },
						{ label: 'Endpoints & HTTP Semantics', slug: 'reference/endpoints' },
						{ label: 'Annotations', slug: 'reference/annotations' },
						{ label: 'Optional Integrations', slug: 'reference/integrations' },
						{ label: 'sprout-runtime', slug: 'reference/sprout-runtime' },
						{ label: 'Customization', slug: 'reference/customization' },
						{ label: 'ID Resolution', slug: 'reference/id-resolution' },
					],
				},
				{
					label: 'Help',
					items: [
						{ label: 'Troubleshooting', slug: 'help/troubleshooting' },
						{ label: 'Limitations', slug: 'help/limitations' },
					],
				},
			],
		}),
	],
});
