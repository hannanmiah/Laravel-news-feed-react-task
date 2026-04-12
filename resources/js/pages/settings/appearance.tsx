import { Head } from '@inertiajs/react';
import AppearanceTabs from '@/components/appearance-tabs';

export default function Appearance() {
    return (
        <>
            <Head title="Appearance settings" />

            <h1 className="sr-only">Appearance settings</h1>

            <div className="_feed_inner_area _b_radious6 _padd_t24 _padd_b24 _padd_r24 _padd_l24 _mar_b24">
                <div className="_mar_b24">
                    <h4 className="_left_inner_area_explore_title _title5 _mar_b8">
                        Appearance settings
                    </h4>
                    <p style={{ color: '#666', fontSize: '14px' }}>
                        Update your account's appearance settings
                    </p>
                </div>

                <AppearanceTabs />
            </div>
        </>
    );
}

Appearance.layout = undefined;
