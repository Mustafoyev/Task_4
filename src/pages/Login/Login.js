import React, { useEffect } from 'react';
import './login.scss';
import loginImg from '../../assets/images/login.png';
import { Button, InputAdornment, Stack, TextField } from '@mui/material';
import { useState } from 'react';
import { AiFillEye } from 'react-icons/ai';
import { AiFillEyeInvisible } from 'react-icons/ai';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase.config';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToken } from '../../redux/token/tokenAction';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { dateTime } from '../../dateTime';

export const Login = () => {
	const [type, setType] = useState(false);
	const [users, setUsers] = useState([]);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const usersCollection = collection(db, 'users');

	const getUsers = async () => {
		const data = await getDocs(usersCollection);
		setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
	};

	useEffect(() => {
		getUsers();
	}, []);

	const schema = Yup.object({
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
			email: '',
			password: '',
		},
		resolver: yupResolver(schema),
	});

	return (
		<div className='login'>
			<div className='login-left-content'>
				<img
					className='login-img'
					src={loginImg}
					alt='Login'
					width={500}
					height={500}
				/>
			</div>
			<div className='login-right-content'>
				<h1 className='login-title'>Sign in</h1>
				<p className='login-text'>
					Already have an account?{' '}
					<Link className='login-link' to='/register'>
						Sign up
					</Link>
				</p>
				<form
					onSubmit={handleSubmit(async (data) => {
						try {
							const status = users.filter((user) => user?.email == data?.email);

							if (status[0].status) {
								const newData = await signInWithEmailAndPassword(
									auth,
									data.email,
									data.password,
								);

								const updatedData = doc(db, 'users', status[0]?.id);
								const newUpdateData = { lastLogin: dateTime };
								await updateDoc(updatedData, newUpdateData);

								reset();
								toast.success('Promise resolved!!!');
								localStorage.setItem('token', newData?.user?.accessToken);
								dispatch(addToken(newData?.user?.accessToken));
								navigate('/');
							} else {
								toast.error('You are blocked and cannot log in.');
							}
						} catch (data) {
							toast.error('Invalid email or password');
						}
					})}>
					<Stack width={'330px'} spacing={3}>
						<TextField
							{...register('email')}
							helperText={errors?.email?.message}
							error={errors?.email ? true : false}
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
											<AiFillEyeInvisible
												style={{ cursor: 'pointer' }}
												size='28px'
												color={'#172B4D'}
											/>
										) : (
											<AiFillEye
												style={{ cursor: 'pointer' }}
												size='28px'
												color={'#172B4D'}
											/>
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
