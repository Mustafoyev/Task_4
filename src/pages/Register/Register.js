import React, { useState } from 'react';
import { Stack } from '@mui/system';
import registerImg from '../../assets/images/register.png';
import { Button, InputAdornment, TextField } from '@mui/material';
import { FaEyeSlash } from 'react-icons/fa';
import { FaEye } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import './register.scss';
import { db } from '../../firebase.config';
import { setDoc, doc } from 'firebase/firestore';
import { auth } from '../../firebase.config';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToken } from '../../redux/token/tokenAction';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { dateTime } from '../../dateTime';

export const Register = () => {
	const [type, setType] = useState(false);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const schema = Yup.object({
		name: Yup.string().required('Required'),
		lastName: Yup.string().required('Required'),
		email: Yup.string().email('Invalid email format').required('Required'),
		password: Yup.string()
			.min(6, 'Password must not be less than 6 characters')
			.max(9, 'Password must not exceed 9 characters')
			.required('Required'),
	});

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		mode: 'all',
		defaultValues: {
			name: '',
			lastName: '',
			email: '',
			password: '',
		},
		resolver: yupResolver(schema),
	});

	return (
		<div className='register-wrapper'>
			<div className='register-left-content'>
				<img
					className='register-img'
					src={registerImg}
					alt='Register'
					width={500}
					height={500}
				/>
			</div>
			<div className='register-right-content'>
				<h1 className='register-title'>Sign up</h1>
				<p className='register-text'>
					Already have an account?{' '}
					<Link className='register-link' to='/'>
						Sign in
					</Link>
				</p>
				<form
					onSubmit={handleSubmit(async (data) => {
						try {
							// Create user with email and password
							const userCredential = await createUserWithEmailAndPassword(
								auth,
								data.email,
								data.password,
							);
							const user = userCredential.user;

							// Save additional user information in Firestore
							await setDoc(doc(db, 'users', user.uid), {
								name: data.name,
								lastName: data.lastName,
								status: 'true',
								email: data.email,
								lastLogin: dateTime,
							});

							await updateProfile(user, {
								displayName: data.name,
							});
							reset();
							toast.success('Promise resolved!!!');
							localStorage.setItem('token', user?.accessToken);
							dispatch(addToken(user?.accessToken));
							navigate('/');
						} catch (error) {
							toast.error('Promise error!!!');
							console.error('Error signing up user:', error.message);
						}
					})}>
					<Stack width={'330px'} spacing={3}>
						<TextField
							{...register('name')}
							helperText={errors.name?.message}
							error={errors.name ? true : false}
							type='text'
							label='Firs name'
						/>
						<TextField
							{...register('lastName')}
							helperText={errors.lastName?.message}
							error={errors.lastName ? true : false}
							type='text'
							label='Last name'
						/>
						<TextField
							{...register('email')}
							helperText={errors.email?.message}
							error={errors.email ? true : false}
							type='email'
							label='Email'
						/>
						<TextField
							{...register('password')}
							helperText={errors?.password?.message}
							error={errors?.password ? true : false}
							type={type ? 'text' : 'password'}
							label='Password'
							InputProps={{
								endAdornment: (
									<InputAdornment onClick={() => setType(!type)} position='end'>
										{type ? (
											<FaEye style={{ cursor: 'pointer' }} size='28px' />
										) : (
											<FaEyeSlash style={{ cursor: 'pointer' }} size='28px' />
										)}
									</InputAdornment>
								),
							}}
						/>
						<Button
							type='submit'
							sx={{
								fontFamily: 'Red Hat Display',
								fontWeight: '500',
								fontSize: '18px',
								lineHeight: '200%',
								color: '#FFFFFF',
								backgroundColor: '#152540',
								borderRadius: '99px',
							}}
							variant='contained'
							size='large'>
							Next step
						</Button>
					</Stack>
				</form>
			</div>
			<ToastContainer
				position='top-right'
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme='light'
			/>
			<ToastContainer />
		</div>
	);
};
