import { Form } from '@inertiajs/react';
import { useRef, useState } from 'react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import InputError from '@/components/input-error';

export default function DeleteUser() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const [showDialog, setShowDialog] = useState(false);

    return (
        <div className="_feed_inner_area _b_radious6 _padd_t24 _padd_b24 _padd_r24 _padd_l24 _mar_b24">
            <div className="_mar_b24">
                <h4 className="_left_inner_area_explore_title _title5 _mar_b8">
                    Delete account
                </h4>
                <p style={{ color: '#666', fontSize: '14px' }}>
                    Delete your account and all of its resources
                </p>
            </div>

            <div
                style={{
                    border: '1px solid #fecaca',
                    borderRadius: 8,
                    padding: 16,
                    background: 'rgba(239, 68, 68, 0.05)',
                }}
            >
                <div style={{ marginBottom: 12 }}>
                    <p style={{ fontWeight: 500, color: '#dc2626', marginBottom: 4 }}>Warning</p>
                    <p style={{ fontSize: '14px', color: '#dc2626', opacity: 0.8 }}>
                        Please proceed with caution, this cannot be undone.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setShowDialog(true)}
                    style={{
                        background: '#dc2626',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 8,
                        padding: '8px 20px',
                        fontSize: 14,
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                    }}
                    data-test="delete-user-button"
                >
                    Delete account
                </button>
            </div>

            {showDialog && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'rgba(0, 0, 0, 0.5)',
                        }}
                        onClick={() => setShowDialog(false)}
                    />
                    <div
                        style={{
                            position: 'relative',
                            background: '#fff',
                            borderRadius: 12,
                            padding: 24,
                            maxWidth: 420,
                            width: '90%',
                            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
                        }}
                    >
                        <h4 className="_left_inner_area_explore_title _title5 _mar_b8">
                            Are you sure you want to delete your account?
                        </h4>
                        <p style={{ color: '#666', fontSize: '14px', marginBottom: 20 }}>
                            Once your account is deleted, all of its resources and data will also be
                            permanently deleted. Please enter your password to confirm you would like to
                            permanently delete your account.
                        </p>

                        <Form
                            {...ProfileController.destroy.form()}
                            options={{
                                preserveScroll: true,
                            }}
                            onError={() => passwordInput.current?.focus()}
                            resetOnSuccess
                            className="_social_login_form"
                        >
                            {({ resetAndClearErrors, processing, errors }) => (
                                <>
                                    <div className="_social_login_form_input _mar_b14">
                                        <input
                                            type="password"
                                            id="delete_password"
                                            name="password"
                                            ref={passwordInput}
                                            className="form-control _social_login_input"
                                            placeholder="Password"
                                            autoComplete="current-password"
                                        />
                                        <InputError message={errors.password} />
                                    </div>

                                    <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                resetAndClearErrors();
                                                setShowDialog(false);
                                            }}
                                            style={{
                                                background: '#f3f4f6',
                                                color: '#374151',
                                                border: 'none',
                                                borderRadius: 8,
                                                padding: '8px 20px',
                                                fontSize: 14,
                                                fontWeight: 500,
                                                cursor: 'pointer',
                                            }}
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            type="submit"
                                            disabled={processing}
                                            data-test="confirm-delete-user-button"
                                            style={{
                                                background: '#dc2626',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: 8,
                                                padding: '8px 20px',
                                                fontSize: 14,
                                                fontWeight: 500,
                                                cursor: processing ? 'not-allowed' : 'pointer',
                                                opacity: processing ? 0.6 : 1,
                                            }}
                                        >
                                            Delete account
                                        </button>
                                    </div>
                                </>
                            )}
                        </Form>
                    </div>
                </div>
            )}
        </div>
    );
}
