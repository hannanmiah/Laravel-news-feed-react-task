import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { login } from '@/routes';
import { store } from '@/routes/register';

type Props = {
    canLogin: boolean;
};

export default function Register({ canLogin }: Props) {
    return (
        <>
            <Head title="Register" />

            <section className="_social_registration_wrapper _layout_main_wrapper">
                <div className="_shape_one">
                    <img src="/assets/images/shape1.svg" alt="" className="_shape_img" />
                </div>
                <div className="_shape_two">
                    <img src="/assets/images/shape2.svg" alt="" className="_shape_img" />
                </div>
                <div className="_shape_three">
                    <img src="/assets/images/shape3.svg" alt="" className="_shape_img" />
                </div>

                <div className="_social_registration_wrap">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
                                <div className="_social_registration_right">
                                    <div className="_social_registration_right_image">
                                        <img src="/assets/images/registration.png" alt="Image" />
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
                                <div className="_social_registration_content">
                                    <div className="_social_registration_right_logo _mar_b28">
                                        <img src="/assets/images/logo.svg" alt="Image" className="_right_logo" />
                                    </div>
                                    <p className="_social_registration_content_para _mar_b8">Get Started Now</p>
                                    <h4 className="_social_registration_content_title _titl4 _mar_b50">Registration</h4>

                                    <Form
                                        {...store.form()}
                                        resetOnSuccess={['password', 'password_confirmation']}
                                        className="_social_registration_form"
                                    >
                                        {({ processing, errors }) => (
                                            <>
                                                <div className="row">
                                                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                                                        <div className="_social_registration_form_input _mar_b14">
                                                            <label className="_social_registration_label _mar_b8">First Name</label>
                                                            <input
                                                                type="text"
                                                                name="first_name"
                                                                className="form-control _social_registration_input"
                                                                required
                                                                autoFocus
                                                                tabIndex={1}
                                                                placeholder="First name"
                                                            />
                                                            {errors.first_name && <InputError message={errors.first_name} />}
                                                        </div>
                                                    </div>
                                                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                                                        <div className="_social_registration_form_input _mar_b14">
                                                            <label className="_social_registration_label _mar_b8">Last Name</label>
                                                            <input
                                                                type="text"
                                                                name="last_name"
                                                                className="form-control _social_registration_input"
                                                                required
                                                                tabIndex={2}
                                                                placeholder="Last name"
                                                            />
                                                            {errors.last_name && <InputError message={errors.last_name} />}
                                                        </div>
                                                    </div>
                                                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                                                        <div className="_social_registration_form_input _mar_b14">
                                                            <label className="_social_registration_label _mar_b8">Email</label>
                                                            <input
                                                                type="email"
                                                                name="email"
                                                                className="form-control _social_registration_input"
                                                                required
                                                                tabIndex={3}
                                                                autoComplete="email"
                                                                placeholder="email@example.com"
                                                            />
                                                            {errors.email && <InputError message={errors.email} />}
                                                        </div>
                                                    </div>
                                                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                                                        <div className="_social_registration_form_input _mar_b14">
                                                            <label className="_social_registration_label _mar_b8">Password</label>
                                                            <input
                                                                type="password"
                                                                name="password"
                                                                className="form-control _social_registration_input"
                                                                required
                                                                tabIndex={4}
                                                                autoComplete="new-password"
                                                                placeholder="Password"
                                                            />
                                                            {errors.password && <InputError message={errors.password} />}
                                                        </div>
                                                    </div>
                                                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                                                        <div className="_social_registration_form_input _mar_b14">
                                                            <label className="_social_registration_label _mar_b8">Repeat Password</label>
                                                            <input
                                                                type="password"
                                                                name="password_confirmation"
                                                                className="form-control _social_registration_input"
                                                                required
                                                                tabIndex={5}
                                                                autoComplete="new-password"
                                                                placeholder="Confirm password"
                                                            />
                                                            {errors.password_confirmation && <InputError message={errors.password_confirmation} />}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="row">
                                                    <div className="col-lg-12 col-xl-12 col-md-12 col-sm-12">
                                                        <div className="_social_registration_form_btn _mar_t40 _mar_b60">
                                                            <button
                                                                type="submit"
                                                                className="_social_registration_form_btn_link _btn1"
                                                                disabled={processing}
                                                                data-test="register-user-button"
                                                            >
                                                                {processing ? 'Creating account...' : 'Register now'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </Form>

                                    {canLogin && (
                                        <div className="row">
                                            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                                                <div className="_social_registration_bottom_txt">
                                                    <p className="_social_registration_bottom_txt_para">
                                                        Already have an account?{' '}
                                                        <Link href={login()}>Log in</Link>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

Register.layout = (page: React.ReactNode) => page;
