import { Head, Link, usePage } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import FeedHeaderShell from '@/components/feed/header-shell';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { toUrl } from '@/lib/utils';
import type { User } from '@/types';
import { edit as editAppearance } from '@/routes/appearance';
import { edit } from '@/routes/profile';
import { edit as editSecurity } from '@/routes/security';

type SettingsPageProps = {
    auth: {
        user: User;
    };
};

const sidebarNavItems = [
    {
        title: 'Profile',
        href: edit(),
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" fill="none" viewBox="0 0 18 19">
                <path fill="#377DFF" d="M9.584 0c.671 0 1.315.267 1.783.74.468.473.721 1.112.7 1.709l.009.14a.985.985 0 00.136.395c.145.242.382.418.659.488.276.071.57.03.849-.13l.155-.078c1.165-.538 2.563-.11 3.21.991l.58.99a.695.695 0 01.04.081l.055.107c.519 1.089.15 2.385-.838 3.043l-.244.15a1.046 1.046 0 00-.313.339 1.042 1.042 0 00-.11.805c.074.272.255.504.53.66l.158.1c.478.328.823.812.973 1.367.17.626.08 1.292-.257 1.86l-.625 1.022-.094.144c-.735 1.038-2.16 1.355-3.248.738l-.129-.066a1.123 1.123 0 00-.412-.095 1.087 1.087 0 00-.766.31c-.204.2-.317.471-.316.786l-.008.163C11.956 18.022 10.88 19 9.584 19h-1.17c-1.373 0-2.486-1.093-2.484-2.398l-.008-.14a.994.994 0 00-.14-.401 1.066 1.066 0 00-.652-.493 1.12 1.12 0 00-.852.127l-.169.083a2.526 2.526 0 01-1.698.122 2.47 2.47 0 01-1.488-1.154l-.604-1.024-.08-.152a2.404 2.404 0 01.975-3.132l.1-.061c.292-.199.467-.527.467-.877 0-.381-.207-.733-.569-.94l-.147-.092a2.419 2.419 0 01-.724-3.236l.615-.993a2.503 2.503 0 013.366-.912l.126.066c.13.058.269.089.403.09a1.08 1.08 0 001.086-1.068l.008-.185c.049-.57.301-1.106.713-1.513A2.5 2.5 0 018.414 0h1.17zm0 1.375h-1.17c-.287 0-.562.113-.764.312-.179.177-.288.41-.308.628l-.012.29c-.098 1.262-1.172 2.253-2.486 2.253a2.475 2.475 0 01-1.013-.231l-.182-.095a1.1 1.1 0 00-1.488.407l-.616.993a1.05 1.05 0 00.296 1.392l.247.153A2.43 2.43 0 013.181 9.5c0 .802-.401 1.552-1.095 2.023l-.147.091c-.486.276-.674.873-.448 1.342l.053.102.597 1.01c.14.248.374.431.652.509.246.069.51.05.714-.04l.103-.05a2.506 2.506 0 011.882-.248 2.456 2.456 0 011.823 2.1l.02.335c.059.535.52.95 1.079.95h1.17c.566 0 1.036-.427 1.08-.95l.005-.104a2.412 2.412 0 01.726-1.732 2.508 2.508 0 011.779-.713c.331.009.658.082.992.23l.3.15c.469.202 1.026.054 1.309-.344l.068-.105.61-1a1.045 1.045 0 00-.288-1.383l-.257-.16a2.435 2.435 0 01-1.006-1.389 2.393 2.393 0 01.25-1.847c.181-.31.429-.575.752-.795l.152-.095c.485-.278.672-.875.448-1.346l-.067-.127-.012-.027-.554-.945a1.095 1.095 0 00-1.27-.487l-.105.041-.098.049a2.515 2.515 0 01-1.88.259 2.47 2.47 0 01-1.511-1.122 2.367 2.367 0 01-.325-.97l-.012-.24a1.056 1.056 0 00-.307-.774 1.096 1.096 0 00-.779-.323zm-.58 5.02c1.744 0 3.16 1.39 3.16 3.105s-1.416 3.105-3.16 3.105c-1.746 0-3.161-1.39-3.161-3.105s1.415-3.105 3.16-3.105zm0 1.376c-.973 0-1.761.774-1.761 1.729 0 .955.788 1.73 1.76 1.73s1.76-.775 1.76-1.73-.788-1.73-1.76-1.73z" />
            </svg>
        ),
    },
    {
        title: 'Security',
        href: editSecurity(),
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" fill="none" viewBox="0 0 18 19">
                <path fill="#377DFF" d="M9 .5a4.5 4.5 0 014.5 4.5v2H15a1 1 0 011 1v8a1 1 0 01-1 1H3a1 1 0 01-1-1V8a1 1 0 011-1h1.5V5A4.5 4.5 0 019 .5zm0 1.5a3 3 0 00-3 3v2h6V5a3 3 0 00-3-3zm0 8a1.5 1.5 0 00-.75 2.798V14.5a.75.75 0 001.5 0v-1.702A1.5 1.5 0 009 10z" />
            </svg>
        ),
    },
    {
        title: 'Appearance',
        href: editAppearance(),
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" fill="none" viewBox="0 0 18 19">
                <path fill="#377DFF" d="M9 1a8 8 0 100 16A8 8 0 009 1zM.5 9a8.5 8.5 0 1117 0 8.5 8.5 0 01-17 0zm8.25-5.5a.5.5 0 01.5.5v2.598l2.25 1.299a.5.5 0 01-.5.866L8.5 7.326a.5.5 0 01-.25-.433V4a.5.5 0 01.5-.5z" />
            </svg>
        ),
    },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { isCurrentOrParentUrl } = useCurrentUrl();
    const { auth } = usePage<SettingsPageProps>().props;

    return (
        <>
            <Head title="Settings" />

            <div className="_layout _layout_main_wrapper">
                <div className="_main_layout">
                    <FeedHeaderShell
                        user={{
                            first_name: auth.user.first_name,
                            last_name: auth.user.last_name,
                            full_name: auth.user.full_name,
                        }}
                    />

                    <div className="container _custom_container">
                        <div className="_layout_inner_wrap">
                            <div className="row justify-content-center mt-4">
                                <div className="col-xl-10 col-lg-10 col-md-12 col-sm-12">
                                    <div className="_feed_inner_area _b_radious6 _padd_t24 _padd_b24 _padd_r24 _padd_l24 _mar_b24">
                                        <h4 className="_left_inner_area_explore_title _title5 _mar_b8">
                                            Settings
                                        </h4>
                                        <p style={{ color: '#666', fontSize: '14px' }}>
                                            Manage your profile and account settings
                                        </p>
                                    </div>

                                    <div className="row">
                                        <div className="col-xl-3 col-lg-3 col-md-4 col-sm-12">
                                            <div className="_feed_inner_area _b_radious6 _padd_t16 _padd_b16 _padd_r8 _padd_l8 _mar_b24">
                                                <ul className="_left_inner_area_explore_list">
                                                    {sidebarNavItems.map((item) => {
                                                        const isActive = isCurrentOrParentUrl(item.href);

                                                        return (
                                                            <li key={toUrl(item.href)} className="_left_inner_area_explore_item">
                                                                <Link
                                                                    href={item.href}
                                                                    className={`_left_inner_area_explore_link ${isActive ? '_left_inner_area_explore_link_active' : ''}`}
                                                                    style={isActive ? { color: '#377DFF', fontWeight: 500 } : undefined}
                                                                >
                                                                    <span style={{ marginRight: 8, display: 'inline-flex', alignItems: 'center' }}>
                                                                        {item.icon}
                                                                    </span>
                                                                    {item.title}
                                                                </Link>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                        </div>

                                        <div className="col-xl-9 col-lg-9 col-md-8 col-sm-12">
                                            {children}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
