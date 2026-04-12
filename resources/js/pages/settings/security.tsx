import { Transition } from '@headlessui/react';
import { Form, Head } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import SecurityController from '@/actions/App/Http/Controllers/Settings/SecurityController';
import InputError from '@/components/input-error';

export default function Security() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    return (
        <>
            <Head title="Security settings" />

            <h1 className="sr-only">Security settings</h1>

            <div className="_feed_inner_area _b_radious6 _padd_t24 _padd_b24 _padd_r24 _padd_l24 _mar_b24">
                <div className="_mar_b24">
                    <h4 className="_left_inner_area_explore_title _title5 _mar_b8">
                        Update password
                    </h4>
                    <p style={{ color: '#666', fontSize: '14px' }}>
                        Ensure your account is using a long, random password to stay secure
                    </p>
                </div>

                <Form
                    {...SecurityController.update.form()}
                    options={{
                        preserveScroll: true,
                    }}
                    resetOnError={[
                        'password',
                        'password_confirmation',
                        'current_password',
                    ]}
                    resetOnSuccess
                    onError={(errors) => {
                        if (errors.password) {
                            passwordInput.current?.focus();
                        }

                        if (errors.current_password) {
                            currentPasswordInput.current?.focus();
                        }
                    }}
                    className="_social_login_form"
                >
                    {({ errors, processing, recentlySuccessful }) => (
                        <>
                            <div className="_social_login_form_input _mar_b14">
                                <label className="_social_login_label _mar_b8">Current password</label>
                                <input
                                    type="password"
                                    id="current_password"
                                    ref={currentPasswordInput}
                                    name="current_password"
                                    className="form-control _social_login_input"
                                    autoComplete="current-password"
                                    placeholder="Current password"
                                />
                                <InputError message={errors.current_password} />
                            </div>

                            <div className="_social_login_form_input _mar_b14">
                                <label className="_social_login_label _mar_b8">New password</label>
                                <input
                                    type="password"
                                    id="password"
                                    ref={passwordInput}
                                    name="password"
                                    className="form-control _social_login_input"
                                    autoComplete="new-password"
                                    placeholder="New password"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="_social_login_form_input _mar_b14">
                                <label className="_social_login_label _mar_b8">Confirm password</label>
                                <input
                                    type="password"
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    className="form-control _social_login_input"
                                    autoComplete="new-password"
                                    placeholder="Confirm password"
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>

                            <div className="_social_login_form_btn _mar_t24 _mar_b16">
                                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                    <button
                                        type="submit"
                                        className="_social_login_form_btn_link _btn1"
                                        disabled={processing}
                                        data-test="update-password-button"
                                    >
                                        {processing ? 'Saving...' : 'Save password'}
                                    </button>

                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out"
                                        leaveTo="opacity-0"
                                    >
                                        <p style={{ fontSize: '14px', color: '#16a34a' }}>
                                            Saved
                                        </p>
                                    </Transition>
                                </div>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

Security.layout = undefined;
