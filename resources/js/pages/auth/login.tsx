import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { store } from '@/routes/login';
import { register } from '@/routes';
import { request as passwordRequest } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({ status, canResetPassword, canRegister }: Props) {
    return (
        <>
            <Head title="Log in" />

            <section className="_social_login_wrapper _layout_main_wrapper">
                <div className="_shape_one">
                    <img src="/assets/images/shape1.svg" alt="" className="_shape_img" />
                </div>
                <div className="_shape_two">
                    <img src="/assets/images/shape2.svg" alt="" className="_shape_img" />
                </div>
                <div className="_shape_three">
                    <img src="/assets/images/shape3.svg" alt="" className="_shape_img" />
                </div>

                <div className="_social_login_wrap">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
                                <div className="_social_login_left">
                                    <div className="_social_login_left_image">
                                        <img src="/assets/images/login.png" alt="Image" className="_left_img" />
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
                                <div className="_social_login_content">
                                    <div className="_social_login_left_logo _mar_b28">
                                        <img src="/assets/images/logo.svg" alt="Image" className="_left_logo" />
                                    </div>
                                    <p className="_social_login_content_para _mar_b8">Welcome back</p>
                                    <h4 className="_social_login_content_title _titl4 _mar_b50">Login to your account</h4>

                                    <Form
                                        {...store.form()}
                                        resetOnSuccess={['password']}
                                        className="_social_login_form"
                                    >
                                        {({ processing, errors }) => (
                                            <>
                                                <div className="row">
                                                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                                                        <div className="_social_login_form_input _mar_b14">
                                                            <label className="_social_login_label _mar_b8">Email</label>
                                                            <input
                                                                type="email"
                                                                name="email"
                                                                className="form-control _social_login_input"
                                                                required
                                                                autoFocus
                                                                tabIndex={1}
                                                                autoComplete="email"
                                                                placeholder="Enter your email"
                                                            />
                                                            {errors.email && <InputError message={errors.email} />}
                                                        </div>
                                                    </div>
                                                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                                                        <div className="_social_login_form_input _mar_b14">
                                                            <label className="_social_login_label _mar_b8">Password</label>
                                                            <input
                                                                type="password"
                                                                name="password"
                                                                className="form-control _social_login_input"
                                                                required
                                                                tabIndex={2}
                                                                autoComplete="current-password"
                                                                placeholder="Enter your password"
                                                            />
                                                            {errors.password && <InputError message={errors.password} />}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="row">
                                                    <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12">
                                                        <div className="form-check _social_login_form_check">
                                                            <input
                                                                type="checkbox"
                                                                id="remember"
                                                                name="remember"
                                                                className="form-check-input _social_login_form_check_input"
                                                                tabIndex={3}
                                                            />
                                                            <label
                                                                htmlFor="remember"
                                                                className="_social_login_form_check_label"
                                                            >
                                                                Remember me
                                                            </label>
                                                        </div>
                                                    </div>
                                                    {canResetPassword && (
                                                        <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12">
                                                            <div className="_social_login_form_left">
                                                                <Link
                                                                    href={passwordRequest()}
                                                                    className="_social_login_form_left_para"
                                                                    tabIndex={5}
                                                                >
                                                                    Forgot password?
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="row">
                                                    <div className="col-lg-12 col-md-12 col-xl-12 col-sm-12">
                                                        <div className="_social_login_form_btn _mar_t40 _mar_b60">
                                                            <button
                                                                type="submit"
                                                                className="_social_login_form_btn_link _btn1"
                                                                disabled={processing}
                                                                data-test="login-button"
                                                            >
                                                                {processing ? 'Logging in...' : 'Login now'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </Form>

                                    {canRegister && (
                                        <div className="row">
                                            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                                                <div className="_social_login_bottom_txt">
                                                    <p className="_social_login_bottom_txt_para">
                                                        Don't have an account?{' '}
                                                        <Link href={register()}>Create New Account</Link>
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

            {status && (
                <div style={{ textAlign: 'center', marginTop: 16, color: '#16a34a', fontSize: 14 }}>
                    {status}
                </div>
            )}
        </>
    );
}

Login.layout = (page: React.ReactNode) => page;
