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

export const Register = () => {
	const [type, setType] = useState(false);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	// const usersCollection = collection(db, 'users');

	async function signUp(evt) {
		evt.preventDefault();
		try {
			// Create user with email and password
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				evt.target[4].value,
				evt.target[6].value,
			);
			const user = userCredential.user;

			// Save additional user information in Firestore
			await setDoc(doc(db, 'users', user.uid), {
				name: evt.target[0].value,
				lastName: evt.target[2].value,
				status: 'true',
				email: evt.target[4].value,
				lastLogin: user.metadata.lastSignInTime,
			});

			await updateProfile(user, {
				displayName: evt.target[0].value,
			});

			evt.target[0].value = '';
			evt.target[2].value = '';
			evt.target[4].value = '';
			evt.target[6].value = '';
			toast.success('Promise resolved!!!');
			localStorage.setItem('token', user.accessToken);
			dispatch(addToken(user.accessToken));
			navigate('/');
		} catch (error) {
			toast.error('Promise error!!!');
			console.error('Error signing up user:', error.message);
		}
	}

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
				<form onSubmit={signUp}>
					<Stack width={'330px'} spacing={3}>
						<TextField type='text' label='Firs name' />
						<TextField type='text' label='Last name' />
						<TextField type='email' label='Email' />
						<TextField
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
