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
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase.config';

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

	const handleSubmit = async (evt) => {
		evt.preventDefault();
		const status = users.filter((user) => user.email == evt.target[0].value);
		if (status[0].status) {
			const data = await signInWithEmailAndPassword(
				auth,
				evt.target[0].value,
				evt.target[2].value,
			);

			evt.target[0].value = '';
			evt.target[2].value = '';
			toast.success('Promise resolved!!!');
			localStorage.setItem('token', data?.user?.accessToken);
			dispatch(addToken(data?.user?.accessToken));
			navigate('/');
		} else {
			toast.error('You are blocked and cannot log in.');
		}
	};

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
				<form onSubmit={handleSubmit}>
					<Stack width={'330px'} spacing={3}>
						<TextField type='email' label='Email' />
						<TextField
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
