import {SITE_NAME} from '@/lib/constants';
import type {Metadata} from 'next';
import {redirect} from 'next/navigation';

export const metadata: Metadata = {
	title: `Support ${SITE_NAME}`,
	description: `Support the ${SITE_NAME} project.`,
	alternates: {canonical: '/support'}
};

export default function PricingPage() {
	redirect('/support');
}
