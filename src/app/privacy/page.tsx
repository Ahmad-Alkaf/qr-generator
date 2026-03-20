import {SITE_NAME, PRIVACY_EMAIL} from '@/lib/constants';
import type {Metadata} from 'next';

export const metadata: Metadata = {
	title: 'Privacy Policy',
	description: `${SITE_NAME} Privacy Policy — learn how we collect, use, and protect your data.`,
	alternates: {canonical: '/privacy'}
};

export default function PrivacyPage() {
	return (
		<div className="py-20">
			<div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
				<h1 className="font-heading text-4xl font-extrabold text-gray-900 dark:text-white">
					Privacy Policy
				</h1>
				<p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
					Last updated: March 19, 2026
				</p>

				<div className="mt-10 space-y-8 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
					<section>
						<h2 className="text-lg font-semibold text-gray-900 dark:text-white">
							1. Information We Collect
						</h2>
						<p className="mt-3">
							We collect the following types of information:
						</p>
						<ul className="mt-2 list-inside list-disc space-y-1">
							<li>
								<strong>Account information:</strong> name,
								email address, and profile image provided
								through your authentication provider (Google,
								GitHub, etc.)
							</li>
							<li>
								<strong>QR code data:</strong> the content you
								encode in your QR codes and associated
								customization settings
							</li>
							<li>
								<strong>
									Scan analytics (Tracked QR codes only):
								</strong>{' '}
								IP address (anonymized), approximate location
								(country/city), device type, operating system,
								browser, and timestamp
							</li>
							<li>
								<strong>Usage data:</strong> pages visited,
								features used, and interaction patterns to
								improve the Service
							</li>
						</ul>
					</section>

					<section>
						<h2 className="text-lg font-semibold text-gray-900 dark:text-white">
							2. How We Use Your Information
						</h2>
						<ul className="mt-3 list-inside list-disc space-y-1">
							<li>To provide and maintain the Service</li>
							<li>To manage your account</li>
							<li>
								To provide scan analytics for Tracked QR codes
							</li>
							<li>
								To send transactional emails (account
								verification, receipts)
							</li>
							<li>
								To improve the Service and develop new features
							</li>
							<li>
								To prevent abuse and enforce our Terms of
								Service
							</li>
						</ul>
					</section>

					<section>
						<h2 className="text-lg font-semibold text-gray-900 dark:text-white">
							3. Direct vs Tracked QR Codes
						</h2>
						<p className="mt-3">
							<strong>Direct QR codes</strong> encode your content
							directly in the QR image. No data passes through our
							servers when these codes are scanned. We have no
							visibility into Direct QR code usage.
						</p>
						<p className="mt-2">
							<strong>Tracked QR codes</strong> redirect through
							our servers, which allows us to collect anonymized
							scan data. This data is used solely to provide scan
							analytics to the QR code owner. IP addresses are not
							stored in full; only approximate geographic location
							is retained.
						</p>
					</section>

					<section>
						<h2 className="text-lg font-semibold text-gray-900 dark:text-white">
							4. Data Sharing
						</h2>
						<p className="mt-3">
							We do not sell your personal information. We may
							share data with:
						</p>
						<ul className="mt-2 list-inside list-disc space-y-1">
							<li>
								<strong>Service providers:</strong> Clerk
								(authentication) and cloud hosting providers
							</li>
							<li>
								<strong>Legal requirements:</strong> when
								required by law or to protect our rights
							</li>
						</ul>
					</section>

					<section>
						<h2 className="text-lg font-semibold text-gray-900 dark:text-white">
							5. Data Retention
						</h2>
						<p className="mt-3">
							Account data is retained as long as your account is
							active. QR code data and scan analytics are retained
							for the duration of your account. You may request
							deletion of your data at any time by contacting us.
						</p>
					</section>

					<section>
						<h2 className="text-lg font-semibold text-gray-900 dark:text-white">
							6. Security
						</h2>
						<p className="mt-3">
							We implement industry-standard security measures
							including encryption in transit (TLS), secure
							authentication via Clerk, and regular security
							audits. However, no method of transmission over the
							Internet is 100% secure.
						</p>
					</section>

					<section>
						<h2 className="text-lg font-semibold text-gray-900 dark:text-white">
							7. Your Rights
						</h2>
						<p className="mt-3">You have the right to:</p>
						<ul className="mt-2 list-inside list-disc space-y-1">
							<li>
								Access, update, or delete your personal
								information
							</li>
							<li>Export your QR code data</li>
							<li>Opt out of non-essential communications</li>
							<li>Request a copy of data we hold about you</li>
						</ul>
					</section>

					<section>
						<h2 className="text-lg font-semibold text-gray-900 dark:text-white">
							8. Cookies
						</h2>
						<p className="mt-3">
							We use essential cookies for authentication and
							session management. We may use analytics cookies
							(Google Analytics) to understand usage patterns. You
							can control cookie preferences through your browser
							settings.
						</p>
					</section>

					<section>
						<h2 className="text-lg font-semibold text-gray-900 dark:text-white">
							9. Contact
						</h2>
						<p className="mt-3">
							For privacy-related inquiries, contact us at{' '}
							<a
								href={`mailto:${PRIVACY_EMAIL}`}
								className="text-primary hover:underline">
								{PRIVACY_EMAIL}
							</a>
							.
						</p>
					</section>
				</div>
			</div>
		</div>
	);
}
