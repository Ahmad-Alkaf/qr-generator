import {SITE_NAME} from '@/lib/constants';
import type {Metadata} from 'next';

export const metadata: Metadata = {
	title: 'Terms of Service',
	description: `${SITE_NAME} Terms of Service — read our terms and conditions for using the QR code generator platform.`,
	alternates: {canonical: '/terms'}
};

export default function TermsPage() {
	return (
		<div className="py-20">
			<div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
				<h1 className="font-heading text-4xl font-extrabold text-gray-900 dark:text-white">
					Terms of Service
				</h1>
				<p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
					Last updated: March 19, 2026
				</p>

				<div className="mt-10 space-y-8 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
					<section>
						<h2 className="text-lg font-semibold text-gray-900 dark:text-white">
							1. Acceptance of Terms
						</h2>
						<p className="mt-3">
							By accessing or using {SITE_NAME} (&quot;the
							Service&quot;), you agree to be bound by these Terms
							of Service. If you do not agree to these terms,
							please do not use the Service.
						</p>
					</section>

					<section>
						<h2 className="text-lg font-semibold text-gray-900 dark:text-white">
							2. Description of Service
						</h2>
						<p className="mt-3">
							{SITE_NAME} provides a free QR code generation platform
							that allows users to create, customize, and track QR
							codes.
						</p>
					</section>

					<section>
						<h2 className="text-lg font-semibold text-gray-900 dark:text-white">
							3. User Accounts
						</h2>
						<p className="mt-3">
							Some features require an account. You are
							responsible for maintaining the security of your
							account credentials. You must provide accurate
							information when creating an account.
						</p>
					</section>

					<section>
						<h2 className="text-lg font-semibold text-gray-900 dark:text-white">
							4. Acceptable Use
						</h2>
						<p className="mt-3">
							You agree not to use the Service to:
						</p>
						<ul className="mt-2 list-inside list-disc space-y-1">
							<li>
								Generate QR codes that link to malicious,
								illegal, or harmful content
							</li>
							<li>
								Distribute malware, phishing links, or
								fraudulent content
							</li>
							<li>Violate any applicable laws or regulations</li>
							<li>
								Infringe on intellectual property rights of
								others
							</li>
							<li>
								Attempt to circumvent rate limits or access
								controls
							</li>
						</ul>
					</section>

					<section>
						<h2 className="text-lg font-semibold text-gray-900 dark:text-white">
							5. QR Code Data & Tracked QR Codes
						</h2>
						<p className="mt-3">
							Direct QR codes encode content directly and do not
							pass through our servers. Tracked QR codes redirect
							through our servers to enable scan analytics. We
							collect anonymized scan data (country, device type,
							browser) for Tracked QR codes as described in our
							Privacy Policy.
						</p>
					</section>

					<section>
						<h2 className="text-lg font-semibold text-gray-900 dark:text-white">
							6. Limitation of Liability
						</h2>
						<p className="mt-3">
							The Service is provided &quot;as is&quot; without
							warranties of any kind. {SITE_NAME} shall not be liable
							for any indirect, incidental, or consequential
							damages arising from your use of the Service.
						</p>
					</section>

					<section>
						<h2 className="text-lg font-semibold text-gray-900 dark:text-white">
							7. Modifications
						</h2>
						<p className="mt-3">
							We reserve the right to modify these terms at any
							time. We will notify users of significant changes
							via email or through the Service. Continued use
							after changes constitutes acceptance.
						</p>
					</section>

					<section>
						<h2 className="text-lg font-semibold text-gray-900 dark:text-white">
							8. Contact
						</h2>
						<p className="mt-3">
							For questions about these Terms, contact us at{' '}
							<a
								href="mailto:legal@qrforge.app"
								className="text-primary hover:underline">
								legal@qrforge.app
							</a>
							.
						</p>
					</section>
				</div>
			</div>
		</div>
	);
}
