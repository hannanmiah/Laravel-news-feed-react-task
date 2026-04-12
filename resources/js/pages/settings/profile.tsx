import { Transition } from '@headlessui/react';
import { Form, Head, usePage } from '@inertiajs/react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import InputError from '@/components/input-error';

export default function Profile() {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Profile settings" />

            <h1 className="sr-only">Profile settings</h1>

            <div className="_feed_inner_area _b_radious6 _padd_t24 _padd_b24 _padd_r24 _padd_l24 _mar_b24">
                <div className="_mar_b24">
                    <h4 className="_left_inner_area_explore_title _title5 _mar_b8">
                        Profile information
                    </h4>
                    <p style={{ color: '#666', fontSize: '14px' }}>
                        Update your name and email address
                    </p>
                </div>

                <Form
                    {...ProfileController.update.form()}
                    options={{
                        preserveScroll: true,
                    }}
                    className="_social_login_form"
                >
                    {({ processing, recentlySuccessful, errors }) => (
                        <>
                            <div className="row">
                                <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                                    <div className="_social_login_form_input _mar_b14">
                                        <label className="_social_login_label _mar_b8">First name</label>
                                        <input
                                            id="first_name"
                                            type="text"
                                            className="form-control _social_login_input"
                                            defaultValue={auth.user.first_name}
                                            name="first_name"
                                            required
                                            autoComplete="given-name"
                                            placeholder="First name"
                                        />
                                        <InputError message={errors.first_name} />
                                    </div>
                                </div>
                                <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                                    <div className="_social_login_form_input _mar_b14">
                                        <label className="_social_login_label _mar_b8">Last name</label>
                                        <input
                                            id="last_name"
                                            type="text"
                                            className="form-control _social_login_input"
                                            defaultValue={auth.user.last_name}
                                            name="last_name"
                                            required
                                            autoComplete="family-name"
                                            placeholder="Last name"
                                        />
                                        <InputError message={errors.last_name} />
                                    </div>
                                </div>
                            </div>

                            <div className="_social_login_form_input _mar_b14">
                                <label className="_social_login_label _mar_b8">Email address</label>
                                <input
                                    id="email"
                                    type="email"
                                    className="form-control _social_login_input"
                                    defaultValue={auth.user.email}
                                    name="email"
                                    required
                                    autoComplete="username"
                                    placeholder="Email address"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="_social_login_form_btn _mar_t24 _mar_b16">
                                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                    <button
                                        type="submit"
                                        className="_social_login_form_btn_link _btn1"
                                        disabled={processing}
                                        data-test="update-profile-button"
                                    >
                                        {processing ? 'Saving...' : 'Save'}
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

            <DeleteUser />
        </>
    );
}

Profile.layout = undefined;
